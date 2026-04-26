'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { useError } from '@/lib/useError';
import { Leaf, Mail, Lock, User, CheckCircle } from 'lucide-react';
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
  const { error: displayError, handleError, clearError } = useError();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteDetails, setInviteDetails] = useState<InvitationDetails | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const token = searchParams?.get('token');

  useEffect(() => {
    if (!token) {
      handleError(new Error('Invalid or missing invitation token'));
      setIsLoading(false);
      return;
    }

    // Verify the token
    const verifyToken = async () => {
      try {
        const res = await api.get(`/invitations/verify/?token=${token}`);
        setInviteDetails(res.data);
      } catch (err: any) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, handleError]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      handleError(new Error('Invalid token'));
      return;
    }

    clearError();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await acceptInvite(token, username, password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-4">
        <div className="bg-[var(--color-surface)] rounded-lg shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Invitation Accepted!
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Your account has been created successfully. Redirecting to dashboard...
          </p>
          <Button variant="primary" fullWidth onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Setup Card */}
      <div className="relative w-full max-w-md z-10">
        <div className="card shadow-2xl bg-[var(--color-surface)]">
          {/* Header */}
          <div className="p-8 border-b border-[var(--color-border)] text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="text-white" size={32} />
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
            <div className="p-8 border-b border-[var(--color-border)]">
              <div className="p-4 bg-[var(--color-surface-secondary)] rounded-lg border border-[var(--color-border)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--color-text-secondary)]">Email</p>
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">
                      {inviteDetails.email}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  <span className="inline-block bg-[var(--color-background)] px-3 py-1 rounded text-[var(--color-primary)] font-semibold capitalize">
                    {inviteDetails.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="p-8 space-y-6">
            {displayError && (
              <Alert
                type="error"
                title="Setup Failed"
                message={displayError.userMessage}
                onClose={clearError}
                dismissible
              />
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-[var(--color-text-tertiary)] pointer-events-none" size={18} />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (validationErrors.username) {
                      setValidationErrors({ ...validationErrors, username: '' });
                    }
                  }}
                  placeholder="johndoe"
                  className="form-input pl-10"
                  disabled={isSubmitting}
                  autoComplete="username"
                />
              </div>
              {validationErrors.username && (
                <span className="form-error">{validationErrors.username}</span>
              )}
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                At least 3 characters, used for login
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[var(--color-text-tertiary)] pointer-events-none" size={18} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: '' });
                    }
                  }}
                  placeholder="••••••••"
                  className="form-input pl-10"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              </div>
              {validationErrors.password && (
                <span className="form-error">{validationErrors.password}</span>
              )}
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                At least 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[var(--color-text-tertiary)] pointer-events-none" size={18} />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors({ ...validationErrors, confirmPassword: '' });
                    }
                  }}
                  placeholder="••••••••"
                  className="form-input pl-10"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              </div>
              {validationErrors.confirmPassword && (
                <span className="form-error">{validationErrors.confirmPassword}</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              fullWidth
            >
              Complete Setup
            </Button>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-[var(--color-border)] text-center">
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
