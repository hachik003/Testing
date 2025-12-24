# Club Management System - API Documentation

## Overview
This API supports a comprehensive club management system with features for student and club user authentication, club information management, event calendars, messaging, bookmarks, and media posting.

## Base URL
```
http://localhost:5000/api
```

## Database Schema

### User Types
1. **Students** - Can browse clubs, bookmark, message clubs, join clubs
2. **Club Users** - Can manage club information, post events, respond to messages

### Main Tables

#### students
- `studentID` (PK, String)
- `password` (String, hashed)
- `email` (String, unique)
- `firstName` (String)
- `lastName` (String)
- `major` (String, optional)
- `year` (String, optional)
- `createdAt` (DateTime)

#### club_users
- `clubUserID` (PK, Integer)
- `clubID` (FK to clubs)
- `email` (String, unique)
- `password` (String, hashed)
- `createdAt` (DateTime)

#### clubs
- `clubID` (PK, Integer)
- `clubName` (String, unique)
- `description` (Text)
- `category` (String) - Sport, Culture, Academic, Volunteer, Technology, etc.
- `meetingTime` (String)
- `meetingLocation` (String)
- `contactEmail` (String)
- `websiteURL` (String)
- `logoURL` (String)
- `createdAt` (DateTime)

#### events
- `eventID` (PK, Integer)
- `clubID` (FK to clubs)
- `eventName` (String)
- `description` (Text)
- `eventDate` (Date)
- `eventTime` (String)
- `eventLocation` (String)
- `imageURL` (String)
- `registrationRequired` (Boolean)
- `maxParticipants` (Integer)
- `createdAt` (DateTime)

#### media
- `mediaID` (PK, Integer)
- `clubID` (FK to clubs)
- `mediaType` (String) - 'photo' or 'video'
- `mediaURL` (String)
- `caption` (Text)
- `uploadedAt` (DateTime)

#### messages
- `messageID` (PK, Integer)
- `senderID` (FK to students)
- `clubID` (FK to clubs)
- `subject` (String)
- `messageText` (Text)
- `isRead` (Boolean)
- `sentAt` (DateTime)

#### bookmarks
- `bookmarkID` (PK, Integer)
- `studentID` (FK to students)
- `clubID` (FK to clubs)
- `bookmarkedAt` (DateTime)

#### club_members
- `membershipID` (PK, Integer)
- `studentID` (FK to students)
- `clubID` (FK to clubs)
- `role` (String) - Member, Officer, President
- `joinedAt` (DateTime)

---

## API Endpoints

## Feature 1: User Login & Authentication

### Register Student
```http
POST /api/auth/register/student
```

**Request Body:**
```json
{
  "studentID": "2021001234",
  "email": "john.doe@university.edu",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "major": "Computer Science",
  "year": "Sophomore"
}
```

**Response (201):**
```json
{
  "message": "Student registered successfully!",
  "user": {
    "studentID": "2021001234",
    "email": "john.doe@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "major": "Computer Science",
    "year": "Sophomore",
    "userType": "student"
  }
}
```

### Register Club
```http
POST /api/auth/register/club
```

**Request Body:**
```json
{
  "clubName": "Photography Club",
  "description": "Capture beautiful moments with fellow photography enthusiasts",
  "category": "Culture",
  "email": "photo@university.edu",
  "password": "clubPassword123",
  "meetingTime": "Every Wed, 5:00 PM",
  "meetingLocation": "Art Building Room 101",
  "websiteURL": "https://photoclub.com"
}
```

### Login (Universal)
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john.doe@university.edu",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful!",
  "user": {
    "studentID": "2021001234",
    "email": "john.doe@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "student"
  }
}
```

---

## Feature 2: Club/Circle Information Page

### Get All Clubs
```http
GET /api/clubs?category={category}&search={searchTerm}
```

**Query Parameters:**
- `category` (optional) - Filter by category (Sport, Culture, etc.)
- `search` (optional) - Search clubs by name

**Response (200):**
```json
[
  {
    "clubID": 1,
    "clubName": "Basketball Club",
    "description": "A fun and competitive basketball group...",
    "category": "Sport",
    "meetingTime": "Every Tue & Thu, 5:00 PM",
    "meetingLocation": "Gym A",
    "contactEmail": "basketball@university.edu",
    "websiteURL": null,
    "logoURL": null,
    "memberCount": 25,
    "eventCount": 3
  }
]
```

### Get Club Details
```http
GET /api/clubs/{club_id}
```

**Response (200):**
```json
{
  "clubID": 1,
  "clubName": "Basketball Club",
  "description": "...",
  "category": "Sport",
  "memberCount": 25,
  "eventCount": 3,
  "members": [...],
  "upcomingEvents": [...],
  "media": [...]
}
```

### Update Club Info
```http
PUT /api/clubs/{club_id}
```

**Request Body:**
```json
{
  "description": "Updated description",
  "meetingTime": "New meeting time",
  "meetingLocation": "New location"
}
```

### Get Club Categories
```http
GET /api/clubs/categories
```

**Response (200):**
```json
["Sport", "Culture", "Academic", "Volunteer", "Technology"]
```

---

## Feature 3: Media Posting System

### Get Club Media
```http
GET /api/clubs/{club_id}/media
```

**Response (200):**
```json
[
  {
    "mediaID": 1,
    "clubID": 1,
    "clubName": "Basketball Club",
    "mediaType": "photo",
    "mediaURL": "https://example.com/photo1.jpg",
    "caption": "Championship game highlights!",
    "uploadedAt": "2025-12-16T10:30:00"
  }
]
```

### Upload Media
```http
POST /api/clubs/{club_id}/media
```

**Request Body:**
```json
{
  "mediaType": "photo",
  "mediaURL": "https://example.com/image.jpg",
  "caption": "Great practice session today!"
}
```

### Delete Media
```http
DELETE /api/media/{media_id}
```

---

## Feature 4: Direct Messaging / Inquiry System

### Send Message to Club
```http
POST /api/messages
```

**Request Body:**
```json
{
  "senderID": "2021001234",
  "clubID": 1,
  "subject": "Interested in joining",
  "messageText": "Hi! I'm interested in joining your club. When are tryouts?"
}
```

### Get Club Inbox
```http
GET /api/clubs/{club_id}/messages
```

**Response (200):**
```json
[
  {
    "messageID": 1,
    "senderID": "2021001234",
    "senderName": "John Doe",
    "clubID": 1,
    "clubName": "Basketball Club",
    "subject": "Interested in joining",
    "messageText": "Hi! I'm interested...",
    "isRead": false,
    "sentAt": "2025-12-16T14:30:00"
  }
]
```

### Get Student's Sent Messages
```http
GET /api/students/{student_id}/messages
```

### Mark Message as Read
```http
PUT /api/messages/{message_id}/read
```

---

## Feature 5: Club Categorization System

Categories are stored as a string field in the clubs table. Available categories include:
- Sport
- Culture
- Academic
- Volunteer
- Research
- Arts
- Technology

Use the filter parameter in GET /api/clubs to filter by category.

---

## Feature 6: Bookmark / Favorites Feature

### Add Bookmark
```http
POST /api/bookmarks
```

**Request Body:**
```json
{
  "studentID": "2021001234",
  "clubID": 1
}
```

### Get Student Bookmarks
```http
GET /api/students/{student_id}/bookmarks
```

**Response (200):**
```json
[
  {
    "clubID": 1,
    "clubName": "Basketball Club",
    "description": "...",
    "category": "Sport",
    "bookmarkID": 5,
    "bookmarkedAt": "2025-12-15T10:00:00",
    "memberCount": 25,
    "eventCount": 3
  }
]
```

### Remove Bookmark
```http
DELETE /api/bookmarks/{bookmark_id}
```

---

## Feature 7 & 8: Events Feed & Shared Calendar

### Get All Events
```http
GET /api/events?start_date={YYYY-MM-DD}&end_date={YYYY-MM-DD}&club_id={id}
```

**Query Parameters:**
- `start_date` (optional) - Filter events from this date
- `end_date` (optional) - Filter events until this date
- `club_id` (optional) - Filter events by club

**Response (200):**
```json
[
  {
    "eventID": 1,
    "clubID": 1,
    "clubName": "Basketball Club",
    "eventName": "Championship Match",
    "description": "Championship match against rival school",
    "eventDate": "2025-12-20",
    "eventTime": "6:00 PM - 8:00 PM",
    "eventLocation": "Sports Complex Arena",
    "imageURL": null,
    "registrationRequired": false,
    "maxParticipants": null,
    "date": "20",
    "month": "Dec",
    "year": "2025"
  }
]
```

### Get Event Details
```http
GET /api/events/{event_id}
```

### Create Event
```http
POST /api/clubs/{club_id}/events
```

**Request Body:**
```json
{
  "eventName": "Winter Tournament",
  "description": "Annual winter basketball tournament",
  "eventDate": "2025-12-25",
  "eventTime": "3:00 PM - 6:00 PM",
  "eventLocation": "Main Gym",
  "imageURL": "https://example.com/event.jpg",
  "registrationRequired": true,
  "maxParticipants": 50
}
```

### Update Event
```http
PUT /api/events/{event_id}
```

### Delete Event
```http
DELETE /api/events/{event_id}
```

---

## Club Membership

### Get Club Members
```http
GET /api/clubs/{club_id}/members
```

**Response (200):**
```json
[
  {
    "membershipID": 1,
    "studentID": "2021001234",
    "studentName": "John Doe",
    "clubID": 1,
    "clubName": "Basketball Club",
    "role": "Member",
    "joinedAt": "2025-09-01T10:00:00"
  }
]
```

### Join Club
```http
POST /api/clubs/{club_id}/members
```

**Request Body:**
```json
{
  "studentID": "2021001234",
  "role": "Member"
}
```

### Leave Club
```http
DELETE /api/members/{membership_id}
```

---

## Utility Endpoints

### Health Check
```http
GET /api/health
```

### Get Platform Statistics
```http
GET /api/stats
```

**Response (200):**
```json
{
  "totalClubs": 5,
  "totalStudents": 150,
  "totalEvents": 12,
  "totalMessages": 45,
  "clubsByCategory": {
    "Sport": 2,
    "Culture": 2,
    "Technology": 1
  }
}
```

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request (missing fields, validation errors)
- **401** - Unauthorized (invalid credentials)
- **404** - Not Found
- **500** - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Description of the error"
}
```

---

## Authentication & Security

- Passwords are hashed using SHA256
- CORS is enabled for localhost:3000
- Session lifetime: 30 minutes
- Use HTTPS in production

---

## Default Test Accounts

### Club Logins
- Email: `basketball@university.edu` | Password: `password123`
- Email: `tennis@university.edu` | Password: `password123`
- Email: `art@university.edu` | Password: `password123`
- Email: `volunteer@university.edu` | Password: `password123`
- Email: `coding@university.edu` | Password: `password123`

Create your own student accounts via `/api/auth/register/student`

---

## Notes

1. All datetime fields are returned in ISO 8601 format
2. File uploads for media and logos should be handled separately (use a file storage service like AWS S3 or Cloudinary)
3. Implement proper authentication middleware for production
4. Add rate limiting for API endpoints
5. Consider implementing JWT tokens for better security
