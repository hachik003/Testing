# System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Next.js    │  │    React     │  │   Tailwind   │     │
│  │  TypeScript  │  │  Components  │  │     CSS      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│         HTTP Requests (JSON) to http://localhost:5000       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    BACKEND (Flask)                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              API Layer (32 Endpoints)              │    │
│  │                                                     │    │
│  │  Authentication  │  Clubs  │  Events  │  Media    │    │
│  │  Messages  │  Bookmarks  │  Members  │  Stats     │    │
│  └─────────────────────┬──────────────────────────────┘    │
│                        │                                     │
│  ┌─────────────────────▼──────────────────────────────┐    │
│  │         Business Logic & Models (ORM)              │    │
│  │                                                     │    │
│  │  SQLAlchemy Models: 8 Tables                       │    │
│  │  - students        - events                        │    │
│  │  - club_users      - media                         │    │
│  │  - clubs           - messages                      │    │
│  │  - bookmarks       - club_members                  │    │
│  └─────────────────────┬──────────────────────────────┘    │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │ SQL Queries
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                   DATABASE (MySQL)                            │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ students │  │  clubs   │  │  events  │  │  media   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ messages │  │bookmarks │  │club_users│  │club_     │   │
│  │          │  │          │  │          │  │members   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagrams

### Student User Journey

```
┌─────────────┐
│   Student   │
│  Registers  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Login     │
│ (Email/Pass)│
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│        Student Dashboard             │
│                                      │
│  ┌────────────┐  ┌────────────┐    │
│  │   Browse   │  │  Search    │    │
│  │   Clubs    │  │   Clubs    │    │
│  └──────┬─────┘  └──────┬─────┘    │
│         │                │           │
│         └────────┬───────┘           │
│                  ▼                   │
│         ┌────────────────┐           │
│         │  Club Details  │           │
│         │   - Info       │           │
│         │   - Members    │           │
│         │   - Events     │           │
│         │   - Media      │           │
│         └────────┬───────┘           │
│                  │                   │
│         ┌────────┴────────┐          │
│         │                 │          │
│    ┌────▼────┐     ┌─────▼────┐     │
│    │Bookmark │     │  Join    │     │
│    │  Club   │     │  Club    │     │
│    └─────────┘     └──────────┘     │
│                                      │
│    ┌─────────────┐  ┌─────────────┐ │
│    │   Send      │  │    View     │ │
│    │  Message    │  │   Events    │ │
│    │  to Club    │  │  Calendar   │ │
│    └─────────────┘  └─────────────┘ │
└──────────────────────────────────────┘
```

### Club Admin Journey

```
┌─────────────┐
│    Club     │
│  Registers  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Login     │
│ (Email/Pass)│
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│         Club Dashboard               │
│                                      │
│  ┌────────────┐  ┌────────────┐    │
│  │   Update   │  │    View    │    │
│  │    Club    │  │   Members  │    │
│  │    Info    │  │            │    │
│  └────────────┘  └────────────┘    │
│                                      │
│  ┌────────────┐  ┌────────────┐    │
│  │   Create   │  │   Upload   │    │
│  │   Events   │  │    Media   │    │
│  └────────────┘  └────────────┘    │
│                                      │
│  ┌────────────┐  ┌────────────┐    │
│  │    View    │  │   Respond  │    │
│  │   Inbox    │  │    to      │    │
│  │  Messages  │  │  Messages  │    │
│  └────────────┘  └────────────┘    │
└──────────────────────────────────────┘
```

---

## Feature Architecture

### [1] Authentication System

```
┌─────────────────────────────────────┐
│         Authentication              │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Register Student           │  │
│  │   POST /api/auth/register/   │  │
│  │         student               │  │
│  │                               │  │
│  │   Input: ID, email, password, │  │
│  │          name, major, year    │  │
│  │   Hash password (SHA256)      │  │
│  │   Store in students table     │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Register Club              │  │
│  │   POST /api/auth/register/   │  │
│  │         club                  │  │
│  │                               │  │
│  │   Input: name, email, pass,  │  │
│  │          category, etc.       │  │
│  │   Create club record          │  │
│  │   Create club_user account    │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Login (Universal)          │  │
│  │   POST /api/auth/login       │  │
│  │                               │  │
│  │   Input: email, password      │  │
│  │   Check students table        │  │
│  │   Check club_users table      │  │
│  │   Verify hashed password      │  │
│  │   Return user data + type     │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### [2-8] Feature Data Flow

```
┌────────────┐
│   Client   │
│  Request   │
└──────┬─────┘
       │
       │ HTTP Request
       │ (JSON body)
       ▼
┌────────────────┐
│  Flask Route   │
│   (Endpoint)   │
└──────┬─────────┘
       │
       │ Validate input
       │
       ▼
┌────────────────┐
│  SQLAlchemy    │
│     Model      │
└──────┬─────────┘
       │
       │ ORM Query
       │
       ▼
┌────────────────┐
│  MySQL         │
│  Database      │
└──────┬─────────┘
       │
       │ Return data
       │
       ▼
┌────────────────┐
│  Serialize     │
│  to JSON       │
└──────┬─────────┘
       │
       │ HTTP Response
       │
       ▼
┌────────────┐
│   Client   │
│  Receives  │
└────────────┘
```

---

## Database Relationships

```
┌──────────────┐
│   students   │
│ (studentID)  │
└───┬──────┬───┘
    │      │
    │      └──────────────────┐
    │                         │
    │  ┌──────────────┐       │
    │  │  bookmarks   │       │
    │  │              │       │
    │  │ studentID ───┘       │
    │  │ clubID ──────┐       │
    │  └──────────────┘       │
    │                 │       │
    │  ┌──────────────▼───┐   │
    │  │     clubs        │   │
    │  │   (clubID)       │◄──┘
    │  └──────┬───────────┘
    │         │
    │         ├──────┐
    │         │      │
    │  ┌──────▼───┐  │
    │  │  events  │  │
    │  └──────────┘  │
    │                │
    │  ┌──────▼───┐  │
    │  │  media   │  │
    │  └──────────┘  │
    │                │
    │  ┌──────▼───┐  │
    └──► messages │◄─┘
       └──────────┘

┌──────────────┐
│ club_users   │
│              │
│ clubID ──────┼─────► clubs
└──────────────┘

┌──────────────┐
│club_members  │
│              │
│ studentID ───┼─────► students
│ clubID ──────┼─────► clubs
└──────────────┘
```

---

## API Request Flow

### Example: Student Bookmarks Club

```
1. FRONTEND
   ┌─────────────────────────────────┐
   │ User clicks "Bookmark" button   │
   └────────────┬────────────────────┘
                │
   ┌────────────▼────────────────────┐
   │ React component triggers        │
   │ fetch('/api/bookmarks', {       │
   │   method: 'POST',               │
   │   body: JSON.stringify({        │
   │     studentID: '2025001',       │
   │     clubID: 1                   │
   │   })                            │
   │ })                              │
   └────────────┬────────────────────┘
                │
                │ HTTP POST
                │
2. BACKEND
   ┌────────────▼────────────────────┐
   │ @app.route('/api/bookmarks',    │
   │            methods=['POST'])    │
   │ def add_bookmark():             │
   └────────────┬────────────────────┘
                │
   ┌────────────▼────────────────────┐
   │ Validate request data           │
   │ Check for duplicate bookmark    │
   └────────────┬────────────────────┘
                │
   ┌────────────▼────────────────────┐
   │ new_bookmark = bookmarks(       │
   │   studentID=data['studentID'],  │
   │   clubID=data['clubID']         │
   │ )                               │
   └────────────┬────────────────────┘
                │
   ┌────────────▼────────────────────┐
   │ db.session.add(new_bookmark)    │
   │ db.session.commit()             │
   └────────────┬────────────────────┘
                │
3. DATABASE
   ┌────────────▼────────────────────┐
   │ INSERT INTO bookmarks           │
   │ (studentID, clubID,             │
   │  bookmarkedAt)                  │
   │ VALUES ('2025001', 1, NOW())    │
   └────────────┬────────────────────┘
                │
4. RESPONSE
   ┌────────────▼────────────────────┐
   │ return jsonify({                │
   │   "message": "Bookmark added!", │
   │   "bookmark": {...}             │
   │ }), 201                         │
   └────────────┬────────────────────┘
                │
5. FRONTEND
   ┌────────────▼────────────────────┐
   │ Update UI to show bookmarked    │
   │ Show success notification       │
   └─────────────────────────────────┘
```

---

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────┐
│            PRODUCTION                    │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐                      │
│  │   Vercel     │  Frontend            │
│  │  (Next.js)   │  (Static/SSR)        │
│  └──────┬───────┘                      │
│         │                               │
│         │ API Calls                     │
│         │                               │
│  ┌──────▼────────────────────┐         │
│  │     Load Balancer          │         │
│  │      (AWS ELB)             │         │
│  └──────┬────────────────────┘         │
│         │                               │
│    ┌────┴─────┐                        │
│    │          │                         │
│  ┌─▼──────┐ ┌─▼──────┐                │
│  │ Flask  │ │ Flask  │  Backend        │
│  │ App 1  │ │ App 2  │  (EC2/ECS)      │
│  └─┬──────┘ └─┬──────┘                │
│    │          │                         │
│    └────┬─────┘                        │
│         │                               │
│  ┌──────▼──────────────────┐           │
│  │    Redis Cache           │           │
│  │  (Session/Cache)         │           │
│  └──────┬──────────────────┘           │
│         │                               │
│  ┌──────▼──────────────────┐           │
│  │   RDS MySQL              │           │
│  │   (Primary)              │           │
│  │                          │           │
│  │   RDS MySQL              │           │
│  │   (Read Replica)         │           │
│  └──────────────────────────┘           │
│                                         │
│  ┌──────────────────────────┐           │
│  │    S3 Bucket             │           │
│  │  (Media Storage)         │           │
│  └──────────────────────────┘           │
└─────────────────────────────────────────┘
```

---

## Security Flow

```
┌────────────┐
│   User     │
│  Password  │
└──────┬─────┘
       │
       │ Plain text
       │
       ▼
┌────────────────┐
│  SHA256 Hash   │
│  (Backend)     │
└──────┬─────────┘
       │
       │ Hashed
       │
       ▼
┌────────────────┐
│   Store in     │
│   Database     │
└────────────────┘

Login Flow:
┌────────────┐
│   User     │
│  Enters    │
│  Password  │
└──────┬─────┘
       │
       ▼
┌────────────────┐
│  Hash Input    │
│  Password      │
└──────┬─────────┘
       │
       ▼
┌────────────────┐
│  Compare with  │
│  Stored Hash   │
└──────┬─────────┘
       │
       ├─── Match ──→ Login Success
       │
       └─── No Match ─→ Login Failed
```

---

## Performance Optimization

```
┌─────────────────────────────────────┐
│        Optimization Layers          │
├─────────────────────────────────────┤
│                                     │
│  1. Database Level                  │
│     - Indexes on foreign keys       │
│     - Indexes on search columns     │
│     - Query optimization            │
│                                     │
│  2. Backend Level                   │
│     - Efficient queries             │
│     - Lazy loading                  │
│     - Pagination                    │
│                                     │
│  3. Caching (Future)                │
│     - Redis for sessions            │
│     - Cache frequent queries        │
│     - CDN for media                 │
│                                     │
│  4. Frontend Level                  │
│     - React optimization            │
│     - Lazy loading                  │
│     - Code splitting                │
└─────────────────────────────────────┘
```

---

This architecture supports all 8 features with:
- Clean separation of concerns
- Scalable design
- Security considerations
- Performance optimization
- Future expansion capability
