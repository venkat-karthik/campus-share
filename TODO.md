# Task: Build Campus Share Web Application

## Plan
- [x] Step 1: Update design system with campus-themed colors
- [x] Step 2: Initialize Supabase and setup database
  - [x] Initialize Supabase
  - [x] Disable email verification
  - [x] Create database tables
  - [x] Setup storage bucket for images
  - [x] Create RLS policies
- [x] Step 3: Create type definitions
- [x] Step 4: Create database API layer
- [x] Step 5: Update authentication context
- [x] Step 6: Create all pages
  - [x] Login page
  - [x] Register page
  - [x] Zones page
  - [x] Share Zone page
  - [x] Receive Zone page
  - [x] Announcements page
  - [x] Attendance page
  - [x] Lost & Found page
  - [x] Clubs page
  - [x] Admin page
- [x] Step 7: Create reusable components
- [x] Step 8: Create layouts
- [x] Step 9: Update routing and App.tsx
- [x] Step 10: Run lint validation

## Notes
- Using Supabase instead of Firebase as per tech stack
- Username + password authentication with @miaoda.com domain
- Zone-based item sharing: Share Zone (user's items only), Receive Zone (all items)
- Additional campus features: Announcements, Attendance, Lost & Found, Clubs
- Image upload with automatic compression to 1MB
- First registered user becomes admin automatically
- Admin can manage user roles and create announcements, clubs, and events
- All features implemented and lint validation passed successfully
