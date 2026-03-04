import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAllProfiles, useUpdateUserRole } from '@/hooks/use-admin';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { Pagination } from '@/components/common/Pagination';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminPage() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { toast } = useToast();

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Use React Query hooks
  const { data: profiles = [], isLoading } = useAllProfiles();
  const updateRoleMutation = useUpdateUserRole();

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    let result = profiles;

    if (roleFilter !== 'all') {
      result = result.filter(p => p.role === roleFilter);
    }

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(p =>
        p.full_name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query)
      );
    }

    return result;
  }, [profiles, roleFilter, debouncedSearch]);

  // Pagination
  const pagination = usePagination({ data: filteredProfiles, itemsPerPage: 20 });

  const handleRoleChange = (userId: string, newRole: 'user' | 'admin') => {
    updateRoleMutation.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => {
          toast({ title: 'User role updated successfully' });
        },
        onError: () => {
          toast({ title: 'Failed to update user role', variant: 'destructive' });
        },
      }
    );
  };

  const ROLE_OPTIONS = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];

  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">Manage users and their roles</p>
      </div>

      <Alert>
        <AlertDescription>
          <strong>Note:</strong> The first registered user is automatically assigned as admin. You can manage other users' roles here.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name or email..."
              className="flex-1"
            />
            <FilterBar
              label="Role"
              value={roleFilter}
              onChange={setRoleFilter}
              options={ROLE_OPTIONS}
              placeholder="All Roles"
            />
          </div>

          {/* Results count */}
          {!isLoading && (
            <div className="text-sm text-muted-foreground">
              Found {filteredProfiles.length} {filteredProfiles.length === 1 ? 'user' : 'users'}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-muted" />
              ))}
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery || roleFilter !== 'all'
                  ? 'No users match your search criteria.'
                  : 'No users found.'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value as 'user' | 'admin')}
                          disabled={user.id === profile.id || updateRoleMutation.isPending}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
    </div>
  );
}
