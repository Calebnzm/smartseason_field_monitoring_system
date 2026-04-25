'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/auth-context';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { loginSchema, type LoginInput } from '@/lib/schemas';
import { Leaf } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setDisplayError(null);

    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setDisplayError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
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
            {displayError && (
              <Alert
                type="error"
                title="Login Failed"
                message={displayError}
                onClose={() => setDisplayError(null)}
              />
            )}

            <FormInput
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              required
              error={errors.email}
              {...register('email')}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              error={errors.password}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
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

        {/* Demo Info Card */}
        <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 backdrop-blur-sm">
          <p className="text-white text-xs font-semibold mb-2 opacity-90">Demo Credentials:</p>
          <div className="space-y-1 text-white text-xs opacity-80">
            <p>Email: <span className="font-mono">admin@example.com</span></p>
            <p>Password: <span className="font-mono">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
