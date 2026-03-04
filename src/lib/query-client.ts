import { QueryClient } from '@tanstack/react-query';
import { logger } from './logger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        logger.error('Mutation error', {
          error: error instanceof Error ? error.message : String(error),
        });
      },
    },
  },
});

// Query keys factory
export const queryKeys = {
  // Shared items
  sharedItems: {
    all: ['shared-items'] as const,
    byUser: (userId: string) => ['shared-items', 'user', userId] as const,
    byZone: (zone: string) => ['shared-items', 'zone', zone] as const,
  },
  // Announcements
  announcements: {
    all: ['announcements'] as const,
  },
  // Attendance
  attendance: {
    all: ['attendance'] as const,
    byUser: (userId: string) => ['attendance', 'user', userId] as const,
    stats: (userId: string, subject: string) => 
      ['attendance', 'stats', userId, subject] as const,
  },
  // Lost & Found
  lostFound: {
    all: ['lost-found'] as const,
  },
  // Clubs
  clubs: {
    all: ['clubs'] as const,
  },
  // Club Events
  clubEvents: {
    all: ['club-events'] as const,
    byClub: (clubId: string) => ['club-events', 'club', clubId] as const,
  },
  // Event Registrations
  eventRegistrations: {
    byEvent: (eventId: string) => ['event-registrations', 'event', eventId] as const,
    byUser: (userId: string) => ['event-registrations', 'user', userId] as const,
  },
  // Profiles
  profiles: {
    all: ['profiles'] as const,
  },
};
