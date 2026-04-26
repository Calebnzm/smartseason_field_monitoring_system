'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { api, User, Invitation } from '@/lib/api';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { SkeletonCard, SkeletonTable } from '@/components/Skeleton';
import { useError } from '@/lib/useError';
import { formatValidationErrors } from '@/lib/error-handler';
import { Plus, Trash2, RefreshCw, Mail, Shield, X } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { error: displayError, handleError, clearError } = useError();
  const [mounted, setMounted] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'agent' | 'farmer'>('agent');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: users, error: usersError, isLoading: usersLoading, mutate: refetchUsers } = useSWR<User[]>(
    '/users/',
    fetcher,
    { revalidateOnReconnect: true }
  );

  const { data: invitations, error: invitationsError, isLoading: invitationsLoading, mutate: refetchInvitations } = useSWR<Invitation[]>(
    '/invitations/',
    fetcher,
    { revalidateOnReconnect: true }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (usersError) handleError(usersError);
    if (invitationsError) handleError(invitationsError);
  }, [usersError, invitationsError, handleError]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviteLoading(true);
    clearError();
    try {
      await api.post('/invitations/send/', {
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail('');
      setInviteRole('agent');
      setShowInviteModal(false);
      refetchInvitations();
    } catch (err) {
      handleError(err);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setIsDeleting(true);
    clearError();
    try {
      await api.delete(`/users/${userId}/`);
      refetchUsers();
      setDeleteConfirm(null);
    } catch (err) {
      handleError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-10 w-1/3 bg-gradient-to-r from-var(--color-surface-secondary) via-var(--color-surface-tertiary) to-var(--color-surface-secondary) rounded animate-pulse"></div>
          <SkeletonTable rows={5} columns={5} />
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text)]">
            User Management
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Manage users and send invitations to new team members
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="primary"
            size="lg"
            icon={<Plus size={20} />}
            onClick={() => setShowInviteModal(true)}
            fullWidth
          >
            Invite User
          </Button>
          <Button
            variant="outline"
            size="lg"
            icon={<RefreshCw size={20} />}
            onClick={() => {
              refetchUsers();
              refetchInvitations();
            }}
            disabled={usersLoading || invitationsLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {displayError && (
        <Alert
          type="error"
          title="Error"
          message={displayError.userMessage}
          details={displayError.details ? formatValidationErrors(displayError.details) : undefined}
          onClose={clearError}
          dismissible
        />
      )}

      {/* Users Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Active Users</h2>

        {usersLoading ? (
          <SkeletonTable rows={5} columns={5} />
        ) : users && users.length > 0 ? (
          <div className="overflow-x-auto card">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium">
                      {u.first_name} {u.last_name}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[var(--color-surface-secondary)]">
                        <Shield size={14} />
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-block px-3 py-1 rounded text-sm ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {deleteConfirm === u.id ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(u.id)}
                          isLoading={isDeleting}
                        >
                          Confirm
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={16} />}
                          onClick={() => setDeleteConfirm(u.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 card">
            <p className="text-[var(--color-text-secondary)]">No users found</p>
          </div>
        )}
      </div>

      {/* Pending Invitations Section */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Pending Invitations</h2>

        {invitationsLoading ? (
          <SkeletonTable rows={3} columns={4} />
        ) : invitations && invitations.length > 0 ? (
          <div className="overflow-x-auto card">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Sent Date</th>
                  <th>Expires</th>
                </tr>
              </thead>
              <tbody>
                {invitations.filter((inv) => !inv.accepted).map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-medium">{inv.email}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[var(--color-surface-secondary)]">
                        <Shield size={14} />
                        {inv.role}
                      </span>
                    </td>
                    <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td>{new Date(inv.expires_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 card">
            <p className="text-[var(--color-text-secondary)]">No pending invitations</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h3 className="text-xl font-bold text-[var(--color-text)]">Invite New User</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="form-input"
                  required
                  disabled={inviteLoading}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Role
                </label>
                <select
                  id="role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'agent' | 'farmer')}
                  className="form-input"
                  disabled={inviteLoading}
                >
                  <option value="agent">Agent</option>
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={inviteLoading}
                  fullWidth
                  icon={<Mail size={18} />}
                >
                  Send Invitation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  disabled={inviteLoading}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
