export type UserRole = 'user' | 'admin';
export type ItemCategory = 'books' | 'laptops' | 'aprons' | 'others';
export type AnnouncementCategory = 'exam' | 'holiday' | 'placement' | 'emergency';
export type AttendanceStatus = 'present' | 'absent';
export type LostFoundStatus = 'found' | 'returned';
export type ClubCategory = 'tech' | 'sports' | 'cultural' | 'other';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface SharedItem {
  id: string;
  user_id: string;
  zone: string;
  category: ItemCategory;
  name: string;
  subject?: string | null;
  brand?: string | null;
  specs?: string | null;
  size?: string | null;
  color?: string | null;
  description?: string | null;
  location?: string | null;
  availability_date?: string | null;
  images: string[];
  created_at: string;
  profiles?: Profile;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  created_by: string;
  created_at: string;
  profiles?: Profile;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  subject: string;
  date: string;
  status: AttendanceStatus;
  notes?: string | null;
  created_at: string;
}

export interface LostFoundItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location_found: string;
  images: string[];
  status: LostFoundStatus;
  claimed_by?: string | null;
  created_at: string;
  profiles?: Profile;
  claimer?: Profile;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: ClubCategory;
  image?: string | null;
  created_by: string;
  created_at: string;
  profiles?: Profile;
}

export interface ClubEvent {
  id: string;
  club_id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  max_participants?: number | null;
  created_by: string;
  created_at: string;
  clubs?: Club;
  profiles?: Profile;
  registrations_count?: number;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
  profiles?: Profile;
}
