# Setup Instructions for New Users

## 🚨 Important: First-Time Setup Required

When you receive this project, you need to set up the environment variables. Follow these steps:

---

## 📋 Prerequisites

- **Python 3.8+** installed
- **Node.js 18+** and npm installed
- **macOS, Windows, or Linux**

---

## 🔧 Step 1: Backend Setup

### 1.1 Create the `.env` file

The `.env` file contains sensitive database credentials and is not included in the repository.

**Create a file named `.env` in the project root directory** (`GroupF/.env`):

```bash
# Navigate to project root
cd GroupF

# Create .env file
touch .env
```

**Copy this content into the `.env` file:**

```bash
# Database Configuration (Railway-hosted MySQL)
DB_HOST=metro.proxy.rlwy.net
DB_PORT=23692
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_NAME=railway

# Flask Configuration
SECRET_KEY=your_secret_key_here_change_this_in_production
```

> ⚠️ **Ask the project owner for the actual database password!**

### 1.2 Install Backend Dependencies

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

### 1.3 Run Backend Server

```bash
# Make sure you're in the backend folder with venv activated
flask --app app run --port 5001
```

✅ **Success if you see:**
```
✅ Database ready! Railway MySQL connected successfully!
 * Running on http://127.0.0.1:5001
```

---

## 🎨 Step 2: Frontend Setup

### 2.1 Create `.env.local` file

**Create a file named `.env.local` in the `frontend-nextjs` folder:**

```bash
cd frontend-nextjs
touch .env.local
```

**Copy this content into `.env.local`:**

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 2.2 Install Frontend Dependencies

```bash
# Make sure you're in frontend-nextjs folder
npm install
```

### 2.3 Run Frontend Server

```bash
npm run dev
```

✅ **Success if you see:**
```
▲ Next.js 16.0.8
- Local:        http://localhost:3000
✓ Ready in 1s
```

---

## 🌐 Step 3: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the Club Management System homepage!

---

## 🔑 Default Login Credentials

**Club Accounts:**
- Email: `basketball@university.edu` | Password: `password123`
- Email: `tennis@university.edu` | Password: `password123`

**Or create a new student account** on the registration page.

---

## 🐛 Troubleshooting

### Problem: "Port 5001 already in use"

**On macOS:**
Port 5001 might be used by AirPlay Receiver.

**Solution 1:** Disable AirPlay Receiver
- System Settings → General → AirDrop & Handoff → Turn off "AirPlay Receiver"

**Solution 2:** Use a different port
```bash
flask --app app run --port 5002
```
Then update `frontend-nextjs/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5002/api
```

### Problem: "Could not connect to database"

- Check that the `.env` file exists in the project root
- Verify the database password with the project owner
- Make sure you have internet connection (Railway database is hosted online)

### Problem: "Module not found" errors

**Backend:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend-nextjs
rm -rf node_modules
npm install
```

### Problem: Frontend shows "Load failed"

1. Make sure backend is running on port 5001
2. Check that `.env.local` exists with correct API URL
3. Restart the frontend server after creating `.env.local`

---

## 📁 Project Structure

```
GroupF/
├── .env                          # ⚠️ YOU NEED TO CREATE THIS
├── backend/
│   ├── app.py                    # Flask backend
│   ├── requirements.txt          # Python dependencies
│   └── venv/                     # Virtual environment (created by you)
├── frontend-nextjs/
│   ├── .env.local                # ⚠️ YOU NEED TO CREATE THIS
│   ├── app/                      # Next.js pages
│   ├── package.json              # Node dependencies
│   └── node_modules/             # Dependencies (installed by npm)
└── SETUP_INSTRUCTIONS.md         # This file
```

---

## ✅ Quick Setup Checklist

- [ ] Created `.env` file in project root with database credentials
- [ ] Created `backend/venv` and installed Python dependencies
- [ ] Started backend on port 5001
- [ ] Created `frontend-nextjs/.env.local` with API URL
- [ ] Installed frontend dependencies with `npm install`
- [ ] Started frontend on port 3000
- [ ] Opened browser to http://localhost:3000
- [ ] Successfully logged in or created an account

---

## 🆘 Need Help?

Contact the project owner for:
- Database password
- Access issues
- Technical support

---

## 🚀 You're All Set!

If both servers are running and you can see the homepage, you're ready to go!

**Happy coding! 🎉**
