import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClubs, useClubEvents, useCreateClub, useCreateClubEvent, useRegisterForEvent, useUnregisterFromEvent, useUserEventRegistrations } from '@/hooks/use-clubs';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Calendar, MapPin } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { Pagination } from '@/components/common/Pagination';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

function ClubsPage() {
  const { user, profile } = useAuth();
  const [clubDialogOpen, setClubDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [clubSearchQuery, setClubSearchQuery] = useState('');
  const [clubCategoryFilter, setClubCategoryFilter] = useState<string>('all');
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const { toast } = useToast();

  const debouncedClubSearch = useDebounce(clubSearchQuery, 300);
  const debouncedEventSearch = useDebounce(eventSearchQuery, 300);

  // Use React Query hooks
  const { data: clubs = [], isLoading: clubsLoading } = useClubs();
  const { data: events = [], isLoading: eventsLoading } = useClubEvents();
  const { data: registrations = [] } = useUserEventRegistrations(user?.id);
  const createClubMutation = useCreateClub();
  const createEventMutation = useCreateClubEvent();
  const registerMutation = useRegisterForEvent();
  const unregisterMutation = useUnregisterFromEvent();

  const clubForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: 'tech' as const,
    },
  });

  const eventForm = useForm({
    defaultValues: {
      club_id: '',
      title: '',
      description: '',
      event_date: '',
      location: '',
      max_participants: '',
    },
  });

  // Filter clubs
  const filteredClubs = useMemo(() => {
    let result = clubs;

    if (clubCategoryFilter !== 'all') {
      result = result.filter(club => club.category === clubCategoryFilter);
    }

    if (debouncedClubSearch) {
      const query = debouncedClubSearch.toLowerCase();
      result = result.filter(club =>
        club.name.toLowerCase().includes(query) ||
        club.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [clubs, clubCategoryFilter, debouncedClubSearch]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let result = events;

    if (debouncedEventSearch) {
      const query = debouncedEventSearch.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }

    return result;
  }, [events, debouncedEventSearch]);

  // Pagination
  const clubPagination = usePagination({ data: filteredClubs, itemsPerPage: 12 });
  const eventPagination = usePagination({ data: filteredEvents, itemsPerPage: 10 });

  const registrationIds = useMemo(() =>
    registrations.map(r => r.event_id),
    [registrations]
  );

  const handleCreateClub = (values: { name: string; description: string; category: 'tech' | 'sports' | 'cultural' | 'other' }) => {
    if (!user) return;
    createClubMutation.mutate(
      {
        ...values,
        created_by: user.id,
      },
      {
        onSuccess: () => {
          toast({ title: 'Club created successfully' });
          setClubDialogOpen(false);
          clubForm.reset();
        },
        onError: () => {
          toast({ title: 'Failed to create club', variant: 'destructive' });
        },
      }
    );
  };

  const handleCreateEvent = (values: { club_id: string; title: string; description: string; event_date: string; location: string; max_participants: string }) => {
    if (!user) return;
    createEventMutation.mutate(
      {
        club_id: values.club_id,
        title: values.title,
        description: values.description,
        event_date: values.event_date,
        location: values.location,
        max_participants: values.max_participants ? parseInt(values.max_participants) : null,
        created_by: user.id,
      },
      {
        onSuccess: () => {
          toast({ title: 'Event created successfully' });
          setEventDialogOpen(false);
          eventForm.reset();
        },
        onError: () => {
          toast({ title: 'Failed to create event', variant: 'destructive' });
        },
      }
    );
  };

  const handleRegister = (eventId: string) => {
    if (!user) return;
    registerMutation.mutate(
      { eventId, userId: user.id },
      {
        onSuccess: () => {
          toast({ title: 'Registered successfully' });
        },
        onError: () => {
          toast({ title: 'Failed to register', variant: 'destructive' });
        },
      }
    );
  };

  const handleUnregister = (eventId: string) => {
    if (!user) return;
    unregisterMutation.mutate(
      { eventId, userId: user.id },
      {
        onSuccess: () => {
          toast({ title: 'Unregistered successfully' });
        },
        onError: () => {
          toast({ title: 'Failed to unregister', variant: 'destructive' });
        },
      }
    );
  };

  const isAdmin = profile?.role === 'admin';

  const CATEGORY_OPTIONS = [
    { value: 'tech', label: 'Tech' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Clubs & Community
          </h1>
          <p className="text-muted-foreground mt-1">Join clubs and participate in campus events</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Dialog open={clubDialogOpen} onOpenChange={setClubDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Club
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Club</DialogTitle>
                </DialogHeader>
                <Form {...clubForm}>
                  <form onSubmit={clubForm.handleSubmit(handleCreateClub)} className="space-y-4">
                    <FormField
                      control={clubForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Club Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Tech Club" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={clubForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tech">Tech</SelectItem>
                              <SelectItem value="sports">Sports</SelectItem>
                              <SelectItem value="cultural">Cultural</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={clubForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Describe the club" rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={createClubMutation.isPending}>
                      {createClubMutation.isPending ? 'Creating...' : 'Create Club'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Event</DialogTitle>
                </DialogHeader>
                <Form {...eventForm}>
                  <form onSubmit={eventForm.handleSubmit(handleCreateEvent)} className="space-y-4">
                    <FormField
                      control={eventForm.control}
                      name="club_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Club</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a club" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clubs.map(club => (
                                <SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eventForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Hackathon 2026" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eventForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Event details" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eventForm.control}
                      name="event_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Date & Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="datetime-local" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eventForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Main Auditorium" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eventForm.control}
                      name="max_participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Participants (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="Leave empty for unlimited" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={createEventMutation.isPending}>
                      {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Tabs defaultValue="clubs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="clubs" className="space-y-4 mt-6">
          {/* Search and Filter for Clubs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={clubSearchQuery}
              onChange={setClubSearchQuery}
              placeholder="Search clubs by name or description..."
              className="flex-1"
            />
            <FilterBar
              label="Category"
              value={clubCategoryFilter}
              onChange={setClubCategoryFilter}
              options={CATEGORY_OPTIONS}
              placeholder="All Categories"
            />
          </div>

          {/* Results count */}
          {!clubsLoading && (
            <div className="text-sm text-muted-foreground">
              Found {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'}
            </div>
          )}

          {clubsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredClubs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  {clubSearchQuery || clubCategoryFilter !== 'all'
                    ? 'No clubs match your search criteria.'
                    : 'No clubs yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubPagination.paginatedData.map((club) => (
                  <Card key={club.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{club.name}</CardTitle>
                          <Badge className="mt-2">{club.category}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{club.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Pagination
                currentPage={clubPagination.currentPage}
                totalPages={clubPagination.totalPages}
                onPageChange={clubPagination.goToPage}
                hasNextPage={clubPagination.hasNextPage}
                hasPreviousPage={clubPagination.hasPreviousPage}
                startIndex={clubPagination.startIndex}
                endIndex={clubPagination.endIndex}
                totalItems={clubPagination.totalItems}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4 mt-6">
          {/* Search for Events */}
          <SearchBar
            value={eventSearchQuery}
            onChange={setEventSearchQuery}
            placeholder="Search events by title, description, or location..."
          />

          {/* Results count */}
          {!eventsLoading && (
            <div className="text-sm text-muted-foreground">
              Found {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </div>
          )}

          {eventsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  {eventSearchQuery
                    ? 'No events match your search criteria.'
                    : 'No events yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {eventPagination.paginatedData.map((event) => {
                  const isRegistered = registrationIds.includes(event.id);
                  return (
                    <Card key={event.id} className="shadow-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle>{event.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge>{event.clubs?.name}</Badge>
                              <Badge variant="outline">{event.clubs?.category}</Badge>
                            </div>
                          </div>
                          <Button
                            variant={isRegistered ? 'outline' : 'default'}
                            size="sm"
                            onClick={() => isRegistered ? handleUnregister(event.id) : handleRegister(event.id)}
                            disabled={registerMutation.isPending || unregisterMutation.isPending}
                          >
                            {isRegistered ? 'Unregister' : 'Register'}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <CardDescription>{event.description}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.event_date).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        </div>
                        {event.max_participants && (
                          <p className="text-sm text-muted-foreground">
                            Max participants: {event.max_participants}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Pagination
                currentPage={eventPagination.currentPage}
                totalPages={eventPagination.totalPages}
                onPageChange={eventPagination.goToPage}
                hasNextPage={eventPagination.hasNextPage}
                hasPreviousPage={eventPagination.hasPreviousPage}
                startIndex={eventPagination.startIndex}
                endIndex={eventPagination.endIndex}
                totalItems={eventPagination.totalItems}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
