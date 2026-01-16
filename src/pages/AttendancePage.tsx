import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAttendanceRecords, createAttendanceRecord, getAttendanceStats, deleteAttendanceRecord } from '@/db/api';
import type { AttendanceRecord, AttendanceStatus } from '@/types';
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
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<string, { present: number; absent: number; percentage: number }>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      subject: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present' as AttendanceStatus,
      notes: '',
    },
  });

  const loadRecords = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getAttendanceRecords(user.id);
      setRecords(data);

      const uniqueSubjects = Array.from(new Set(data.map(r => r.subject)));
      setSubjects(uniqueSubjects);

      const statsData: Record<string, { present: number; absent: number; percentage: number }> = {};
      for (const subject of uniqueSubjects) {
        statsData[subject] = await getAttendanceStats(user.id, subject);
      }
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [user]);

  const handleSubmit = async (values: { subject: string; date: string; status: AttendanceStatus; notes: string }) => {
    if (!user) return;

    try {
      await createAttendanceRecord({
        user_id: user.id,
        subject: values.subject,
        date: values.date,
        status: values.status,
        notes: values.notes || null,
      });
      toast({ title: 'Attendance recorded successfully' });
      setDialogOpen(false);
      form.reset();
      loadRecords();
    } catch (error) {
      toast({ title: 'Failed to record attendance', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAttendanceRecord(id);
      toast({ title: 'Record deleted' });
      loadRecords();
    } catch (error) {
      toast({ title: 'Failed to delete record', variant: 'destructive' });
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
                <Button type="submit" className="w-full">Record Attendance</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
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
              const stat = stats[subject];
              const isLow = stat && stat.percentage < 75;
              return (
                <Card key={subject} className="shadow-card">
                  <CardHeader>
                    <CardTitle>{subject}</CardTitle>
                    <CardDescription>
                      {stat && (
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between text-sm">
                            <span>Present: {stat.present}</span>
                            <span>Absent: {stat.absent}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${isLow ? 'bg-destructive' : 'bg-secondary'}`}
                                style={{ width: `${stat.percentage}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${isLow ? 'text-destructive' : 'text-secondary'}`}>
                              {stat.percentage.toFixed(1)}%
                            </span>
                          </div>
                          {isLow && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>Low attendance warning!</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {records.slice(0, 10).map((record) => (
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
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
