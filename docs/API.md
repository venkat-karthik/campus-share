# API Documentation

## Overview

Campus Share uses Supabase as the backend, providing a PostgreSQL database with Row Level Security.

## Authentication

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Google OAuth
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})
```

## Database Tables

### shared_items
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to profiles)
- `title` - Text
- `description` - Text
- `category` - Enum
- `condition` - Enum
- `images` - Text[]
- `is_available` - Boolean
- `created_at` - Timestamp

### announcements
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to profiles)
- `title` - Text
- `content` - Text
- `priority` - Enum
- `created_at` - Timestamp

### attendance_records
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to profiles)
- `subject` - Text
- `date` - Date
- `status` - Enum (present/absent)
- `notes` - Text

### lost_found_items
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to profiles)
- `title` - Text
- `description` - Text
- `location_found` - Text
- `images` - Text[]
- `status` - Enum (found/returned)
- `claimed_by` - UUID

### clubs
- `id` - UUID (Primary Key)
- `name` - Text
- `description` - Text
- `category` - Enum
- `created_by` - UUID

### club_events
- `id` - UUID (Primary Key)
- `club_id` - UUID (Foreign Key to clubs)
- `title` - Text
- `description` - Text
- `event_date` - Timestamp
- `location` - Text
- `max_participants` - Integer

## React Query Hooks

All data fetching is done through React Query hooks for optimal caching and performance.

See individual hook files in `src/hooks/` for detailed usage.
