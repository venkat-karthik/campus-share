import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createSharedItem } from '@/db/api';
import type { ItemCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/use-image-upload';

interface ItemFormProps {
  zone: string;
  onSuccess: () => void;
}

export default function ItemForm({ zone, onSuccess }: ItemFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadFiles, uploading } = useImageUpload('app-8yy119savwg1_campus_images');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('books');

  const form = useForm({
    defaultValues: {
      category: 'books' as ItemCategory,
      name: '',
      subject: '',
      brand: '',
      specs: '',
      size: '',
      color: '',
      description: '',
      location: '',
      availability_date: '',
      images: [] as File[],
    },
  });

  const handleSubmit = async (values: any) => {
    if (!user) return;

    try {
      let imageUrls: string[] = [];
      if (values.images.length > 0) {
        imageUrls = await uploadFiles(values.images);
      }

      await createSharedItem({
        user_id: user.id,
        zone,
        category: values.category,
        name: values.name,
        subject: values.subject || null,
        brand: values.brand || null,
        specs: values.specs || null,
        size: values.size || null,
        color: values.color || null,
        description: values.description || null,
        location: values.location || null,
        availability_date: values.availability_date || null,
        images: imageUrls,
      });

      toast({ title: 'Item shared successfully!' });
      onSuccess();
    } catch (error) {
      toast({ title: 'Failed to share item', variant: 'destructive' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCategory(value as ItemCategory);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="aprons">Aprons</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter item name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCategory === 'books' && (
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
        )}

        {selectedCategory === 'laptops' && (
          <>
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Dell, HP" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specifications</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., Intel i5, 8GB RAM, 256GB SSD" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {selectedCategory === 'aprons' && (
          <>
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Medium, Large" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Blue, White" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes / Description (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Any additional information" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Location (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Library 2nd Floor" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availability_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available From (Optional)</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
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
          {uploading ? 'Uploading...' : 'Share Item'}
        </Button>
      </form>
    </Form>
  );
}
