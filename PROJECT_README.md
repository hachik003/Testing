# Club Management System - Complete Project

## Overview
A comprehensive web application for managing university clubs and student engagement. Features include user authentication, club information pages, event calendars, messaging system, bookmarks, and media posting.

## Features

### ✅ [1] User Login & Authentication
- Two user types: **Students** and **Club Administrators**
- Secure password hashing (SHA256)
- Separate registration endpoints for students and clubs
- Universal login endpoint

### ✅ [2] Club/Circle Information Page
- Detailed club profiles with descriptions, categories, meeting times/locations
- Member count and event statistics
- Contact information and website links
- Search and filter by category

### ✅ [3] Media Posting System
- Clubs can upload photos and videos
- Caption support for media items
- Gallery view of club media
- Delete media functionality

### ✅ [4] Direct Messaging / Inquiry System
- Students can send messages to clubs
- Message inbox for clubs
- Subject lines and message text
- Read/unread status tracking

### ✅ [5] Club Categorization System
- Categories: Sport, Culture, Academic, Volunteer, Research, Arts, Technology
- Filter clubs by category
- View all clubs in a specific category

### ✅ [6] Bookmark / Favorites Feature
- Students can bookmark clubs they're interested in
- View all bookmarked clubs
- Remove bookmarks
- Quick access to saved clubs

### ✅ [7] Events Feed
- Clubs can post upcoming events
- Event details: name, description, date, time, location
- Event images and registration requirements
- Create, update, and delete events

### ✅ [8] Shared Events Calendar
- Campus-wide calendar view of all events
- Filter events by date range
- Filter events by club
- Chronological event listing

### 🎁 Bonus Features
- **Club Membership Tracking**: Students can join clubs with role assignments
- **Platform Statistics**: Dashboard showing total clubs, students, events
- **Member Lists**: View all members of a club
- **Student Profile**: Store major, year, and personal information

---

## Technology Stack

### Backend
- **Framework**: Flask 3.1.2
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: SHA256 password hashing
- **CORS**: Flask-CORS for cross-origin requests
- **Environment**: python-dotenv for configuration

### Frontend (Existing)
- Next.js (TypeScript)
- React
- Tailwind CSS

---

## Database Schema

### Tables (8 total)
1. **students** - Student user accounts
2. **club_users** - Club administrator accounts
3. **clubs** - Club/organization information
4. **events** - Events and activities
5. **media** - Photos and videos
6. **messages** - Direct messages from students to clubs
7. **bookmarks** - Student's saved clubs
8. **club_members** - Club membership tracking

See `DATABASE_SCHEMA.md` for detailed schema documentation.

---

## API Endpoints

### Authentication (3 endpoints)
- `POST /api/auth/register/student` - Register new student
- `POST /api/auth/register/club` - Register new club
- `POST /api/auth/login` - Universal login

### Clubs (5 endpoints)
- `GET /api/clubs` - List all clubs (with filters)
- `GET /api/clubs/{id}` - Get club details
- `PUT /api/clubs/{id}` - Update club info
- `GET /api/clubs/categories` - Get all categories
- `GET /api/clubs/{id}/members` - Get club members

### Events (5 endpoints)
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/{id}` - Get event details
- `POST /api/clubs/{id}/events` - Create event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Media (3 endpoints)
- `GET /api/clubs/{id}/media` - Get club media
- `POST /api/clubs/{id}/media` - Upload media
- `DELETE /api/media/{id}` - Delete media

### Messages (4 endpoints)
- `POST /api/messages` - Send message
- `GET /api/clubs/{id}/messages` - Club inbox
- `GET /api/students/{id}/messages` - Student sent messages
- `PUT /api/messages/{id}/read` - Mark as read

### Bookmarks (3 endpoints)
- `POST /api/bookmarks` - Add bookmark
- `GET /api/students/{id}/bookmarks` - Get bookmarks
- `DELETE /api/bookmarks/{id}` - Remove bookmark

### Membership (2 endpoints)
- `POST /api/clubs/{id}/members` - Join club
- `DELETE /api/members/{id}` - Leave club

### Utility (2 endpoints)
- `GET /api/health` - Health check
- `GET /api/stats` - Platform statistics

**Total: 30+ API endpoints**

See `API_DOCUMENTATION.md` for detailed API documentation.

---

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+ (for frontend)
- ✅ **MySQL Database**: Already hosted on Railway (no local setup needed)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Configuration**
   
   ✅ **Already configured!** The project uses a Railway-hosted MySQL database.
   
   The `.env` file in the project root contains the database credentials:
   ```env
   DB_HOST=metro.proxy.rlwy.net
   DB_PORT=23692
   DB_USER=root
   DB_PASSWORD=***
   DB_NAME=railway
   SECRET_KEY=pbl4key
   ```
   
   **No local database setup required!**

5. **Run the application**
   ```bash
   python app.py
   ```
   
   The server will start on `http://localhost:5000`
   
   On first run, the application will:
   - Create all database tables
   - Seed default clubs
   - Create default club user accounts
   - Seed sample events

### Frontend Setup (Next.js)

1. **Navigate to frontend directory**
   ```bash
   cd frontend-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   
   The frontend will start on `http://localhost:3000`

---

## Default Test Accounts

### Club Accounts
All clubs have the default password: `password123`

| Email | Club | Category |
|-------|------|----------|
| basketball@university.edu | Basketball Club | Sport |
| tennis@university.edu | Tennis Club | Sport |
| art@university.edu | Art Club | Culture |
| volunteer@university.edu | Volunteer Society | Volunteer |
| coding@university.edu | Coding Club | Technology |

### Student Accounts
Create your own student account via the registration endpoint:
```bash
POST /api/auth/register/student
```

---

## Project Structure

```
GroupF/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables (create this)
│   ├── API_DOCUMENTATION.md      # Complete API docs
│   └── DATABASE_SCHEMA.md        # Database schema docs
├── frontend/
│   └── templates/                # Original HTML templates
│       ├── homepage.html
│       ├── club.html
│       ├── login.html
│       └── register.html
├── frontend-nextjs/              # Next.js frontend
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx            # Layout
│   │   └── schedule/
│   │       └── page.tsx          # Schedule page
│   ├── package.json
│   └── tsconfig.json
└── README.md                     # This file
```

---

## API Usage Examples

### Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register/student \
  -H "Content-Type: application/json" \
  -d '{
    "studentID": "2021001234",
    "email": "john.doe@university.edu",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "major": "Computer Science",
    "year": "Sophomore"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@university.edu",
    "password": "securePassword123"
  }'
```

### Get All Clubs
```bash
curl http://localhost:5000/api/clubs
```

### Filter Clubs by Category
```bash
curl http://localhost:5000/api/clubs?category=Sport
```

### Get Events
```bash
curl http://localhost:5000/api/events
```

### Send Message to Club
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "senderID": "2021001234",
    "clubID": 1,
    "subject": "Interested in joining",
    "messageText": "Hi! I would like to join your club."
  }'
```

### Bookmark a Club
```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{
    "studentID": "2021001234",
    "clubID": 1
  }'
```

---

## Development Notes

### Database Migrations
The application automatically creates tables on first run. If you need to reset:

```bash
# Drop all tables
DROP DATABASE club_management;
CREATE DATABASE club_management;

# Restart the application to recreate tables
python app.py
```

### Adding New Features

1. **Add Database Model**: Define in `app.py` under the models section
2. **Create API Endpoints**: Add routes in the API section
3. **Update Documentation**: Document in `API_DOCUMENTATION.md`
4. **Test**: Use curl or Postman to test endpoints

### Security Considerations

⚠️ **For Production:**
1. Replace SHA256 with bcrypt or Argon2
2. Implement JWT tokens for authentication
3. Add input validation and sanitization
4. Use HTTPS only
5. Implement rate limiting
6. Add CSRF protection
7. Set up proper CORS origins
8. Use environment-specific configurations

---

## Testing

### Test Database Connection
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-16T10:30:00"
}
```

### Test Platform Stats
```bash
curl http://localhost:5000/api/stats
```

---

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql.server status`
- Check credentials in `.env` file
- Ensure database exists: `SHOW DATABASES;`

### CORS Issues
- Verify frontend URL in CORS configuration
- Check browser console for specific errors
- Ensure OPTIONS requests are allowed

### Import Errors
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

### Port Already in Use
- Kill existing process: `lsof -ti:5000 | xargs kill -9`
- Or change port in `app.py`: `app.run(port=5001)`

---

## Future Enhancements

### Phase 2 Features
- [ ] Event registration system
- [ ] Club reviews and ratings
- [ ] Push notifications
- [ ] File uploads (profile pictures, club logos)
- [ ] Advanced search with tags
- [ ] Social sharing features
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Mobile app (React Native)

### Technical Improvements
- [ ] JWT authentication
- [ ] Redis caching
- [ ] Elasticsearch for search
- [ ] WebSocket for real-time chat
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit and integration tests
- [ ] API rate limiting
- [ ] Database backup automation

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This project is for educational purposes as part of PBL4 coursework.

---

## Team

**Project**: PBL4 - GroupF
**Organization**: PBL4-2025
**Repository**: github.com/PBL4-2025/GroupF

---

## Support

For issues or questions:
1. Check documentation in `API_DOCUMENTATION.md` and `DATABASE_SCHEMA.md`
2. Review troubleshooting section above
3. Open an issue on GitHub

---

**Last Updated**: December 16, 2025
