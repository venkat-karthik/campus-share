import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '@/db/api';
import { queryKeys } from '@/lib/query-client';
import type { Announcement } from '@/types';
import { useToast } from './use-toast';

export function useAnnouncements() {
  return useQuery({
    queryKey: queryKeys.announcements.all,
    queryFn: getAnnouncements,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (announcement: Omit<Announcement, 'id' | 'created_at'>) => 
      createAnnouncement(announcement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      toast({ title: 'Announcement created successfully!' });
    },
    onError: () => {
      toast({ 
        title: 'Failed to create announcement', 
        variant: 'destructive' 
      });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      toast({ title: 'Announcement deleted successfully!' });
    },
    onError: () => {
      toast({ 
        title: 'Failed to delete announcement', 
        variant: 'destructive' 
      });
    },
  });
}
