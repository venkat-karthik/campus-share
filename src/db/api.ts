import { supabase } from './supabase';
import type {
  SharedItem,
  Announcement,
  AttendanceRecord,
  LostFoundItem,
  Club,
  ClubEvent,
  EventRegistration,
  Profile,
} from '@/types';

// Shared Items API
export async function getSharedItemsByUser(userId: string): Promise<SharedItem[]> {
  const { data, error } = await supabase
    .from('shared_items')
    .select('*, profiles!shared_items_user_id_fkey(id, full_name, role)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getSharedItemsByZone(zone: string): Promise<SharedItem[]> {
  const { data, error } = await supabase
    .from('shared_items')
    .select('*, profiles!shared_items_user_id_fkey(id, full_name, role)')
    .eq('zone', zone)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createSharedItem(item: Omit<SharedItem, 'id' | 'created_at'>): Promise<SharedItem> {
  const { data, error } = await supabase
    .from('shared_items')
    .insert(item)
    .select('*, profiles!shared_items_user_id_fkey(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateSharedItem(id: string, updates: Partial<SharedItem>): Promise<SharedItem> {
  const { data, error } = await supabase
    .from('shared_items')
    .update(updates)
    .eq('id', id)
    .select('*, profiles!shared_items_user_id_fkey(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSharedItem(id: string): Promise<void> {
  const { error } = await supabase.from('shared_items').delete().eq('id', id);
  if (error) throw error;
}

// Announcements API
export async function getAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*, profiles!announcements_created_by_fkey(id, full_name, role)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> {
  const { data, error } = await supabase
    .from('announcements')
    .insert(announcement)
    .select('*, profiles!announcements_created_by_fkey(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
}

// Attendance Records API
export async function getAttendanceRecords(userId: string): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'created_at'>): Promise<AttendanceRecord> {
  const { data, error } = await supabase
    .from('attendance_records')
    .insert(record)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAttendanceRecord(id: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
  const { data, error } = await supabase
    .from('attendance_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAttendanceRecord(id: string): Promise<void> {
  const { error } = await supabase.from('attendance_records').delete().eq('id', id);
  if (error) throw error;
}

export async function getAttendanceStats(userId: string, subject: string): Promise<{ present: number; absent: number; percentage: number }> {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('status')
    .eq('user_id', userId)
    .eq('subject', subject);

  if (error) throw error;

  const records = Array.isArray(data) ? data : [];
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const total = present + absent;
  const percentage = total > 0 ? (present / total) * 100 : 0;

  return { present, absent, percentage };
}

// Lost & Found API
export async function getLostFoundItems(): Promise<LostFoundItem[]> {
  const { data, error } = await supabase
    .from('lost_found_items')
    .select('*, profiles!lost_found_items_user_id_fkey(id, full_name, role), claimer:profiles!lost_found_items_claimed_by_fkey(id, full_name, role)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createLostFoundItem(item: Omit<LostFoundItem, 'id' | 'created_at'>): Promise<LostFoundItem> {
  const { data, error } = await supabase
    .from('lost_found_items')
    .insert(item)
    .select('*, profiles!lost_found_items_user_id_fkey(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateLostFoundItem(id: string, updates: Partial<LostFoundItem>): Promise<LostFoundItem> {
  const { data, error } = await supabase
    .from('lost_found_items')
    .update(updates)
    .eq('id', id)
    .select('*, profiles!lost_found_items_user_id_fkey(id, full_name, role), claimer:profiles!lost_found_items_claimed_by_fkey(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLostFoundItem(id: string): Promise<void> {
  const { error } = await supabase.from('lost_found_items').delete().eq('id', id);
  if (error) throw error;
}

// Clubs API
export async function getClubs(): Promise<Club[]> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*, profiles!clubs_created_by_fkey(id, full_name, role)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createClub(club: Omit<Club, 'id' | 'created_at'>): Promise<Club> {
  const { data, error } = await supabase
    .from('clubs')
    .insert(club)
    .select('*, profiles!clubs_created_by_fkey(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
}

export async function updateClub(id: string, updates: Partial<Club>): Promise<Club> {
  const { data, error } = await supabase
    .from('clubs')
    .update(updates)
    .eq('id', id)
    .select('*, profiles!clubs_created_by_fkey(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClub(id: string): Promise<void> {
  const { error } = await supabase.from('clubs').delete().eq('id', id);
  if (error) throw error;
}

// Club Events API
export async function getClubEvents(): Promise<ClubEvent[]> {
  const { data, error } = await supabase
    .from('club_events')
    .select('*, clubs!club_events_club_id_fkey(id, name, category), profiles!club_events_created_by_fkey(id, full_name, role)')
    .order('event_date', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getClubEventsByClub(clubId: string): Promise<ClubEvent[]> {
  const { data, error } = await supabase
    .from('club_events')
    .select('*, clubs!club_events_club_id_fkey(id, name, category), profiles!club_events_created_by_fkey(id, full_name, role)')
    .eq('club_id', clubId)
    .order('event_date', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createClubEvent(event: Omit<ClubEvent, 'id' | 'created_at'>): Promise<ClubEvent> {
  const { data, error } = await supabase
    .from('club_events')
    .insert(event)
    .select('*, clubs!club_events_club_id_fkey(id, name, category), profiles!club_events_created_by_fkey(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClubEvent(id: string): Promise<void> {
  const { error } = await supabase.from('club_events').delete().eq('id', id);
  if (error) throw error;
}

// Event Registrations API
export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('*, profiles!event_registrations_user_id_fkey(id, full_name, role)')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getUserEventRegistrations(userId: string): Promise<EventRegistration[]> {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function registerForEvent(eventId: string, userId: string): Promise<EventRegistration> {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert({ event_id: eventId, user_id: userId })
    .select('*, profiles!event_registrations_user_id_fkey(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
}

export async function unregisterFromEvent(eventId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('event_registrations')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (error) throw error;
}

// Admin API
export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
