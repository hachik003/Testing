# Quick Start Guide - Club Management System

## 🚀 Get Started in 3 Minutes

### Step 1: Verify Database Connection (0 min)

✅ **Database is already configured!**
The project uses a Railway-hosted MySQL database. Connection details are in the `.env` file in the project root.

No local database setup needed!

### Step 2: Configure Backend (1 min)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Note**: The `.env` file with Railway database credentials is already in the project root directory. No configuration needed!

### Step 3: Run Backend (2 min)

```bash
python app.py
```

✅ You should see:
```
Database tables created!
✓ Inserted club: Basketball Club
✓ Inserted club: Tennis Club
...
Club seeding complete!
...
Default club login credentials:
Email: basketball@university.edu | Password: password123
...
 * Running on http://127.0.0.1:5000
```

### Step 4: Test API (1 min)

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all clubs
curl http://localhost:5000/api/clubs

# Get events
curl http://localhost:5000/api/events
```

---

## 🎯 Try These Features

### 1. Register a Student

```bash
curl -X POST http://localhost:5000/api/auth/register/student \
  -H "Content-Type: application/json" \
  -d '{
    "studentID": "2025001",
    "email": "student@university.edu",
    "password": "test123",
    "firstName": "Test",
    "lastName": "Student"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "test123"
  }'
```

### 3. Bookmark a Club

```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{
    "studentID": "2025001",
    "clubID": 1
  }'
```

### 4. Send Message to Club

```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "senderID": "2025001",
    "clubID": 1,
    "subject": "Want to join!",
    "messageText": "Hello! I am interested in joining your club."
  }'
```

### 5. Login as Club Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "basketball@university.edu",
    "password": "password123"
  }'
```

### 6. Check Club Messages

```bash
curl http://localhost:5000/api/clubs/1/messages
```

---

## 📱 Frontend Setup (Optional)

### Next.js Frontend

```bash
# In a new terminal, navigate to frontend
cd frontend-nextjs

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit: http://localhost:3000

---

## 🧪 Using Postman (Recommended)

1. **Import Collection**: Use the endpoints from `API_DOCUMENTATION.md`
2. **Set Base URL**: `http://localhost:5000/api`
3. **Test All Features**: Auth, Clubs, Events, Messages, Bookmarks

---

## 📊 View Default Data

### Default Clubs (5 clubs)
1. Basketball Club (Sport)
2. Tennis Club (Sport)
3. Art Club (Culture)
4. Volunteer Society (Volunteer)
5. Coding Club (Technology)

### Default Events (5 events)
- All seeded with dates in the near future
- Includes practice sessions, tournaments, workshops

### Default Club Logins
- **Email**: `basketball@university.edu` | **Password**: `password123`
- **Email**: `tennis@university.edu` | **Password**: `password123`
- **Email**: `art@university.edu` | **Password**: `password123`
- **Email**: `volunteer@university.edu` | **Password**: `password123`
- **Email**: `coding@university.edu` | **Password**: `password123`

---

## 🔍 Explore All Features

### ✅ Feature 1: Authentication
- Register students and clubs
- Login with email/password
- Two user types with different capabilities

### ✅ Feature 2: Club Information
- View all clubs with stats
- Filter by category
- Search by name
- View detailed club pages

### ✅ Feature 3: Media Posting
- Clubs upload photos/videos
- Add captions
- Delete media

### ✅ Feature 4: Messaging
- Students message clubs
- Clubs view inbox
- Mark messages as read

### ✅ Feature 5: Categories
- Sport, Culture, Academic, Volunteer, Technology
- Filter clubs by category

### ✅ Feature 6: Bookmarks
- Students save favorite clubs
- View all bookmarks
- Remove bookmarks

### ✅ Feature 7: Events Feed
- View all upcoming events
- Create/edit/delete events
- Event details with registration

### ✅ Feature 8: Calendar
- Campus-wide event calendar
- Filter by date range
- Filter by club

### 🎁 Bonus: Membership
- Students join clubs
- Track member roles
- View club members

---

## 🐛 Common Issues

### "Can't connect to MySQL"
```bash
# Check if MySQL is running
mysql.server status

# Start MySQL
mysql.server start
```

### "Database doesn't exist"
```sql
-- Login to MySQL and run:
CREATE DATABASE club_management;
```

### "Port 5000 already in use"
```bash
# Kill the process
lsof -ti:5000 | xargs kill -9

# Or change port in app.py
app.run(port=5001)
```

### "No module named 'flask'"
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

---

## 📚 Next Steps

1. **Read Full Documentation**: `API_DOCUMENTATION.md`
2. **Understand Database**: `DATABASE_SCHEMA.md`
3. **Complete Setup**: `PROJECT_README.md`
4. **Build Frontend**: Connect Next.js to API
5. **Add Features**: Extend functionality

---

## 💡 Development Tips

### Watch Database Changes
```bash
# Login to MySQL
mysql -u root -p club_management

# View tables
SHOW TABLES;

# View data
SELECT * FROM clubs;
SELECT * FROM students;
SELECT * FROM events;
```

### Check Logs
The Flask app prints helpful logs:
- Table creation
- Data seeding
- Request handling
- Errors

### Hot Reload
Flask runs in debug mode - changes to `app.py` will auto-reload the server.

---

## 🎉 You're Ready!

Your club management system is now running with:
- ✅ 8 database tables
- ✅ 30+ API endpoints
- ✅ 8 main features
- ✅ Sample data loaded
- ✅ Full documentation

**Happy coding! 🚀**
