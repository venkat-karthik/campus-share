import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getSharedItemsByUser, 
  getSharedItemsByZone, 
  createSharedItem, 
  updateSharedItem, 
  deleteSharedItem 
} from '@/db/api';
import { queryKeys } from '@/lib/query-client';
import type { SharedItem } from '@/types';
import { useToast } from './use-toast';

export function useSharedItemsByUser(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sharedItems.byUser(userId || ''),
    queryFn: () => getSharedItemsByUser(userId!),
    enabled: !!userId,
  });
}

export function useSharedItemsByZone(zone: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sharedItems.byZone(zone || ''),
    queryFn: () => getSharedItemsByZone(zone!),
    enabled: !!zone,
  });
}

export function useCreateSharedItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (item: Omit<SharedItem, 'id' | 'created_at'>) => createSharedItem(item),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sharedItems.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sharedItems.byUser(data.user_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sharedItems.byZone(data.zone) });
      toast({ title: 'Item shared successfully!' });
    },
    onError: () => {
      toast({ 
        title: 'Failed to share item', 
        description: 'Please try again later',
        variant: 'destructive' 
      });
    },
  });
}

export function useUpdateSharedItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SharedItem> }) => 
      updateSharedItem(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sharedItems.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sharedItems.byUser(data.user_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sharedItems.byZone(data.zone) });
      toast({ title: 'Item updated successfully!' });
    },
    onError: () => {
      toast({ 
        title: 'Failed to update item', 
        variant: 'destructive' 
      });
    },
  });
}

export function useDeleteSharedItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteSharedItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sharedItems.all });
      toast({ title: 'Item deleted successfully!' });
    },
    onError: () => {
      toast({ 
        title: 'Failed to delete item', 
        variant: 'destructive' 
      });
    },
  });
}
