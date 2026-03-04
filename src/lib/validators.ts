import { z } from 'zod';

// Shared item validation
export const sharedItemSchema = z.object({
  zone: z.string().min(1, 'Zone is required').max(50),
  category: z.enum(['books', 'laptops', 'aprons', 'others']),
  name: z.string().min(1, 'Name is required').max(200),
  subject: z.string().max(100).optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  specs: z.string().max(500).optional().nullable(),
  size: z.string().max(50).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  availability_date: z.string().optional().nullable(),
  images: z.array(z.string().url()).max(5, 'Maximum 5 images allowed'),
});

export type SharedItemInput = z.infer<typeof sharedItemSchema>;

// Announcement validation
export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required').max(5000),
  category: z.enum(['exam', 'holiday', 'placement', 'emergency']),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

// Attendance record validation
export const attendanceRecordSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  status: z.enum(['present', 'absent']),
  notes: z.string().max(500).optional().nullable(),
});

export type AttendanceRecordInput = z.infer<typeof attendanceRecordSchema>;

// Lost & Found validation
export const lostFoundItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(1000),
  location_found: z.string().min(1, 'Location is required').max(200),
  images: z.array(z.string().url()).max(5, 'Maximum 5 images allowed'),
  status: z.enum(['found', 'returned']).default('found'),
});

export type LostFoundItemInput = z.infer<typeof lostFoundItemSchema>;

// Club validation
export const clubSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  category: z.enum(['tech', 'sports', 'cultural', 'other']),
  image: z.string().url().optional().nullable(),
});

export type ClubInput = z.infer<typeof clubSchema>;

// Club event validation
export const clubEventSchema = z.object({
  club_id: z.string().uuid('Invalid club ID'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(1000),
  event_date: z.string().min(1, 'Event date is required'),
  location: z.string().min(1, 'Location is required').max(200),
  max_participants: z.number().int().positive().optional().nullable(),
});

export type ClubEventInput = z.infer<typeof clubEventSchema>;

// Auth validation
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
