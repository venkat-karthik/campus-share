import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useAttendanceRecords, 
  useCreateAttendanceRecord, 
  useDeleteAttendanceRecord,
  useAttendanceStats 
} from '@/hooks/use-attendance';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import type { AttendanceStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, AlertTriangle, Trash2 } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { Pagination } from '@/components/common/Pagination';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendanceRecordSchema } from '@/lib/validators';
import { Alert, AlertDescription } from '@/components/ui/alert';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: records = [], isLoading } = useAttendanceRecords(user?.id);
  const createMutation = useCreateAttendanceRecord();
  const deleteMutation = useDeleteAttendanceRecord();

  const form = useForm({
    resolver: zodResolver(attendanceRecordSchema),
    defaultValues: {
      subject: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present' as AttendanceStatus,
      notes: '',
    },
  });

  // Get unique subjects
  const subjects = useMemo(() => {
    return Array.from(new Set(records.map(r => r.subject)));
  }, [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    let result = records;

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(r =>
        r.subject.toLowerCase().includes(query) ||
        r.notes?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [records, statusFilter, debouncedSearch]);

  // Pagination
  const pagination = usePagination({ data: filteredRecords, itemsPerPage: 10 });

  const handleSubmit = async (values: { subject: string; date: string; status: AttendanceStatus; notes: string }) => {
    if (!user) return;

    createMutation.mutate(
      {
        user_id: user.id,
        subject: values.subject,
        date: values.date,
        status: values.status,
        notes: values.notes || null,
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          form.reset();
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-8 h-8 text-primary" />
            Attendance Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Track your attendance and stay on top of your classes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Attendance</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Mathematics" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Any additional notes" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Recording...' : 'Record Attendance'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by subject or notes..."
          className="flex-1"
        />
        <FilterBar
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          placeholder="All Status"
        />
      </div>

      {/* Results count */}
      {!isLoading && (
        <div className="text-sm text-muted-foreground">
          Found {filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-muted" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground text-lg">No attendance records yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Start tracking your attendance!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const subjectRecords = records.filter(r => r.subject === subject);
              const present = subjectRecords.filter(r => r.status === 'present').length;
              const absent = subjectRecords.filter(r => r.status === 'absent').length;
              const total = present + absent;
              const percentage = total > 0 ? (present / total) * 100 : 0;
              const isLow = percentage < 75;

              return (
                <Card key={subject} className="shadow-card">
                  <CardHeader>
                    <CardTitle>{subject}</CardTitle>
                    <CardDescription>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Present: {present}</span>
                          <span>Absent: {absent}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${isLow ? 'bg-destructive' : 'bg-primary'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${isLow ? 'text-destructive' : 'text-primary'}`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        {isLow && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>Low attendance warning!</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              {pagination.paginatedData.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No records match your search criteria.'
                    : 'No records found.'}
                </p>
              ) : (
                <>
                  <div className="space-y-3">
                    {pagination.paginatedData.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{record.subject}</span>
                            <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                              {record.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                          {record.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.goToPage}
                    hasNextPage={pagination.hasNextPage}
                    hasPreviousPage={pagination.hasPreviousPage}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    totalItems={pagination.totalItems}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
