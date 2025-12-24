# They clone the repo and follow SETUP_FOR_TEAM.md
git clone <your-repo>
cd GroupF
# Then follow SETUP_FOR_TEAM.md# Database Schema - Club Management System

## Entity Relationship Overview

```
students (1) ----< (M) bookmarks (M) >---- (1) clubs
students (1) ----< (M) messages (M) >---- (1) clubs
students (1) ----< (M) club_members (M) >---- (1) clubs
clubs (1) ----< (M) events
clubs (1) ----< (M) media
clubs (1) ---- (1) club_users
```

## Table Definitions

### 1. students
**Purpose**: Store student user accounts and information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| studentID | VARCHAR(20) | PRIMARY KEY | Unique student identifier |
| password | VARCHAR(255) | NOT NULL | Hashed password (SHA256) |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Student email address |
| firstName | VARCHAR(50) | NOT NULL | Student's first name |
| lastName | VARCHAR(50) | NOT NULL | Student's last name |
| major | VARCHAR(100) | NULL | Academic major |
| year | VARCHAR(20) | NULL | Academic year (Freshman, etc.) |
| createdAt | DATETIME | DEFAULT NOW() | Account creation timestamp |

**Relationships**:
- One-to-Many with `bookmarks`
- One-to-Many with `messages`
- One-to-Many with `club_members`

---

### 2. club_users
**Purpose**: Store club admin/manager accounts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| clubUserID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique club user ID |
| clubID | INT | FOREIGN KEY, UNIQUE, NOT NULL | Reference to clubs table |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Club admin email |
| password | VARCHAR(255) | NOT NULL | Hashed password (SHA256) |
| createdAt | DATETIME | DEFAULT NOW() | Account creation timestamp |

**Relationships**:
- One-to-One with `clubs`

**Foreign Keys**:
- `clubID` REFERENCES `clubs(clubID)` ON DELETE CASCADE

---

### 3. clubs
**Purpose**: Store club/organization information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| clubID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique club identifier |
| clubName | VARCHAR(100) | NOT NULL, UNIQUE | Official club name |
| description | TEXT | NOT NULL | Club description |
| category | VARCHAR(50) | NOT NULL | Club category (Sport, Culture, etc.) |
| meetingTime | VARCHAR(100) | NULL | Regular meeting schedule |
| meetingLocation | VARCHAR(200) | NULL | Meeting location details |
| contactEmail | VARCHAR(100) | NULL | Public contact email |
| websiteURL | VARCHAR(255) | NULL | Club website URL |
| logoURL | VARCHAR(255) | NULL | Club logo image URL |
| createdAt | DATETIME | DEFAULT NOW() | Club creation timestamp |

**Relationships**:
- One-to-Many with `events`
- One-to-Many with `media`
- One-to-Many with `messages`
- One-to-Many with `bookmarks`
- One-to-Many with `club_members`
- One-to-One with `club_users`

**Indexes**:
- `category` for filtering
- `clubName` for searching

---

### 4. events
**Purpose**: Store club events and activities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| eventID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique event identifier |
| clubID | INT | FOREIGN KEY, NOT NULL | Reference to organizing club |
| eventName | VARCHAR(200) | NOT NULL | Event name/title |
| description | TEXT | NOT NULL | Event description |
| eventDate | DATE | NOT NULL | Event date |
| eventTime | VARCHAR(50) | NOT NULL | Event time (formatted string) |
| eventLocation | VARCHAR(200) | NOT NULL | Event location |
| imageURL | VARCHAR(255) | NULL | Event promotional image |
| registrationRequired | BOOLEAN | DEFAULT FALSE | Whether registration is needed |
| maxParticipants | INT | NULL | Maximum participant limit |
| createdAt | DATETIME | DEFAULT NOW() | Event creation timestamp |

**Relationships**:
- Many-to-One with `clubs`

**Foreign Keys**:
- `clubID` REFERENCES `clubs(clubID)` ON DELETE CASCADE

**Indexes**:
- `eventDate` for calendar queries
- `clubID` for club event listings

---

### 5. media
**Purpose**: Store photos and videos posted by clubs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| mediaID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique media identifier |
| clubID | INT | FOREIGN KEY, NOT NULL | Reference to club |
| mediaType | VARCHAR(20) | NOT NULL | 'photo' or 'video' |
| mediaURL | VARCHAR(255) | NOT NULL | URL to media file |
| caption | TEXT | NULL | Media caption/description |
| uploadedAt | DATETIME | DEFAULT NOW() | Upload timestamp |

**Relationships**:
- Many-to-One with `clubs`

**Foreign Keys**:
- `clubID` REFERENCES `clubs(clubID)` ON DELETE CASCADE

**Indexes**:
- `clubID` for club media galleries
- `uploadedAt` for chronological ordering

---

### 6. messages
**Purpose**: Direct messages from students to clubs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| messageID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique message identifier |
| senderID | VARCHAR(20) | FOREIGN KEY, NOT NULL | Reference to student sender |
| clubID | INT | FOREIGN KEY, NOT NULL | Reference to recipient club |
| subject | VARCHAR(200) | NULL | Message subject line |
| messageText | TEXT | NOT NULL | Message content |
| isRead | BOOLEAN | DEFAULT FALSE | Read status flag |
| sentAt | DATETIME | DEFAULT NOW() | Message timestamp |

**Relationships**:
- Many-to-One with `students` (sender)
- Many-to-One with `clubs` (recipient)

**Foreign Keys**:
- `senderID` REFERENCES `students(studentID)` ON DELETE CASCADE
- `clubID` REFERENCES `clubs(clubID)` ON DELETE CASCADE

**Indexes**:
- `clubID, isRead` for inbox queries
- `senderID` for sent messages
- `sentAt` for chronological ordering

---

### 7. bookmarks
**Purpose**: Students' saved/favorited clubs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| bookmarkID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique bookmark identifier |
| studentID | VARCHAR(20) | FOREIGN KEY, NOT NULL | Reference to student |
| clubID | INT | FOREIGN KEY, NOT NULL | Reference to bookmarked club |
| bookmarkedAt | DATETIME | DEFAULT NOW() | Bookmark timestamp |

**Relationships**:
- Many-to-One with `students`
- Many-to-One with `clubs`

**Foreign Keys**:
- `studentID` REFERENCES `students(studentID)` ON DELETE CASCADE
- `clubID` REFERENCES `clubs(clubID)` ON DELETE CASCADE

**Unique Constraints**:
- `(studentID, clubID)` - Prevent duplicate bookmarks

**Indexes**:
- `studentID` for user bookmarks list
- `clubID` for bookmark count

---

### 8. club_members
**Purpose**: Track club membership and roles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| membershipID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique membership identifier |
| studentID | VARCHAR(20) | FOREIGN KEY, NOT NULL | Reference to student member |
| clubID | INT | FOREIGN KEY, NOT NULL | Reference to club |
| role | VARCHAR(50) | DEFAULT 'Member' | Member, Officer, President |
| joinedAt | DATETIME | DEFAULT NOW() | Membership start date |

**Relationships**:
- Many-to-One with `students`
- Many-to-One with `clubs`

**Foreign Keys**:
- `studentID` REFERENCES `students(studentID)` ON DELETE CASCADE
- `clubID` REFERENCES `clubs(clubID)` ON DELETE CASCADE

**Unique Constraints**:
- `(studentID, clubID)` - Prevent duplicate memberships

**Indexes**:
- `clubID` for member lists
- `studentID` for student's clubs

---

## Categories Enumeration

Clubs are categorized using the following standard categories:

- **Sport** - Athletic clubs and teams
- **Culture** - Cultural and ethnic organizations
- **Academic** - Subject-specific academic clubs
- **Volunteer** - Community service organizations
- **Research** - Research groups and labs
- **Arts** - Creative and performing arts
- **Technology** - Tech and innovation clubs
- **Social** - Social and recreational groups
- **Professional** - Career and professional development

---

## SQL Creation Script

```sql
-- Create students table
CREATE TABLE students (
    studentID VARCHAR(20) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    major VARCHAR(100),
    year VARCHAR(20),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Create clubs table
CREATE TABLE clubs (
    clubID INT PRIMARY KEY AUTO_INCREMENT,
    clubName VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    meetingTime VARCHAR(100),
    meetingLocation VARCHAR(200),
    contactEmail VARCHAR(100),
    websiteURL VARCHAR(255),
    logoURL VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_clubName (clubName)
);

-- Create club_users table
CREATE TABLE club_users (
    clubUserID INT PRIMARY KEY AUTO_INCREMENT,
    clubID INT NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clubID) REFERENCES clubs(clubID) ON DELETE CASCADE,
    INDEX idx_email (email)
);

-- Create events table
CREATE TABLE events (
    eventID INT PRIMARY KEY AUTO_INCREMENT,
    clubID INT NOT NULL,
    eventName VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    eventDate DATE NOT NULL,
    eventTime VARCHAR(50) NOT NULL,
    eventLocation VARCHAR(200) NOT NULL,
    imageURL VARCHAR(255),
    registrationRequired BOOLEAN DEFAULT FALSE,
    maxParticipants INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clubID) REFERENCES clubs(clubID) ON DELETE CASCADE,
    INDEX idx_eventDate (eventDate),
    INDEX idx_clubID (clubID)
);

-- Create media table
CREATE TABLE media (
    mediaID INT PRIMARY KEY AUTO_INCREMENT,
    clubID INT NOT NULL,
    mediaType VARCHAR(20) NOT NULL,
    mediaURL VARCHAR(255) NOT NULL,
    caption TEXT,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clubID) REFERENCES clubs(clubID) ON DELETE CASCADE,
    INDEX idx_clubID (clubID),
    INDEX idx_uploadedAt (uploadedAt)
);

-- Create messages table
CREATE TABLE messages (
    messageID INT PRIMARY KEY AUTO_INCREMENT,
    senderID VARCHAR(20) NOT NULL,
    clubID INT NOT NULL,
    subject VARCHAR(200),
    messageText TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderID) REFERENCES students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (clubID) REFERENCES clubs(clubID) ON DELETE CASCADE,
    INDEX idx_club_unread (clubID, isRead),
    INDEX idx_senderID (senderID),
    INDEX idx_sentAt (sentAt)
);

-- Create bookmarks table
CREATE TABLE bookmarks (
    bookmarkID INT PRIMARY KEY AUTO_INCREMENT,
    studentID VARCHAR(20) NOT NULL,
    clubID INT NOT NULL,
    bookmarkedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentID) REFERENCES students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (clubID) REFERENCES clubs(clubID) ON DELETE CASCADE,
    UNIQUE KEY unique_bookmark (studentID, clubID),
    INDEX idx_studentID (studentID),
    INDEX idx_clubID (clubID)
);

-- Create club_members table
CREATE TABLE club_members (
    membershipID INT PRIMARY KEY AUTO_INCREMENT,
    studentID VARCHAR(20) NOT NULL,
    clubID INT NOT NULL,
    role VARCHAR(50) DEFAULT 'Member',
    joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentID) REFERENCES students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (clubID) REFERENCES clubs(clubID) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (studentID, clubID),
    INDEX idx_clubID (clubID),
    INDEX idx_studentID (studentID)
);
```

---

## Design Decisions

### 1. Two User Types
Separated `students` and `club_users` tables to:
- Support different authentication flows
- Allow different permissions and capabilities
- Enable different profile information

### 2. Hashed Passwords
Using SHA256 for password hashing. For production, consider:
- bcrypt or Argon2 for stronger security
- Salt generation for each password
- Password strength requirements

### 3. Cascade Deletes
All foreign keys use `ON DELETE CASCADE` to:
- Automatically clean up related records
- Maintain referential integrity
- Prevent orphaned data

### 4. Flexible Time Storage
Event and meeting times stored as VARCHAR to:
- Support various time formats
- Allow time ranges (e.g., "5:00 PM - 7:00 PM")
- Handle recurring patterns in meeting times

### 5. URL-Based Media Storage
Media files stored as URLs to:
- Support external storage services (S3, Cloudinary)
- Reduce database size
- Enable CDN usage for better performance

---

## Future Enhancements

1. **Event Registration** - Add `event_registrations` table for tracking attendees
2. **Comments/Reviews** - Add `club_reviews` for student feedback
3. **Notifications** - Add `notifications` table for system alerts
4. **Tags** - Add `tags` and `club_tags` for better searchability
5. **Analytics** - Track views, clicks, and engagement metrics
6. **Files** - Support file attachments for messages and events
