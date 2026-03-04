import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProfiles, updateUserRole } from '@/db/api';
import { queryKeys } from '@/lib/query-client';
import { useToast } from './use-toast';

export function useAllProfiles() {
  return useQuery({
    queryKey: queryKeys.profiles.all,
    queryFn: getAllProfiles,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'user' | 'admin' }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
      toast({ title: 'User role updated successfully!' });
    },
    onError: () => {
      toast({
        title: 'Failed to update user role',
        variant: 'destructive',
      });
    },
  });
}
