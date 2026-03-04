// Type definitions for new features

import type { Profile } from './types';

// ============================================
// MESSAGING TYPES
// ============================================

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string | null;
  avatar?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
  is_admin: boolean;
  profiles?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments?: string[];
  reply_to?: string | null;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  profiles?: Profile;
}

// ============================================
// NOTIFICATIONS TYPES
// ============================================

export type NotificationType =
  | 'message'
  | 'item_inquiry'
  | 'event_registration'
  | 'lost_item_claimed'
  | 'announcement'
  | 'post_like'
  | 'post_comment'
  | 'post_mention'
  | 'club_invitation'
  | 'resource_approved'
  | 'placement_update'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  data?: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  type: NotificationType;
  in_app: boolean;
  email: boolean;
  push: boolean;
}

// ============================================
// SOCIAL FEED TYPES
// ============================================

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media?: string[];
  hashtags?: string[];
  mentions?: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  is_liked?: boolean;
  is_shared?: boolean;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  profiles?: Profile;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  reply_to?: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  is_liked?: boolean;
  replies?: PostComment[];
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

export interface PostShare {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  follower?: Profile;
  following?: Profile;
}

// ============================================
// RESOURCE LIBRARY TYPES
// ============================================

export type ResourceType = 'notes' | 'paper' | 'video' | 'book' | 'tutorial' | 'other';
export type ResourceStatus = 'pending' | 'approved' | 'rejected';

export interface Resource {
  id: string;
  title: string;
  description?: string | null;
  type: ResourceType;
  subject: string;
  semester?: string | null;
  branch?: string | null;
  tags?: string[];
  file_url: string;
  file_size?: number | null;
  file_type?: string | null;
  thumbnail_url?: string | null;
  uploaded_by: string;
  status: ResourceStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  downloads_count: number;
  views_count: number;
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  is_bookmarked?: boolean;
  user_rating?: number;
}

export interface ResourceReview {
  id: string;
  resource_id: string;
  user_id: string;
  rating: number;
  comment?: string | null;
  is_helpful: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface ResourceDownload {
  id: string;
  resource_id: string;
  user_id: string;
  downloaded_at: string;
}

export interface ResourceBookmark {
  id: string;
  resource_id: string;
  user_id: string;
  created_at: string;
}

// ============================================
// PLACEMENT PORTAL TYPES
// ============================================

export type JobType = 'full_time' | 'internship' | 'part_time';
export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'rejected'
  | 'selected'
  | 'offer_accepted'
  | 'offer_declined';

export interface Company {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  logo?: string | null;
  industry?: string | null;
  size?: string | null;
  location?: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  job_type: JobType;
  ctc_min?: number | null;
  ctc_max?: number | null;
  location?: string | null;
  work_mode?: string | null;
  eligible_branches?: string[];
  eligible_semesters?: string[];
  min_cgpa?: number | null;
  skills_required?: string[];
  deadline?: string | null;
  visit_date?: string | null;
  is_active: boolean;
  applications_count: number;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  companies?: Company;
  user_application?: Application;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  resume_url: string;
  cover_letter?: string | null;
  status: ApplicationStatus;
  notes?: string | null;
  interview_date?: string | null;
  interview_location?: string | null;
  interview_mode?: string | null;
  feedback?: string | null;
  created_at: string;
  updated_at: string;
  job_postings?: JobPosting;
  profiles?: Profile;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  roll_number?: string | null;
  branch?: string | null;
  semester?: string | null;
  cgpa?: number | null;
  resume_url?: string | null;
  skills?: string[];
  certifications?: string[];
  projects?: Array<{
    title: string;
    description: string;
    link?: string;
    technologies: string[];
  }>;
  experience?: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  achievements?: string[];
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  is_placement_ready: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface PlacementStat {
  id: string;
  user_id: string;
  academic_year: string;
  company_id?: string | null;
  job_title: string;
  ctc?: number | null;
  job_type: JobType;
  placed_at: string;
  companies?: Company;
  profiles?: Profile;
}

export interface InterviewExperience {
  id: string;
  user_id: string;
  company_id: string;
  job_title: string;
  interview_date: string;
  rounds?: Array<{
    round_name: string;
    description: string;
    questions?: string[];
    tips?: string;
  }>;
  difficulty?: string | null;
  result?: string | null;
  tips?: string | null;
  is_anonymous: boolean;
  helpful_count: number;
  created_at: string;
  companies?: Company;
  profiles?: Profile;
}
