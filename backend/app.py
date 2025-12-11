from flask import Flask, render_template, session, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
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

app = Flask(__name__, template_folder="../frontend/templates")
app.secret_key = os.getenv("SECRET_KEY", "hello")

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.permanent_session_lifetime = timedelta(minutes=5)

db = SQLAlchemy(app)

class users(db.Model):
    __tablename__ = "users"

    studentID = db.Column(db.String(11), primary_key=True, nullable=False, unique=True)
    password = db.Column(db.String(12), nullable=False)
    firstName = db.Column(db.String(20), nullable=False)
    lastName = db.Column(db.String(20), nullable=False)


class clubs(db.Model):
    __tablename__ = "clubs"

    clubID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clubName = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    meetingTime = db.Column(db.String(50), nullable=False)
    meetingLocation = db.Column(db.String(100), nullable=False)

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

    for club in default_clubs:
        existing = clubs.query.filter_by(clubName=club["clubName"]).first()
        if not existing:
            new_club = clubs(**club)
            db.session.add(new_club)
            print(f"Inserted: {club['clubName']}")
        else:
            print(f"Skipped (already exists): {club['clubName']}")

    db.session.commit()
    print("Seeding complete!")

@app.route("/")
def hello_world():
    return "Hello, Hachiko!"

@app.route("/roberto")
def hello_roberto():
    return "Hello, Roberto!"

@app.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "POST":
        studentID = request.form["studentID"]
        firstName = request.form["firstName"]
        lastName = request.form["lastName"]
        password = request.form["password"]

        new_user = users(
            studentID=studentID,
            password=password,
            firstName=firstName,
            lastName=lastName,
        )

        try:
            db.session.add(new_user)
            db.session.commit()
            return "User registered successfully!"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"There was an issue registering the user: {str(e)}"

    return render_template("register.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/homepage")
def homepage():
    all_clubs = clubs.query.all()
    return render_template("homepage.html", clubs=all_clubs)

@app.route("/club/<club_name>")
def club_page(club_name):
    club = clubs.query.filter_by(clubName=club_name).first_or_404()
    return render_template("club.html", club=club)

if __name__ == "__main__":
    app.run(debug=True)
