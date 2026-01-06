# Campus Share Web Application Requirements Document

## 1. Application Overview

### 1.1 Application Name
Campus Share

### 1.2 Application Description
A full-featured web application enabling campus users to share and receive items (books, laptops, aprons, etc.) within selected zones. The platform includes user authentication, zone-based item management, and additional campus life features including announcements, attendance tracking, lost & found, and clubs/community hub.\n
### 1.3 Target Language
English
\n## 2. User Authentication

### 2.1 Registration
- Registration form fields:\n  - Full Name (mandatory)
  - Email (mandatory)\n  - Password (mandatory, minimum 6 characters)
- User data stored in Firebase Auth
- Each user has individual profile
- User data isolation: one user's data never visible to another in Share Zone

### 2.2 Login
- Login requires Email + Password
- Successful login redirects directly to Zones page
- Display \"Welcome, <username>\" across all pages after login
- No additional forms after successful login

## 3. Zones Page

### 3.1 Zone Selection
- Display multiple zones (e.g., Arizona, California)
- User selects one zone
- No re-authentication required after zone selection
\n### 3.2 Zone Types
- **Share Zone**: displays only logged-in user's items
- **Receive Zone**: displays all shared items from all users

## 4. Share Zone
\n### 4.1 Display\n- Header: \"Welcome to Share Zone, <username>\"
- Empty state displayed when user has no items
\n### 4.2 Item Categories
- Books\n- Laptops
- Aprons
- Others\n
### 4.3 Category-Specific Fields
\n**Books:**
- Name (mandatory)
- Subject (mandatory)\n- Notes (optional)

**Laptops:**
- Brand (mandatory)
- Specs (mandatory)
- Notes (optional)

**Aprons:**\n- Size (mandatory)
- Color (mandatory)
- Notes (optional)

**Others:**
- Item name (mandatory)\n- Description (optional)
\n### 4.4 Data Storage
- Items stored in Firestore under user's ID
- Share Zone displays only logged-in user's items\n\n## 5. Receive Zone

### 5.1 Display
- Header: \"Welcome to Receive Zone\"\n- Shows all shared items from all users
- Displays username of item owner

### 5.2 Filtering
- Filter by category (Books, Laptops, Aprons, Others)
\n## 6. Database & Backend

### 6.1 Technology Stack
- Firebase Firestore for data storage
- Firebase Auth for authentication
- Firebase Storage for item images
\n### 6.2 Data Structure
- `/users/<userID>/shared_items/<itemID>`
- `/receive_items/<itemID>` (optional collection for combined items)\n\n### 6.3 Data Isolation
- Share Zone: user sees only their own items
- Receive Zone: displays all items from all users
- Empty Share Zone shows placeholder\n\n## 7. UI/Frontend Requirements

### 7.1 Design Style
- Modern, clean, and attractive interface
- Responsive design (desktop and mobile compatible)
- Animated floating UI elements with subtle movement
- Banner/image above zones page
\n### 7.2 Navigation
- Transparent navbar with clear visibility
- Active page highlighting
\n### 7.3 Category Display
- Clickable cards with icons/images for each category
\n## 8. Optional Features
\n### 8.1 Item Details
- Location input for pickup specification
- Time/date input for availability
- Multiple image upload per item

## 9. Additional Campus Features

### 9.1 Official Campus Announcements
- Exam notifications
- Holidays & timetable changes
- Placement updates
- Emergency alerts (hostel, weather, safety)

### 9.2 Attendance & Reminder Helper (Unofficial)
- Manual attendance tracking
- Low-attendance warning\n- Exam & assignment reminders
\n### 9.3 Lost & Found
- Upload found item photo
- Location where found
- Claim verification\n- Status tracking: Found / Returned

### 9.4 Clubs & Community Hub
- Club profiles (Tech, Sports, Cultural)
- Event creation & registration
- Volunteer recruitment
- Event reminders

## 10. Application Flow

1. Registration → Login\n2. Login → Zones Page
3. Zone Selection → Share Zone / Receive Zone
4. Share Zone: Add items → View own items only
5. Receive Zone: View all items from all users
6. Different user login → Share Zone displays only that user's items

## 11. Project Structure

```
/registration
/share-zone
/receive-zone
/images\n/utils
index.html
style.css
```

## 12. Deployment\n
- Firebase Hosting deployment
- Include clear deployment instructions
- All HTML/CSS/JS files ready to deploy
- Firebase SDK integration included
- Authentication, Firestore, and Storage handling configured