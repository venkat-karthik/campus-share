import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getSharedItemsByUser, deleteSharedItem } from '@/db/api';
import type { SharedItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ItemForm from '@/components/ItemForm';
import ItemCard from '@/components/ItemCard';

export default function ShareZonePage() {
  const { zone } = useParams<{ zone: string }>();
  const { user, profile } = useAuth();
  const [items, setItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadItems = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getSharedItemsByUser(user.id);
      const zoneItems = data.filter(item => item.zone === zone);
      setItems(zoneItems);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [user, zone]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSharedItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleItemCreated = () => {
    setDialogOpen(false);
    loadItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome to Share Zone, {profile?.full_name}</h1>
          <p className="text-muted-foreground mt-1">Zone: {zone?.toUpperCase()}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Share a New Item</DialogTitle>
            </DialogHeader>
            <ItemForm zone={zone || ''} onSuccess={handleItemCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground text-lg">You haven't shared any items yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Click "Add Item" to start sharing!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              showOwner={false}
              actions={
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
