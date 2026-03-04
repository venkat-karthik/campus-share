import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSharedItemsByUser, useDeleteSharedItem } from '@/hooks/use-shared-items';
import { usePagination } from '@/hooks/use-pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination } from '@/components/common/Pagination';
import ItemForm from '@/components/ItemForm';
import ItemCard from '@/components/ItemCard';

export default function ShareZonePage() {
  const { zone } = useParams<{ zone: string }>();
  const { user, profile } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: allItems = [], isLoading } = useSharedItemsByUser(user?.id);
  const deleteMutation = useDeleteSharedItem();

  // Filter items by zone
  const items = useMemo(() => {
    return allItems.filter(item => item.zone === zone);
  }, [allItems, zone]);

  // Pagination
  const pagination = usePagination({ data: items, itemsPerPage: 12 });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleItemCreated = () => {
    setDialogOpen(false);
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full bg-muted mb-4" />
                <Skeleton className="h-6 w-3/4 bg-muted mb-2" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagination.paginatedData.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                showOwner={false}
                actions={
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                }
              />
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
    </div>
  );
}
