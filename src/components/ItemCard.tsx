import type { SharedItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Laptop, ShirtIcon, Package, MapPin, Calendar, User } from 'lucide-react';
import type { ReactNode } from 'react';

const CATEGORY_ICONS = {
  books: BookOpen,
  laptops: Laptop,
  aprons: ShirtIcon,
  others: Package,
};

const CATEGORY_COLORS = {
  books: 'bg-primary text-primary-foreground',
  laptops: 'bg-secondary text-secondary-foreground',
  aprons: 'bg-accent text-accent-foreground',
  others: 'bg-muted text-muted-foreground',
};

interface ItemCardProps {
  item: SharedItem;
  showOwner?: boolean;
  actions?: ReactNode;
}

export default function ItemCard({ item, showOwner = false, actions }: ItemCardProps) {
  const Icon = CATEGORY_ICONS[item.category];

  return (
    <Card className="shadow-card hover:shadow-hover transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-primary" />
              <Badge className={CATEGORY_COLORS[item.category]}>
                {item.category}
              </Badge>
            </div>
            <CardTitle>{item.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {item.images.length > 0 && (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        <div className="space-y-2 text-sm">
          {item.category === 'books' && (
            <>
              {item.subject && (
                <p>
                  <strong>Subject:</strong> {item.subject}
                </p>
              )}
            </>
          )}

          {item.category === 'laptops' && (
            <>
              {item.brand && (
                <p>
                  <strong>Brand:</strong> {item.brand}
                </p>
              )}
              {item.specs && (
                <p>
                  <strong>Specs:</strong> {item.specs}
                </p>
              )}
            </>
          )}

          {item.category === 'aprons' && (
            <>
              {item.size && (
                <p>
                  <strong>Size:</strong> {item.size}
                </p>
              )}
              {item.color && (
                <p>
                  <strong>Color:</strong> {item.color}
                </p>
              )}
            </>
          )}

          {item.description && (
            <CardDescription>{item.description}</CardDescription>
          )}

          {item.location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
          )}

          {item.availability_date && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Available: {new Date(item.availability_date).toLocaleDateString()}</span>
            </div>
          )}

          {showOwner && item.profiles && (
            <div className="flex items-center gap-1 text-muted-foreground pt-2 border-t">
              <User className="w-4 h-4" />
              <span>Shared by: {item.profiles.full_name}</span>
            </div>
          )}
        </div>

        {actions && <div className="pt-3 border-t">{actions}</div>}
      </CardContent>
    </Card>
  );
}
