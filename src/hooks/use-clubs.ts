import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  getClubEvents,
  getClubEventsByClub,
  createClubEvent,
  deleteClubEvent,
  getEventRegistrations,
  getUserEventRegistrations,
  registerForEvent,
  unregisterFromEvent,
} from '@/db/api';
import { queryKeys } from '@/lib/query-client';
import type { Club, ClubEvent } from '@/types';
import { useToast } from './use-toast';

// Clubs
export function useClubs() {
  return useQuery({
    queryKey: queryKeys.clubs.all,
    queryFn: getClubs,
  });
}

export function useCreateClub() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (club: Omit<Club, 'id' | 'created_at'>) => createClub(club),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.all });
      toast({ title: 'Club created successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to create club', variant: 'destructive' });
    },
  });
}

export function useUpdateClub() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Club> }) =>
      updateClub(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.all });
      toast({ title: 'Club updated successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to update club', variant: 'destructive' });
    },
  });
}

export function useDeleteClub() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.all });
      toast({ title: 'Club deleted successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to delete club', variant: 'destructive' });
    },
  });
}

// Club Events
export function useClubEvents() {
  return useQuery({
    queryKey: queryKeys.clubEvents.all,
    queryFn: getClubEvents,
  });
}

export function useClubEventsByClub(clubId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.clubEvents.byClub(clubId || ''),
    queryFn: () => getClubEventsByClub(clubId!),
    enabled: !!clubId,
  });
}

export function useCreateClubEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (event: Omit<ClubEvent, 'id' | 'created_at'>) => createClubEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubEvents.all });
      toast({ title: 'Event created successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to create event', variant: 'destructive' });
    },
  });
}

export function useDeleteClubEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteClubEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubEvents.all });
      toast({ title: 'Event deleted successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to delete event', variant: 'destructive' });
    },
  });
}

// Event Registrations
export function useEventRegistrations(eventId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.eventRegistrations.byEvent(eventId || ''),
    queryFn: () => getEventRegistrations(eventId!),
    enabled: !!eventId,
  });
}

export function useUserEventRegistrations(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.eventRegistrations.byUser(userId || ''),
    queryFn: () => getUserEventRegistrations(userId!),
    enabled: !!userId,
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      registerForEvent(eventId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.eventRegistrations.byEvent(variables.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.eventRegistrations.byUser(variables.userId),
      });
      toast({ title: 'Successfully registered for event!' });
    },
    onError: () => {
      toast({ title: 'Failed to register for event', variant: 'destructive' });
    },
  });
}

export function useUnregisterFromEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      unregisterFromEvent(eventId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.eventRegistrations.byEvent(variables.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.eventRegistrations.byUser(variables.userId),
      });
      toast({ title: 'Successfully unregistered from event!' });
    },
    onError: () => {
      toast({ title: 'Failed to unregister from event', variant: 'destructive' });
    },
  });
}
