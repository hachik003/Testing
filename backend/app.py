from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS
from datetime import timedelta

from dotenv import load_dotenv
import os

load_dotenv()

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
app.permanent_session_lifetime = timedelta(minutes=5)

# Enable CORS for React frontend - Allow all origins for development
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

class users(db.Model):
    __tablename__ = "users"

    studentID = db.Column(db.String(11), primary_key=True, nullable=False, unique=True)
    password = db.Column(db.String(12), nullable=False)
    firstName = db.Column(db.String(20), nullable=False)
    lastName = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            "studentID": self.studentID,
            "firstName": self.firstName,
            "lastName": self.lastName
        }


class clubs(db.Model):
    __tablename__ = "clubs"

    clubID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clubName = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    meetingTime = db.Column(db.String(50), nullable=False)
    meetingLocation = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.clubID,
            "name": self.clubName,
            "description": self.description,
            "category": self.category,
            "meetingTime": self.meetingTime,
            "meetingLocation": self.meetingLocation
        }


class events(db.Model):
    __tablename__ = "events"

    eventID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clubID = db.Column(db.Integer, db.ForeignKey('clubs.clubID'), nullable=False)
    eventDate = db.Column(db.Date, nullable=False)
    eventTime = db.Column(db.String(50), nullable=False)
    eventLocation = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)

    club = db.relationship('clubs', backref='events')

    def to_dict(self):
        return {
            "id": self.eventID,
            "date": self.eventDate.strftime("%d"),
            "month": self.eventDate.strftime("%b"),
            "clubName": self.club.clubName,
            "description": self.description,
            "time": self.eventTime,
            "location": self.eventLocation
        }


default_clubs = [
    {
        "clubName": "Basketball Club",
        "description": "A fun and competitive basketball group for all skill levels.",
        "category": "Sport",
        "meetingTime": "Every Tue & Thu, 5 PM",
        "meetingLocation": "Gym A",
    },
    {
        "clubName": "Tennis Club",
        "description": "Weekly tennis practice and friendly matches.",
        "category": "Sport",
        "meetingTime": "Every Wed, 4 PM",
        "meetingLocation": "Tennis Courts",
    },
    {
        "clubName": "Art Club",
        "description": "Painting, drawing, and creative expression.",
        "category": "Culture",
        "meetingTime": "Every Fri, 3 PM",
        "meetingLocation": "Art Room 2",
    },
]


with app.app_context():
    db.create_all()

    # Seed clubs
    for club in default_clubs:
        existing = clubs.query.filter_by(clubName=club["clubName"]).first()
        if not existing:
            new_club = clubs(**club)
            db.session.add(new_club)
            print(f"Inserted club: {club['clubName']}")
        else:
            print(f"Skipped club (already exists): {club['clubName']}")

    db.session.commit()
    print("Club Seeding complete!")

    # Seed events
    from datetime import datetime, timedelta
    
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
        {
            "clubName": "Art Club",
            "eventDate": datetime.now().date() + timedelta(days=7),
            "eventTime": "3:00 PM - 5:00 PM",
            "eventLocation": "Art Room 2",
            "description": "Gallery opening for student artwork"
        },
        {
            "clubName": "Art Club",
            "eventDate": datetime.now().date() + timedelta(days=14),
            "eventTime": "2:00 PM - 4:00 PM",
            "eventLocation": "Art Room 2",
            "description": "Watercolor painting workshop"
        },
    ]

    for event_data in default_events:
        club = clubs.query.filter_by(clubName=event_data["clubName"]).first()
        if club:
            # Check if event already exists
            existing_event = events.query.filter_by(
                clubID=club.clubID,
                eventDate=event_data["eventDate"]
            ).first()
            
            if not existing_event:
                new_event = events(
                    clubID=club.clubID,
                    eventDate=event_data["eventDate"],
                    eventTime=event_data["eventTime"],
                    eventLocation=event_data["eventLocation"],
                    description=event_data["description"]
                )
                db.session.add(new_event)
                print(f"Inserted event: {event_data['clubName']} - {event_data['description']}")
            else:
                print(f"Skipped event (already exists): {event_data['clubName']} on {event_data['eventDate']}")

    db.session.commit()
    print("Event Seeding complete!")


# API Routes

@app.route("/api/clubs", methods=["GET"])
def get_clubs():
    """Get all clubs or filter by category"""
    category = request.args.get("category")
    
    if category and category != "All":
        all_clubs = clubs.query.filter_by(category=category).all()
    else:
        all_clubs = clubs.query.all()
    
    return jsonify([club.to_dict() for club in all_clubs])


@app.route("/api/clubs/<int:club_id>", methods=["GET"])
def get_club(club_id):
    """Get a specific club by ID"""
    club = clubs.query.get_or_404(club_id)
    return jsonify(club.to_dict())


@app.route("/api/events", methods=["GET"])
def get_events():
    """Get all upcoming events"""
    all_events = events.query.order_by(events.eventDate).all()
    return jsonify([event.to_dict() for event in all_events])


@app.route("/api/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not all(k in data for k in ["studentID", "firstName", "lastName", "password"]):
        return jsonify({"error": "Missing required fields"}), 400

    new_user = users(
        studentID=data["studentID"],
        password=data["password"],
        firstName=data["firstName"],
        lastName=data["lastName"],
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully!", "user": new_user.to_dict()}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 400


@app.route("/api/login", methods=["POST"])
def login():
    """Login a user"""
    data = request.get_json()
    
    if not all(k in data for k in ["studentID", "password"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    user = users.query.filter_by(studentID=data["studentID"]).first()
    
    if user and user.password == data["password"]:
        return jsonify({"message": "Login successful!", "user": user.to_dict()}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)