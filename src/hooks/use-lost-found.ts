import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLostFoundItems,
  createLostFoundItem,
  updateLostFoundItem,
  deleteLostFoundItem,
} from '@/db/api';
import { queryKeys } from '@/lib/query-client';
import type { LostFoundItem } from '@/types';
import { useToast } from './use-toast';

export function useLostFoundItems() {
  return useQuery({
    queryKey: queryKeys.lostFound.all,
    queryFn: getLostFoundItems,
  });
}

export function useCreateLostFoundItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (item: Omit<LostFoundItem, 'id' | 'created_at'>) =>
      createLostFoundItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lostFound.all });
      toast({ title: 'Lost item reported successfully!' });
    },
    onError: () => {
      toast({
        title: 'Failed to report lost item',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateLostFoundItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<LostFoundItem> }) =>
      updateLostFoundItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lostFound.all });
      toast({ title: 'Item updated successfully!' });
    },
    onError: () => {
      toast({
        title: 'Failed to update item',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteLostFoundItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteLostFoundItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lostFound.all });
      toast({ title: 'Item deleted successfully!' });
    },
    onError: () => {
      toast({
        title: 'Failed to delete item',
        variant: 'destructive',
      });
    },
  });
}
