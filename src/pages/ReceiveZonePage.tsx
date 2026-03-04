import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSharedItemsByZone } from '@/hooks/use-shared-items';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import type { ItemCategory } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { Pagination } from '@/components/common/Pagination';
import ItemCard from '@/components/ItemCard';

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'books', label: 'Books' },
  { value: 'laptops', label: 'Laptops' },
  { value: 'aprons', label: 'Aprons' },
  { value: 'others', label: 'Others' },
];

export default function ReceiveZonePage() {
  const { zone } = useParams<{ zone: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const { data: items = [], isLoading } = useSharedItemsByZone(zone);

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Search by name, description, brand, or owner
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query) ||
        item.profiles?.full_name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [items, selectedCategory, debouncedSearch]);

  // Pagination
  const pagination = usePagination({ data: filteredItems, itemsPerPage: 12 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to Receive Zone</h1>
        <p className="text-muted-foreground mt-1">Zone: {zone?.toUpperCase()}</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search items by name, description, brand, or owner..."
          className="flex-1"
        />
        <FilterBar
          label="Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={CATEGORIES}
          placeholder="All Categories"
        />
      </div>

      {/* Results count */}
      {!isLoading && (
        <div className="text-sm text-muted-foreground">
          Found {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </div>
      )}

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : pagination.paginatedData.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground text-lg">
              {searchQuery || selectedCategory !== 'all' 
                ? 'No items match your search criteria.' 
                : 'No items available in this zone.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search terms.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagination.paginatedData.map((item) => (
              <ItemCard key={item.id} item={item} showOwner={true} />
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
