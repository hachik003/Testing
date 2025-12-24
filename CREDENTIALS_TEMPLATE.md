# 🔐 Credentials for Team Members

**Share this information privately with team members who need to run the project.**

---

## Database Credentials

When creating the `.env` file, use these values:

```bash
DB_HOST=metro.proxy.rlwy.net
DB_PORT=23692
DB_USER=root
DB_PASSWORD=REPLACE_WITH_ACTUAL_PASSWORD
DB_NAME=railway
SECRET_KEY=replace_with_any_random_string
```

**⚠️ IMPORTANT:** 
- Replace `REPLACE_WITH_ACTUAL_PASSWORD` with the actual Railway database password
- Replace `replace_with_any_random_string` with any random text (e.g., "my_secret_key_12345")

---

## Where to Put This

**Backend `.env` file location:** `GroupF/.env` (project root, NOT in backend folder)

**Frontend `.env.local` file location:** `GroupF/frontend-nextjs/.env.local`

**Frontend `.env.local` content:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## Test Login Credentials

Once the app is running, you can log in with these default club accounts:

- **Email:** basketball@university.edu  
  **Password:** password123

- **Email:** tennis@university.edu  
  **Password:** password123

Or create a new student account on the registration page.

---

## 🔒 Security Notes

- **NEVER commit the `.env` file to git** (it's already in .gitignore)
- **NEVER commit the `.env.local` file to git** (it's already in .gitignore)
- Share credentials through secure channels only (not public Slack/Discord)
- Change passwords in production

---

## 📞 Questions?

If team members have trouble setting up:
1. Direct them to **SETUP_FOR_TEAM.md** for step-by-step instructions
2. Check they created files in the correct locations
3. Verify they're using the correct database password
