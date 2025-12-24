# 🎓 Club Management System - PBL4 Group F

A full-stack web application for managing university clubs, events, and student engagement.

---

## 🚀 Quick Start for New Users

**⚠️ FIRST TIME SETUP REQUIRED!**

This project needs environment configuration before it will run. Choose your guide:

### 📚 Setup Guides (Pick One)

1. **[SETUP_FOR_TEAM.md](SETUP_FOR_TEAM.md)** - Quick 5-minute setup guide
2. **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Detailed step-by-step instructions  
3. **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Printable checklist to follow

### 🎯 Quick Summary

```bash
# 1. Create .env file in project root with database credentials
# 2. Create .env.local in frontend-nextjs folder
# 3. Install backend dependencies
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Start backend
flask --app app run --port 5001

# 5. Install frontend dependencies (new terminal)
cd frontend-nextjs
npm install

# 6. Start frontend
npm run dev

# 7. Open browser to http://localhost:3000
```

**⚠️ Ask project owner for database password!**

---

## 🏗️ Project Structure

```
GroupF/
├── backend/              # Flask REST API
├── frontend-nextjs/      # Next.js React frontend
├── .env                  # Database config (CREATE THIS)
└── README.md            # This file
```

---

## 🔧 Tech Stack

**Backend:**
- Flask 3.1.2
- SQLAlchemy
- MySQL (Railway hosted)
- Flask-CORS

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

---

## 📖 Documentation

- [SETUP_FOR_TEAM.md](SETUP_FOR_TEAM.md) - Quick setup guide
- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Detailed instructions
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Setup checklist
- [QUICK_START.md](QUICK_START.md) - Original quick start
- [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) - API endpoints
- [DATABASE_SCHEMA.md](backend/DATABASE_SCHEMA.md) - Database structure
- [FEATURES_COMPLETE.md](FEATURES_COMPLETE.md) - Feature list

---

## 🐛 Common Issues

**Port 5001 already in use (macOS):**
- System Settings → General → AirDrop & Handoff → Disable "AirPlay Receiver"

**Database connection failed:**
- Verify `.env` file exists in project root
- Check database password with project owner

**Frontend shows "Load failed":**
- Ensure backend is running on port 5001
- Check `.env.local` has correct API URL
- Restart frontend after creating `.env.local`

---

## 👥 Team

PBL4 - Group F

---

## 📝 License

Educational project for PBL4 course.

In a different terminal, set the current directory to frontend-nextjs and run the following line. This file should not be ran inside a virtual environment:

npm run dev 

If the React files do not run, run the following line first and try again: 

npm install
