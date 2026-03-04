import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAttendanceRecords,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  getAttendanceStats,
} from '@/db/api';
import { queryKeys } from '@/lib/query-client';
import type { AttendanceRecord } from '@/types';
import { useToast } from './use-toast';

export function useAttendanceRecords(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.attendance.byUser(userId || ''),
    queryFn: () => getAttendanceRecords(userId!),
    enabled: !!userId,
  });
}

export function useAttendanceStats(userId: string | undefined, subject: string) {
  return useQuery({
    queryKey: queryKeys.attendance.stats(userId || '', subject),
    queryFn: () => getAttendanceStats(userId!, subject),
    enabled: !!userId && !!subject,
  });
}

export function useCreateAttendanceRecord() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (record: Omit<AttendanceRecord, 'id' | 'created_at'>) =>
      createAttendanceRecord(record),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.byUser(data.user_id) });
      toast({ title: 'Attendance record added!' });
    },
    onError: () => {
      toast({
        title: 'Failed to add attendance record',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateAttendanceRecord() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AttendanceRecord> }) =>
      updateAttendanceRecord(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.byUser(data.user_id) });
      toast({ title: 'Attendance record updated!' });
    },
    onError: () => {
      toast({
        title: 'Failed to update attendance record',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteAttendanceRecord() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteAttendanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });
      toast({ title: 'Attendance record deleted!' });
    },
    onError: () => {
      toast({
        title: 'Failed to delete attendance record',
        variant: 'destructive',
      });
    },
  });
}
