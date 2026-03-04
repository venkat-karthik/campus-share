import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLostFoundItems, useCreateLostFoundItem, useUpdateLostFoundItem, useDeleteLostFoundItem } from '@/hooks/use-lost-found';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Trash2, CheckCircle } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { Pagination } from '@/components/common/Pagination';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/use-image-upload';

export default function LostFoundPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { uploadFiles, uploading } = useImageUpload('app-8yy119savwg1_campus_images');

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      location_found: '',
      images: [] as File[],
    },
  });

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getLostFoundItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to load lost & found items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (values: { title: string; description: string; location_found: string; images: File[] }) => {
    if (!user) return;

    try {
      let imageUrls: string[] = [];
      if (values.images.length > 0) {
        imageUrls = await uploadFiles(values.images);
      }

      await createLostFoundItem({
        user_id: user.id,
        title: values.title,
        description: values.description,
        location_found: values.location_found,
        images: imageUrls,
        status: 'found',
      });

      toast({ title: 'Item posted successfully' });
      setDialogOpen(false);
      form.reset();
      loadItems();
    } catch (error) {
      toast({ title: 'Failed to post item', variant: 'destructive' });
    }
  };

  const handleMarkReturned = async (id: string) => {
    if (!user) return;
    try {
      await updateLostFoundItem(id, { status: 'returned', claimed_by: user.id });
      toast({ title: 'Item marked as returned' });
      loadItems();
    } catch (error) {
      toast({ title: 'Failed to update item', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLostFoundItem(id);
      toast({ title: 'Item deleted' });
      loadItems();
    } catch (error) {
      toast({ title: 'Failed to delete item', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Search className="w-8 h-8 text-primary" />
            Lost & Found
          </h1>
          <p className="text-muted-foreground mt-1">Help reunite lost items with their owners</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Report Found Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report a Found Item</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Blue Backpack" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe the item in detail" rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location_found"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Found</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Library 2nd Floor" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => field.onChange(Array.from(e.target.files || []))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Post Item'}
                </Button>
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
      ) : items.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground text-lg">No lost & found items yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{item.title}</CardTitle>
                    <Badge className="mt-2" variant={item.status === 'found' ? 'default' : 'secondary'}>
                      {item.status === 'found' ? 'Found' : 'Returned'}
                    </Badge>
                  </div>
                  {user && item.user_id === user.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.images.length > 0 && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <CardDescription>{item.description}</CardDescription>
                <div className="text-sm">
                  <p className="text-muted-foreground">
                    <strong>Found at:</strong> {item.location_found}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Found by:</strong> {item.profiles?.full_name}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                {item.status === 'found' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleMarkReturned(item.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Returned
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
