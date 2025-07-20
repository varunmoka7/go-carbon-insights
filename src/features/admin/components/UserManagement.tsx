import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useModerationAPI } from '../hooks/useModerationAPI';
import { User } from '../types';
import { format } from 'date-fns';

interface UserManagementProps {
  // Add any props if needed
}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('');

  const { suspendUser, unsuspendUser, isSuspending, isUnsuspending, error } = useModerationAPI();

  const { data: users, isLoading, isError } = useQuery<User[]>({ // Assuming an API to fetch users
    queryKey: ['adminUsers', searchTerm, filterRole],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole !== 'all') params.append('role', filterRole);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data.users;
    },
  });

  const handleSuspendClick = (user: User) => {
    setSelectedUser(user);
    setIsSuspendDialogOpen(true);
  };

  const handleSuspendConfirm = async () => {
    if (selectedUser) {
      await suspendUser({
        userId: selectedUser.id,
        reason: suspendReason,
        duration: suspendDuration || undefined,
      });
      setIsSuspendDialogOpen(false);
      setSelectedUser(null);
      setSuspendReason('');
      setSuspendDuration('');
    }
  };

  const handleUnsuspend = async (userId: string) => {
    await unsuspendUser(userId);
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users.</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isActive ? 'Active' : 'Suspended'}</TableCell>
                <TableCell>{format(new Date(user.createdAt), 'PPP')}</TableCell>
                <TableCell className="text-right">
                  {user.isActive ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleSuspendClick(user)}
                      disabled={isSuspending}
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnsuspend(user.id)}
                      disabled={isUnsuspending}
                    >
                      Unsuspend
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suspend User: {selectedUser?.username}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Reason for suspension..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
              <Input
                placeholder="Duration (e.g., '7 days', '1 month', 'permanent')"
                value={suspendDuration}
                onChange={(e) => setSuspendDuration(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSuspendConfirm} disabled={isSuspending || !suspendReason.trim()}>
                {isSuspending ? 'Suspending...' : 'Confirm Suspend'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
