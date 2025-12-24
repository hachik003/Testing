# 📋 New User Setup Checklist

Print this out or keep it open while setting up!

---

## Before You Start

- [ ] Python 3.8+ installed? (Check: `python3 --version`)
- [ ] Node.js 18+ installed? (Check: `node --version`)
- [ ] Got database password from project owner?

---

## Backend Setup

- [ ] Created `GroupF/.env` file in project root
- [ ] Added database password to `.env` file
- [ ] Opened terminal in `backend` folder
- [ ] Created virtual environment: `python3 -m venv venv`
- [ ] Activated virtual environment: `source venv/bin/activate`
- [ ] Installed dependencies: `pip install -r requirements.txt`
- [ ] Started backend: `flask --app app run --port 5001`
- [ ] Saw "✅ Database ready!" message
- [ ] Backend running on http://127.0.0.1:5001

---

## Frontend Setup

- [ ] Created `frontend-nextjs/.env.local` file
- [ ] Added API URL to `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5001/api`
- [ ] Opened NEW terminal in `frontend-nextjs` folder
- [ ] Installed dependencies: `npm install`
- [ ] Started frontend: `npm run dev`
- [ ] Saw "✓ Ready" message
- [ ] Frontend running on http://localhost:3000

---

## Testing

- [ ] Opened browser to http://localhost:3000
- [ ] Homepage loads successfully
- [ ] Can see club cards
- [ ] Can see events in the feed
- [ ] Can click "View Details" on a club
- [ ] Club details page loads with tabs

---

## If Stuck

**Backend not starting?**
- Check `.env` file exists in `GroupF/` (not `GroupF/backend/`)
- Verify database password is correct
- Make sure venv is activated (terminal should show `(venv)`)

**Frontend not starting?**
- Check `.env.local` exists in `frontend-nextjs/`
- Run `npm install` again
- Delete `node_modules` and run `npm install` fresh

**Port 5001 busy?**
- macOS: Disable AirPlay Receiver in System Settings
- Or use different port and update `.env.local`

**Data not loading?**
- Backend must be running first
- Check API URL in `.env.local` matches backend port
- Restart frontend after creating `.env.local`

---

## ✅ Success!

If all checkboxes are checked and app is running, you're done! 🎉

**Remember:** Keep both terminal windows open while using the app.

---

## Quick Commands Reference

**Start Backend:**
```bash
cd backend
source venv/bin/activate
flask --app app run --port 5001
```

**Start Frontend:**
```bash
cd frontend-nextjs
npm run dev
```

**Stop Servers:**
Press `Ctrl+C` in each terminal window
