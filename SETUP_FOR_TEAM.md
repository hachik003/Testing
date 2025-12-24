# 🚀 Quick Setup for New Team Members

## ⚠️ IMPORTANT: First Time Setup

This project **will NOT work immediately** after cloning because:
1. The `.env` file (database credentials) is not included in the repository
2. The `frontend-nextjs/.env.local` file is not included

**You MUST create these files first!**

---

## 📝 Setup Checklist (5 minutes)

### ✅ Step 1: Get Database Credentials
**Ask the project owner for:**
- Database password
- Any other sensitive credentials

### ✅ Step 2: Create Backend `.env` File

**Location:** `GroupF/.env` (project root, NOT in backend folder)

```bash
# Copy the example file
cp backend/.env.example .env

# Edit .env and add the real database password
# (Use any text editor: nano, vim, VS Code, etc.)
```

**The `.env` file should contain:**
```bash
DB_HOST=metro.proxy.rlwy.net
DB_PORT=23692
DB_USER=root
DB_PASSWORD=REAL_PASSWORD_FROM_OWNER
DB_NAME=railway
SECRET_KEY=any_random_string_here
```

### ✅ Step 3: Create Frontend `.env.local` File

**Location:** `GroupF/frontend-nextjs/.env.local`

```bash
cd frontend-nextjs
cp .env.local.example .env.local
```

**The `.env.local` file should contain:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### ✅ Step 4: Install & Run Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# OR: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
flask --app app run --port 5001
```

### ✅ Step 5: Install & Run Frontend

```bash
# Open a NEW terminal window
cd frontend-nextjs

# Install dependencies
npm install

# Run server
npm run dev
```

### ✅ Step 6: Open Browser

Go to: **http://localhost:3000**

---

## 🐛 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| **"No module named 'flask'"** | Activate venv: `source backend/venv/bin/activate` then `pip install -r requirements.txt` |
| **"Port 5001 already in use"** | On macOS: Disable AirPlay Receiver in System Settings |
| **"Cannot connect to database"** | Check `.env` file exists in project root with correct password |
| **"Load failed" in browser** | Make sure backend is running on port 5001 |
| **Changes not showing** | Restart both servers after creating `.env` files |

---

## 📂 Critical Files Needed

```
GroupF/
├── .env                          ⚠️ CREATE THIS (see Step 2)
├── backend/
│   └── venv/                     ⚠️ CREATED by python -m venv venv
└── frontend-nextjs/
    ├── .env.local                ⚠️ CREATE THIS (see Step 3)
    └── node_modules/             ⚠️ CREATED by npm install
```

---

## 📖 Full Documentation

See **SETUP_INSTRUCTIONS.md** for detailed instructions and troubleshooting.

---

## ✅ Verify Setup Works

If you can:
- ✅ Start backend without errors
- ✅ Start frontend without errors  
- ✅ See the homepage at http://localhost:3000
- ✅ See clubs and events loading

**You're all set! 🎉**

---

## 🆘 Still Having Issues?

Contact the project owner with:
- Screenshot of the error
- Which step you're stuck on
- Your operating system (macOS/Windows/Linux)
