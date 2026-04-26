'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/auth-context';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { loginSchema, type LoginInput } from '@/lib/schemas';
import { useError } from '@/lib/useError';
import { formatValidationErrors } from '@/lib/error-handler';
import { Leaf, Lock, User } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { error: apiError, handleError: setApiError, clearError } = useError();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    clearError();

    try {
      await login(data.username, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md z-10">
        <div className="card shadow-2xl bg-[var(--color-surface)]">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              SmartSeason
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Smart Field Monitoring System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {apiError && (
              <Alert
                type="error"
                title={apiError.type === 'auth' ? 'Authentication Failed' : 'Login Error'}
                message={apiError.userMessage}
                details={apiError.details ? formatValidationErrors(apiError.details) : undefined}
                onClose={clearError}
                dismissible
              />
            )}

            {/* Form validation errors */}
            {Object.keys(errors).length > 0 && !apiError && (
              <Alert
                type="warning"
                title="Please check your input"
                message="Some fields have errors. Please review and try again."
                dismissible={false}
              />
            )}

            <div className="form-group">
              <label htmlFor="username" className="form-label required">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-[var(--color-text-tertiary)] pointer-events-none" size={18} />
                <input
                  id="username"
                  type="text"
                  placeholder="admin"
                  className="form-input pl-10"
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <span className="form-error">{errors.username.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label required">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[var(--color-text-tertiary)] pointer-events-none" size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="form-input pl-10"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              fullWidth
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Need an account?{' '}
              <span className="text-[var(--color-primary)] font-semibold">
                Contact your administrator
              </span>
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}
