'use client';

import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for graceful error handling
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error caught:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="min-h-screen bg-var(--color-background) flex items-center justify-center p-4">
          <div className="bg-var(--color-surface) rounded-lg shadow-lg p-8 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-var(--color-danger)" size={32} />
              <h1 className="text-2xl font-bold text-var(--color-text)">
                Something went wrong
              </h1>
            </div>
            <p className="text-var(--color-text-secondary) mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-var(--color-surface-secondary) rounded p-3 mb-6 text-sm text-var(--color-text-tertiary) font-mono overflow-auto max-h-40">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.reset}
              className="btn btn-primary w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
