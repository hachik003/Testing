# ClubHub Frontend - Next.js Application

## Overview
Modern, responsive React frontend built with Next.js 14, TypeScript, and Tailwind CSS for the ClubHub club management system.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router with dynamic routes
- **API Integration**: Fetch API with Flask backend

## Pages & Features

### 1. Homepage (`/`)
**File**: `app/page.tsx`
- **Features**:
  - Navigation bar with authentication state
  - Featured clubs grid with category filtering
  - Upcoming events calendar
  - Category filter tabs
  - Login/Register or Profile/Logout buttons
- **Data Displayed**:
  - All clubs from API
  - Upcoming events feed
  - Category-based filtering (Academic, Sports, Arts, Technology, etc.)

### 2. Login Page (`/login`)
**File**: `app/login/page.tsx`
- **Features**:
  - Universal login for both students and clubs
  - Email and password authentication
  - Error handling with user feedback
  - Links to registration pages
  - Stores user data in localStorage
- **API Endpoint**: `POST /api/auth/login`

### 3. Registration Landing (`/register`)
**File**: `app/register/page.tsx`
- **Features**:
  - Choice between Student and Club registration
  - Feature comparison cards
  - Visual icons and descriptions
  - Responsive design

### 4. Student Registration (`/register/student`)
**File**: `app/register/student/page.tsx`
- **Features**:
  - Form fields: name, email, student ID, major, password
  - Password confirmation validation
  - Auto-login after successful registration
  - Error handling
- **API Endpoint**: `POST /api/auth/register/student`

### 5. Club Registration (`/register/club`)
**File**: `app/register/club/page.tsx`
- **Features**:
  - Form fields: club name, email, category, description, meeting time/location, password
  - Category dropdown selection
  - Multi-column responsive layout
  - Auto-login after successful registration
- **API Endpoint**: `POST /api/auth/register/club`

### 6. Club Detail Page (`/clubs/[id]`)
**File**: `app/clubs/[id]/page.tsx`
- **Features**:
  - **About Tab**: Club description, meeting time/location, member count
  - **Events Tab**: List of upcoming events with dates, times, locations
  - **Media Tab**: Photo gallery (placeholder for media uploads)
  - **Members Tab**: Grid of current club members
  - **Actions** (for students):
    - Bookmark/Unbookmark club
    - Join/Leave club
    - Send message to club
- **API Endpoints**:
  - `GET /api/clubs/{id}` - Club details
  - `GET /api/clubs/{id}/events` - Club events
  - `GET /api/clubs/{id}/media` - Club media
  - `GET /api/clubs/{id}/members` - Club members
  - `POST /api/clubs/{id}/members` - Join club
  - `DELETE /api/clubs/{id}/members/{memberID}` - Leave club

### 7. Bookmarks Page (`/bookmarks`)
**File**: `app/bookmarks/page.tsx`
- **Features**:
  - Grid display of bookmarked clubs
  - Quick access to club details
  - Remove bookmark functionality
  - Empty state with call-to-action
  - Shows bookmark date
- **Student Only**: Redirects to login if not authenticated
- **API Endpoints**:
  - `GET /api/students/{id}/bookmarks` - Get bookmarks
  - `POST /api/students/{id}/bookmarks` - Add bookmark
  - `DELETE /api/students/{id}/bookmarks/{clubID}` - Remove bookmark

### 8. Messages Page (`/messages`)
**File**: `app/messages/page.tsx`
- **Features**:
  - Split-view layout: conversations list + chat area
  - Send messages to clubs/students
  - Message history display
  - Real-time message sending
  - Support for URL parameters (e.g., `?clubID=1` from club detail page)
- **API Endpoints**:
  - `GET /api/messages/{userType}/{userID}` - Get messages
  - `POST /api/messages` - Send message

## Component Structure

### Navigation (in `app/page.tsx`)
- Logo and site name
- Navigation links (Home, Clubs, Events, Messages, Bookmarks)
- User authentication state display
- Login/Register or Profile/Logout buttons
- Responsive design with mobile menu support

### Layout (`app/layout.tsx`)
- Root layout with metadata
- Geist font integration
- Global styles and Tailwind CSS

## API Integration

### API Base URL
```typescript
const API_URL = 'http://localhost:5000/api';
```

### Authentication Flow
1. User logs in via `/login`
2. Backend returns user object
3. Store in `localStorage.setItem('user', JSON.stringify(user))`
4. Check auth state: `const userData = localStorage.getItem('user')`
5. Logout: `localStorage.removeItem('user')`

### User Object Structure
**Student**:
```typescript
{
  studentID: number;
  name: string;
  email: string;
  major: string;
  studentID: string;
}
```

**Club**:
```typescript
{
  clubID: number;
  clubName: string;
  email: string;
  category: string;
}
```

## Running the Frontend

### Install Dependencies
```bash
cd frontend-nextjs
npm install
```

### Development Server
```bash
npm run dev
```
Visit: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

## Environment Setup

### Required Backend
Make sure Flask backend is running on `http://localhost:5000`

```bash
cd backend
python app.py
```

## Key Features Implemented

✅ **User Authentication**
- Login for students and clubs
- Registration with validation
- Persistent sessions via localStorage

✅ **Club Discovery**
- Browse all clubs
- Filter by category
- View detailed club information

✅ **Event Management**
- View upcoming events
- Event details with date, time, location
- Club-specific event listings

✅ **Social Features**
- Bookmark favorite clubs
- Join/leave clubs
- Direct messaging
- View club members

✅ **Responsive Design**
- Mobile-friendly layouts
- Grid-based responsive components
- Tailwind CSS utility classes

## Styling Conventions

### Color Scheme
- **Primary**: Purple (`purple-600`, `purple-700`)
- **Secondary**: Blue (`blue-500`, `blue-600`)
- **Background**: Neutral gray (`neutral-100`)
- **Text**: Gray scale (`gray-600` to `gray-900`)

### Common Patterns
- **Cards**: White background, rounded-lg, shadow-md
- **Buttons**: Purple primary, white secondary, rounded-lg
- **Forms**: Border inputs with focus rings
- **Hover Effects**: Subtle shadow and color transitions

## TypeScript Types

All pages use proper TypeScript types:
```typescript
type Club = {
  clubID: number;
  clubName: string;
  category: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
};

type Event = {
  eventID: number;
  clubID: number;
  description: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
};

type Message = {
  messageID: number;
  senderID: number;
  senderType: 'student' | 'club';
  receiverID: number;
  receiverType: 'student' | 'club';
  messageText: string;
  sentAt: string;
};
```

## Next Steps for Enhancement

### Recommended Additions
1. **Events Page** (`/events`) - Dedicated events calendar view
2. **Profile Page** (`/profile`) - User profile management
3. **Search Functionality** - Full-text search for clubs
4. **Notifications** - Real-time updates for messages and events
5. **Image Uploads** - Media upload functionality for clubs
6. **Dark Mode** - Theme switching
7. **Mobile Menu** - Hamburger menu for mobile navigation

### Potential Improvements
- Add loading skeletons instead of simple "Loading..." text
- Implement pagination for clubs/events lists
- Add form validation libraries (Zod, React Hook Form)
- Implement WebSocket for real-time messaging
- Add toast notifications for user actions
- Implement infinite scroll for feeds

## Testing Accounts

### Default Credentials (from backend seeding)
**Clubs**:
- Email: `techclub@school.edu` / Password: `password123`
- Email: `sportsclub@school.edu` / Password: `password123`
- Email: `dramaclub@school.edu` / Password: `password123`
- Email: `debateclub@school.edu` / Password: `password123`
- Email: `musicclub@school.edu` / Password: `password123`

**Students**:
Register new accounts via `/register/student`

## Troubleshooting

### Common Issues

**1. API Connection Failed**
- Ensure Flask backend is running on port 5000
- Check CORS is enabled in Flask (`flask_cors` installed)

**2. TypeScript Errors**
- Run `npm run build` to check for type errors
- Ensure all dependencies are installed

**3. Styling Not Applied**
- Check Tailwind CSS configuration
- Restart dev server after config changes

**4. Authentication Issues**
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors
- Verify API endpoints are accessible

## File Structure
```
frontend-nextjs/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   ├── page.tsx         # Registration landing
│   │   ├── student/
│   │   │   └── page.tsx     # Student registration
│   │   └── club/
│   │       └── page.tsx     # Club registration
│   ├── clubs/
│   │   └── [id]/
│   │       └── page.tsx     # Club detail (dynamic)
│   ├── bookmarks/
│   │   └── page.tsx         # Bookmarks page
│   └── messages/
│       └── page.tsx         # Messages page
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
├── next.config.ts           # Next.js config
└── README.md               # This file
```

## License
MIT License - Part of PBL4 Group F Project
