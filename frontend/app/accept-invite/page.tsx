'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/auth-context';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { acceptInviteSchema, type AcceptInviteInput } from '@/lib/schemas';
import { Leaf, Mail } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { api } from '@/lib/api';

interface InvitationDetails {
  email: string;
  role: string;
  expires_at: string;
}

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { acceptInvite } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteDetails, setInviteDetails] = useState<InvitationDetails | null>(null);
  const token = searchParams?.get('token');

  useEffect(() => {
    if (!token) {
      setDisplayError('Invalid or missing invitation token');
      setIsLoading(false);
      return;
    }

    // Verify the token
    const verifyToken = async () => {
      try {
        const res = await api.get(`/invitations/verify/?token=${token}`);
        setInviteDetails(res.data);
      } catch (err: any) {
        setDisplayError(
          err.response?.data?.detail || 'Invalid or expired invitation token'
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AcceptInviteInput>({
    resolver: zodResolver(acceptInviteSchema),
  });

  const onSubmit = async (data: AcceptInviteInput) => {
    if (!token) {
      setDisplayError('Invalid token');
      return;
    }

    setIsSubmitting(true);
    setDisplayError(null);

    try {
      await acceptInvite(token, data.username, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setDisplayError(
        err.response?.data?.detail || 'Failed to accept invitation. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verifying invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Setup Card */}
      <div className="relative w-full max-w-md z-10">
        <div className="card shadow-2xl bg-[var(--color-surface)]">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center shadow-lg">
                <Mail className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              Welcome to SmartSeason
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Complete your account setup
            </p>
          </div>

          {/* Invitation Details */}
          {inviteDetails && (
            <div className="mb-6 p-4 bg-[var(--color-surface-secondary)] rounded-lg border border-[var(--color-border)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center">
                  <Leaf className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)]">Email</p>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {inviteDetails.email}
                  </p>
                </div>
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                <span className="inline-block bg-[var(--color-background)] px-2 py-1 rounded text-[var(--color-primary)] font-semibold">
                  {inviteDetails.role.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {displayError && (
              <Alert
                type="error"
                title="Setup Failed"
                message={displayError}
                onClose={() => setDisplayError(null)}
              />
            )}

            <FormInput
              label="Username"
              type="text"
              placeholder="Enter your username"
              required
              helperText="Will be used for login"
              error={errors.username}
              {...register('username')}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              helperText="Must be at least 8 characters"
              error={errors.password}
              {...register('password')}
            />

            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              required
              error={errors.confirmPassword}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              Complete Setup
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
            <p className="text-xs text-[var(--color-text-secondary)]">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-[var(--color-primary)] font-semibold hover:text-[var(--color-primary-dark)] transition"
              >
                Sign in instead
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}
