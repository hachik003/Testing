from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import hashlib

# Load environment variables from parent directory or current directory
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv()  # Also try current directory

HOST = os.getenv("DB_HOST")
PORT = os.getenv("DB_PORT")
USER = os.getenv("DB_USER")
PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "hello")

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_size": 10,
    "pool_recycle": 3600,
    "pool_pre_ping": True,
}
app.permanent_session_lifetime = timedelta(minutes=30)

# Enable CORS for React frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

db = SQLAlchemy(app)

# Manual CORS handling
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


# ============== DATABASE MODELS ==============

# [1] User Authentication - Two types: Student and Club
class students(db.Model):
    __tablename__ = "students"

    studentID = db.Column(db.String(20), primary_key=True, nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)  # hashed password
    email = db.Column(db.String(100), nullable=False, unique=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    major = db.Column(db.String(100), nullable=True)
    year = db.Column(db.String(20), nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    bookmarks = db.relationship('bookmarks', backref='student', cascade='all, delete-orphan')
    messages_sent = db.relationship('messages', foreign_keys='messages.senderID', backref='sender', cascade='all, delete-orphan')
    club_memberships = db.relationship('club_members', backref='student', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "studentID": self.studentID,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "major": self.major,
            "year": self.year,
            "userType": "student"
        }


class club_users(db.Model):
    __tablename__ = "club_users"

    clubUserID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clubID = db.Column(db.Integer, db.ForeignKey('clubs.clubID'), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)  # hashed password
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    club = db.relationship('clubs', backref=db.backref('club_user', uselist=False))

    def to_dict(self):
        return {
            "clubUserID": self.clubUserID,
            "clubID": self.clubID,
            "email": self.email,
            "clubName": self.club.clubName if self.club else None,
            "userType": "club"
        }


# [2] Club Information
class clubs(db.Model):
    __tablename__ = "clubs"

    clubID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clubName = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Sport, Culture, Academic, Volunteer, etc.
    meetingTime = db.Column(db.String(50), nullable=False)
    meetingLocation = db.Column(db.String(100), nullable=False)

    # Relationships
    events = db.relationship('events', backref='club', cascade='all, delete-orphan')
    media = db.relationship('media', backref='club', cascade='all, delete-orphan')
    messages = db.relationship('messages', backref='club', cascade='all, delete-orphan')
    members = db.relationship('club_members', backref='club', cascade='all, delete-orphan')
    bookmarks = db.relationship('bookmarks', backref='club', cascade='all, delete-orphan')

    def to_dict(self, include_stats=False):
        data = {
            "clubID": self.clubID,
            "clubName": self.clubName,
            "description": self.description,
            "category": self.category,
            "meetingTime": self.meetingTime,
            "meetingLocation": self.meetingLocation,
        }
        
        if include_stats:
            data["memberCount"] = len(self.members)
            data["eventCount"] = len([e for e in self.events if e.eventDate >= datetime.now().date()])
        
        return data


# [5] Club Categories (can be a simple enum or reference table)
# Categories: Sport, Culture, Academic, Volunteer, Research, Arts, Technology, etc.


# [2] & [8] Events & Calendar
class events(db.Model):
    __tablename__ = "events"

    eventID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clubID = db.Column(db.Integer, db.ForeignKey('clubs.clubID'), nullable=False)
    eventDate = db.Column(db.Date, nullable=False)
    eventTime = db.Column(db.String(50), nullable=False)
    eventLocation = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "eventID": self.eventID,
            "clubID": self.clubID,
            "clubName": self.club.clubName,
            "description": self.description,
            "eventDate": self.eventDate.isoformat(),
            "eventTime": self.eventTime,
            "eventLocation": self.eventLocation,
            # For calendar display
            "date": self.eventDate.strftime("%d"),
            "month": self.eventDate.strftime("%b"),
            "year": self.eventDate.strftime("%Y")
        }


# [3] Media Posting System
class media(db.Model):
    __tablename__ = "media"

    mediaID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clubID = db.Column(db.Integer, db.ForeignKey('clubs.clubID'), nullable=False)
    mediaType = db.Column(db.String(20), nullable=False)  # 'photo' or 'video'
    mediaURL = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text, nullable=True)
    uploadedAt = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "mediaID": self.mediaID,
            "clubID": self.clubID,
            "clubName": self.club.clubName,
            "mediaType": self.mediaType,
            "mediaURL": self.mediaURL,
            "caption": self.caption,
            "uploadedAt": self.uploadedAt.isoformat() if self.uploadedAt else None
        }


# [4] Direct Messaging / Inquiry System
class messages(db.Model):
    __tablename__ = "messages"

    messageID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    senderID = db.Column(db.String(20), db.ForeignKey('students.studentID'), nullable=False)
    clubID = db.Column(db.Integer, db.ForeignKey('clubs.clubID'), nullable=False)
    subject = db.Column(db.String(200), nullable=True)
    messageText = db.Column(db.Text, nullable=False)
    isRead = db.Column(db.Boolean, default=False)
    sentAt = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "messageID": self.messageID,
            "senderID": self.senderID,
            "senderName": f"{self.sender.firstName} {self.sender.lastName}",
            "clubID": self.clubID,
            "clubName": self.club.clubName,
            "subject": self.subject,
            "messageText": self.messageText,
            "isRead": self.isRead,
            "sentAt": self.sentAt.isoformat() if self.sentAt else None
        }


# [6] Bookmark / Favorites Feature
class bookmarks(db.Model):
    __tablename__ = "bookmarks"

    bookmarkID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    studentID = db.Column(db.String(20), db.ForeignKey('students.studentID'), nullable=False)
    clubID = db.Column(db.Integer, db.ForeignKey('clubs.clubID'), nullable=False)
    bookmarkedAt = db.Column(db.DateTime, default=datetime.utcnow)

    # Unique constraint to prevent duplicate bookmarks
    __table_args__ = (db.UniqueConstraint('studentID', 'clubID', name='unique_bookmark'),)

    def to_dict(self):
        return {
            "bookmarkID": self.bookmarkID,
            "studentID": self.studentID,
            "clubID": self.clubID,
            "clubName": self.club.clubName,
            "bookmarkedAt": self.bookmarkedAt.isoformat() if self.bookmarkedAt else None
        }


# Club Membership tracking
class club_members(db.Model):
    __tablename__ = "club_members"

    membershipID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    studentID = db.Column(db.String(20), db.ForeignKey('students.studentID'), nullable=False)
    clubID = db.Column(db.Integer, db.ForeignKey('clubs.clubID'), nullable=False)
    role = db.Column(db.String(50), default="Member")  # Member, Officer, President
    joinedAt = db.Column(db.DateTime, default=datetime.utcnow)

    # Unique constraint to prevent duplicate memberships
    __table_args__ = (db.UniqueConstraint('studentID', 'clubID', name='unique_membership'),)

    def to_dict(self):
        return {
            "membershipID": self.membershipID,
            "studentID": self.studentID,
            "studentName": f"{self.student.firstName} {self.student.lastName}",
            "clubID": self.clubID,
            "clubName": self.club.clubName,
            "role": self.role,
            "joinedAt": self.joinedAt.isoformat() if self.joinedAt else None
        }


# ============== HELPER FUNCTIONS ==============

def hash_password(password):
    """Hash a password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


# ============== DATABASE INITIALIZATION & SEEDING ==============

default_clubs = [
    {
        "clubName": "Basketball Club",
        "description": "A fun and competitive basketball group for all skill levels.",
        "category": "Sport",
        "meetingTime": "Every Tue & Thu, 5 PM",
        "meetingLocation": "Gym A",
        "email": "basketball@university.edu"
    },
    {
        "clubName": "Tennis Club",
        "description": "Weekly tennis practice and friendly matches.",
        "category": "Sport",
        "meetingTime": "Every Wed, 4 PM",
        "meetingLocation": "Tennis Courts",
        "email": "tennis@university.edu"
    },
    {
        "clubName": "Art Club",
        "description": "Painting, drawing, and creative expression.",
        "category": "Culture",
        "meetingTime": "Every Fri, 3 PM",
        "meetingLocation": "Art Room 2",
        "email": "art@university.edu"
    },
    {
        "clubName": "Volunteer Society",
        "description": "Make a difference in the community through volunteering.",
        "category": "Volunteer",
        "meetingTime": "Every Mon, 6 PM",
        "meetingLocation": "Student Center Room 201",
        "email": "volunteer@university.edu"
    },
    {
        "clubName": "Coding Club",
        "description": "Learn programming and build amazing projects together.",
        "category": "Technology",
        "meetingTime": "Every Thu, 7 PM",
        "meetingLocation": "Computer Lab",
        "email": "coding@university.edu"
    },
]


with app.app_context():
    db.create_all()
    print("Database tables created!")

    # Seed clubs
    for club_data in default_clubs:
        existing = clubs.query.filter_by(clubName=club_data["clubName"]).first()
        if not existing:
            # Create club without email field
            new_club = clubs(
                clubName=club_data["clubName"],
                description=club_data["description"],
                category=club_data["category"],
                meetingTime=club_data["meetingTime"],
                meetingLocation=club_data["meetingLocation"]
            )
            db.session.add(new_club)
            print(f"✓ Inserted club: {club_data['clubName']}")
        else:
            print(f"- Skipped club (already exists): {club_data['clubName']}")

    db.session.commit()
    print("Club seeding complete!")

    # Seed club users (for login)
    for club_data in default_clubs:
        club = clubs.query.filter_by(clubName=club_data["clubName"]).first()
        if club:
            email = club_data["email"]
            existing_user = club_users.query.filter_by(clubID=club.clubID).first()
            if not existing_user:
                club_user = club_users(
                    clubID=club.clubID,
                    email=email,
                    password=hash_password("password123")  # Default password
                )
                db.session.add(club_user)
                print(f"✓ Created club user for: {club_data['clubName']}")

    db.session.commit()
    print("Club user seeding complete!")

    # Only seed events if there are very few existing events
    event_count = events.query.count()
    if event_count < 3:
        print("Seeding sample events...")
        default_events = [
            {
                "clubName": "Basketball Club",
                "eventDate": datetime.now().date() + timedelta(days=3),
                "eventTime": "5:00 PM - 7:00 PM",
                "eventLocation": "Gym A",
                "description": "Practice game and team drills"
            },
            {
                "clubName": "Basketball Club",
                "eventDate": datetime.now().date() + timedelta(days=10),
                "eventTime": "6:00 PM - 8:00 PM",
                "eventLocation": "Sports Complex",
                "description": "Championship match against rival school"
            },
            {
                "clubName": "Tennis Club",
                "eventDate": datetime.now().date() + timedelta(days=5),
                "eventTime": "4:00 PM - 6:00 PM",
                "eventLocation": "Tennis Courts",
                "description": "Doubles tournament signup day"
            },
        ]

        for event_data in default_events:
            club = clubs.query.filter_by(clubName=event_data["clubName"]).first()
            if club:
                new_event = events(
                    clubID=club.clubID,
                    eventDate=event_data["eventDate"],
                    eventTime=event_data["eventTime"],
                    eventLocation=event_data["eventLocation"],
                    description=event_data["description"]
                )
                db.session.add(new_event)
                print(f"✓ Inserted event: {event_data['clubName']} - {event_data['description']}")

        db.session.commit()
    else:
        print(f"- Skipped event seeding ({event_count} events already exist)")
    
    print("Event seeding complete!\n")
    print("=" * 50)
    print("✅ Database ready! Railway MySQL connected successfully!")
    print("Default club login credentials:")
    print("Email: basketball@university.edu | Password: password123")
    print("Email: tennis@university.edu | Password: password123")
    print("=" * 50)


# ============== API ROUTES ==============

# [1] Authentication Routes

@app.route("/api/auth/register/student", methods=["POST"])
def register_student():
    """Register a new student"""
    data = request.get_json()
    
    required_fields = ["studentID", "email", "firstName", "lastName", "password"]
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if student already exists
    if students.query.filter_by(studentID=data["studentID"]).first():
        return jsonify({"error": "Student ID already registered"}), 400
    
    if students.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 400

    new_student = students(
        studentID=data["studentID"],
        email=data["email"],
        password=hash_password(data["password"]),
        firstName=data["firstName"],
        lastName=data["lastName"],
        major=data.get("major"),
        year=data.get("year")
    )

    try:
        db.session.add(new_student)
        db.session.commit()
        return jsonify({
            "message": "Student registered successfully!",
            "user": new_student.to_dict()
        }), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 400


@app.route("/api/auth/register/club", methods=["POST"])
def register_club():
    """Register a new club (creates both club and club_user)"""
    data = request.get_json()
    
    required_fields = ["clubName", "description", "category", "email", "password"]
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if club already exists
    if clubs.query.filter_by(clubName=data["clubName"]).first():
        return jsonify({"error": "Club name already registered"}), 400

    try:
        # Create club (only use fields that exist in Railway database)
        new_club = clubs(
            clubName=data["clubName"],
            description=data["description"],
            category=data["category"],
            meetingTime=data.get("meetingTime", "TBA"),
            meetingLocation=data.get("meetingLocation", "TBA")
        )
        db.session.add(new_club)
        db.session.flush()  # Get clubID

        # Create club user
        new_club_user = club_users(
            clubID=new_club.clubID,
            email=data["email"],
            password=hash_password(data["password"])
        )
        db.session.add(new_club_user)
        db.session.commit()

        return jsonify({
            "message": "Club registered successfully!",
            "club": new_club.to_dict(),
            "user": new_club_user.to_dict()
        }), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 400


@app.route("/api/auth/login", methods=["POST"])
def login():
    """Universal login for both students and clubs"""
    data = request.get_json()
    
    if not all(k in data for k in ["email", "password"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    hashed_pwd = hash_password(data["password"])
    
    # Try student login
    student = students.query.filter_by(email=data["email"]).first()
    if student and student.password == hashed_pwd:
        return jsonify({
            "message": "Login successful!",
            "user": student.to_dict()
        }), 200
    
    # Try club login
    club_user = club_users.query.filter_by(email=data["email"]).first()
    if club_user and club_user.password == hashed_pwd:
        return jsonify({
            "message": "Login successful!",
            "user": club_user.to_dict()
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401


# [2] Club Routes

@app.route("/api/clubs", methods=["GET"])
def get_clubs():
    """Get all clubs or filter by category"""
    category = request.args.get("category")
    search = request.args.get("search")
    
    query = clubs.query
    
    if category and category != "All":
        query = query.filter_by(category=category)
    
    if search:
        query = query.filter(clubs.clubName.ilike(f"%{search}%"))
    
    all_clubs = query.all()
    return jsonify([club.to_dict(include_stats=True) for club in all_clubs])


@app.route("/api/clubs/<int:club_id>", methods=["GET"])
def get_club(club_id):
    """Get detailed club information"""
    club = clubs.query.get_or_404(club_id)
    
    club_data = club.to_dict(include_stats=True)
    
    # Add additional details
    club_data["members"] = [m.to_dict() for m in club.members]
    club_data["upcomingEvents"] = [e.to_dict() for e in club.events if e.eventDate >= datetime.now().date()]
    club_data["media"] = [m.to_dict() for m in club.media]
    
    return jsonify(club_data)


@app.route("/api/clubs/<int:club_id>", methods=["PUT"])
def update_club(club_id):
    """Update club information (club users only)"""
    club = clubs.query.get_or_404(club_id)
    data = request.get_json()
    
    # Update allowed fields (only existing columns in Railway database)
    if "description" in data:
        club.description = data["description"]
    if "meetingTime" in data:
        club.meetingTime = data["meetingTime"]
    if "meetingLocation" in data:
        club.meetingLocation = data["meetingLocation"]
    if "category" in data:
        club.category = data["category"]
    
    try:
        db.session.commit()
        return jsonify({"message": "Club updated successfully!", "club": club.to_dict()}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/clubs/categories", methods=["GET"])
def get_categories():
    """Get list of all club categories"""
    categories = db.session.query(clubs.category).distinct().all()
    return jsonify([cat[0] for cat in categories])


# [3] Media Routes

@app.route("/api/clubs/<int:club_id>/media", methods=["GET"])
def get_club_media(club_id):
    """Get all media for a club"""
    club_media = media.query.filter_by(clubID=club_id).order_by(media.uploadedAt.desc()).all()
    return jsonify([m.to_dict() for m in club_media])


@app.route("/api/clubs/<int:club_id>/media", methods=["POST"])
def upload_media(club_id):
    """Upload media (photo/video) for a club"""
    data = request.get_json()
    
    if not all(k in data for k in ["mediaType", "mediaURL"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    new_media = media(
        clubID=club_id,
        mediaType=data["mediaType"],
        mediaURL=data["mediaURL"],
        caption=data.get("caption")
    )
    
    try:
        db.session.add(new_media)
        db.session.commit()
        return jsonify({"message": "Media uploaded successfully!", "media": new_media.to_dict()}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/media/<int:media_id>", methods=["DELETE"])
def delete_media(media_id):
    """Delete a media item"""
    media_item = media.query.get_or_404(media_id)
    
    try:
        db.session.delete(media_item)
        db.session.commit()
        return jsonify({"message": "Media deleted successfully!"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# [4] Messaging Routes

@app.route("/api/messages", methods=["POST"])
def send_message():
    """Send a message from student to club"""
    data = request.get_json()
    
    if not all(k in data for k in ["senderID", "clubID", "messageText"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    new_message = messages(
        senderID=data["senderID"],
        clubID=data["clubID"],
        subject=data.get("subject"),
        messageText=data["messageText"]
    )
    
    try:
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"message": "Message sent successfully!", "data": new_message.to_dict()}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/clubs/<int:club_id>/messages", methods=["GET"])
def get_club_messages(club_id):
    """Get all messages for a club (inbox)"""
    club_messages = messages.query.filter_by(clubID=club_id).order_by(messages.sentAt.desc()).all()
    return jsonify([m.to_dict() for m in club_messages])


@app.route("/api/students/<string:student_id>/messages", methods=["GET"])
def get_student_messages(student_id):
    """Get all messages sent by a student"""
    student_messages = messages.query.filter_by(senderID=student_id).order_by(messages.sentAt.desc()).all()
    return jsonify([m.to_dict() for m in student_messages])


@app.route("/api/messages/<int:message_id>/read", methods=["PUT"])
def mark_message_read(message_id):
    """Mark a message as read"""
    message = messages.query.get_or_404(message_id)
    message.isRead = True
    
    try:
        db.session.commit()
        return jsonify({"message": "Message marked as read"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# [6] Bookmark Routes

@app.route("/api/bookmarks", methods=["POST"])
def add_bookmark():
    """Add a club to student's bookmarks"""
    data = request.get_json()
    
    if not all(k in data for k in ["studentID", "clubID"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if bookmark already exists
    existing = bookmarks.query.filter_by(
        studentID=data["studentID"],
        clubID=data["clubID"]
    ).first()
    
    if existing:
        return jsonify({"error": "Club already bookmarked"}), 400
    
    new_bookmark = bookmarks(
        studentID=data["studentID"],
        clubID=data["clubID"]
    )
    
    try:
        db.session.add(new_bookmark)
        db.session.commit()
        return jsonify({"message": "Bookmark added!", "bookmark": new_bookmark.to_dict()}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/students/<string:student_id>/bookmarks", methods=["GET"])
def get_student_bookmarks(student_id):
    """Get all bookmarked clubs for a student"""
    student_bookmarks = bookmarks.query.filter_by(studentID=student_id).all()
    
    # Return detailed club information
    result = []
    for bookmark in student_bookmarks:
        club_data = bookmark.club.to_dict(include_stats=True)
        club_data["bookmarkID"] = bookmark.bookmarkID
        club_data["bookmarkedAt"] = bookmark.bookmarkedAt.isoformat()
        result.append(club_data)
    
    return jsonify(result)


@app.route("/api/bookmarks/<int:bookmark_id>", methods=["DELETE"])
def remove_bookmark(bookmark_id):
    """Remove a bookmark"""
    bookmark = bookmarks.query.get_or_404(bookmark_id)
    
    try:
        db.session.delete(bookmark)
        db.session.commit()
        return jsonify({"message": "Bookmark removed successfully!"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# [7] & [8] Events Routes

@app.route("/api/events", methods=["GET"])
def get_events():
    """Get all upcoming events (calendar view)"""
    # Filter parameters
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    club_id = request.args.get("club_id")
    
    query = events.query.filter(events.eventDate >= datetime.now().date())
    
    if start_date:
        query = query.filter(events.eventDate >= datetime.strptime(start_date, "%Y-%m-%d").date())
    if end_date:
        query = query.filter(events.eventDate <= datetime.strptime(end_date, "%Y-%m-%d").date())
    if club_id:
        query = query.filter_by(clubID=int(club_id))
    
    all_events = query.order_by(events.eventDate, events.eventTime).all()
    return jsonify([event.to_dict() for event in all_events])


@app.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    """Get detailed event information"""
    event = events.query.get_or_404(event_id)
    return jsonify(event.to_dict())


@app.route("/api/clubs/<int:club_id>/events", methods=["GET", "POST"])
def club_events(club_id):
    """Get all events for a club or create a new event"""
    if request.method == "GET":
        # Get all events for this club
        club_events = events.query.filter_by(clubID=club_id).all()
        return jsonify([event.to_dict() for event in club_events]), 200
    
    elif request.method == "POST":
        # Create a new event for a club
        data = request.get_json()
        
        required_fields = ["description", "eventDate", "eventTime", "eventLocation"]
        if not all(k in data for k in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        new_event = events(
            clubID=club_id,
            description=data["description"],
            eventDate=datetime.strptime(data["eventDate"], "%Y-%m-%d").date(),
            eventTime=data["eventTime"],
            eventLocation=data["eventLocation"]
        )
        
        try:
            db.session.add(new_event)
            db.session.commit()
            return jsonify({"message": "Event created successfully!", "event": new_event.to_dict()}), 201
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400


@app.route("/api/events/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    """Update an event"""
    event = events.query.get_or_404(event_id)
    data = request.get_json()
    
    if "description" in data:
        event.description = data["description"]
    if "eventDate" in data:
        event.eventDate = datetime.strptime(data["eventDate"], "%Y-%m-%d").date()
    if "eventTime" in data:
        event.eventTime = data["eventTime"]
    if "eventLocation" in data:
        event.eventLocation = data["eventLocation"]
    
    try:
        db.session.commit()
        return jsonify({"message": "Event updated successfully!", "event": event.to_dict()}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    """Delete an event"""
    event = events.query.get_or_404(event_id)
    
    try:
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Event deleted successfully!"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# Club Membership Routes

@app.route("/api/clubs/<int:club_id>/members", methods=["GET"])
def get_club_members(club_id):
    """Get all members of a club"""
    members = club_members.query.filter_by(clubID=club_id).all()
    return jsonify([m.to_dict() for m in members])


@app.route("/api/clubs/<int:club_id>/members", methods=["POST"])
def join_club(club_id):
    """Student joins a club"""
    data = request.get_json()
    
    if "studentID" not in data:
        return jsonify({"error": "Missing studentID"}), 400
    
    # Check if already a member
    existing = club_members.query.filter_by(
        studentID=data["studentID"],
        clubID=club_id
    ).first()
    
    if existing:
        return jsonify({"error": "Already a member of this club"}), 400
    
    new_member = club_members(
        studentID=data["studentID"],
        clubID=club_id,
        role=data.get("role", "Member")
    )
    
    try:
        db.session.add(new_member)
        db.session.commit()
        return jsonify({"message": "Joined club successfully!", "membership": new_member.to_dict()}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/api/members/<int:membership_id>", methods=["DELETE"])
def leave_club(membership_id):
    """Student leaves a club"""
    membership = club_members.query.get_or_404(membership_id)
    
    try:
        db.session.delete(membership)
        db.session.commit()
        return jsonify({"message": "Left club successfully!"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# Utility Routes

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Get platform statistics"""
    stats = {
        "totalClubs": clubs.query.count(),
        "totalStudents": students.query.count(),
        "totalEvents": events.query.filter(events.eventDate >= datetime.now().date()).count(),
        "totalMessages": messages.query.count(),
        "clubsByCategory": {}
    }
    
    # Count clubs by category
    categories = db.session.query(clubs.category, db.func.count(clubs.clubID)).group_by(clubs.category).all()
    for category, count in categories:
        stats["clubsByCategory"][category] = count
    
    return jsonify(stats)


if __name__ == "__main__":
    app.run(debug=True, port=5000)