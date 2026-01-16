import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedItemsByZone } from '@/db/api';
import type { SharedItem, ItemCategory } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ItemCard from '@/components/ItemCard';

const CATEGORIES: { value: ItemCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'books', label: 'Books' },
  { value: 'laptops', label: 'Laptops' },
  { value: 'aprons', label: 'Aprons' },
  { value: 'others', label: 'Others' },
];

export default function ReceiveZonePage() {
  const { zone } = useParams<{ zone: string }>();
  const [items, setItems] = useState<SharedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadItems = async () => {
      if (!zone) return;
      try {
        setLoading(true);
        const data = await getSharedItemsByZone(zone);
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Failed to load items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [zone]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to Receive Zone</h1>
        <p className="text-muted-foreground mt-1">Zone: {zone?.toUpperCase()}</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter by category:</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      ) : filteredItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground text-lg">No items available in this zone.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} showOwner={true} />
          ))}
        </div>
      )}
    </div>
  );
}
