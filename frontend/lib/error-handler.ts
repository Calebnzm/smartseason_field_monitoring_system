import { AxiosError } from 'axios';

export type ErrorType = 'validation' | 'auth' | 'not_found' | 'server' | 'network' | 'unknown';

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  userMessage: string;
  statusCode?: number;
  details?: Record<string, any>;
  isRetryable: boolean;
}

/**
 * Parse axios errors into user-friendly error information
 */
export function parseError(error: any): ErrorInfo {
  if (!error) {
    return {
      type: 'unknown',
      message: 'An unexpected error occurred',
      userMessage: 'Something went wrong. Please try again.',
      isRetryable: true,
    };
  }

  // Axios error
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    const message = data?.detail || data?.message || error.message || 'An error occurred';

    // Validation errors
    if (status === 422) {
      return {
        type: 'validation',
        message,
        userMessage: 'Please check your input and try again.',
        statusCode: status,
        details: data?.errors || { fields: message },
        isRetryable: false,
      };
    }

    // Authentication errors
    if (status === 401) {
      return {
        type: 'auth',
        message,
        userMessage: 'Your session has expired. Please log in again.',
        statusCode: status,
        isRetryable: false,
      };
    }

    // Forbidden
    if (status === 403) {
      return {
        type: 'auth',
        message,
        userMessage: 'You do not have permission to perform this action.',
        statusCode: status,
        isRetryable: false,
      };
    }

    // Not found
    if (status === 404) {
      return {
        type: 'not_found',
        message,
        userMessage: 'The resource you are looking for was not found.',
        statusCode: status,
        isRetryable: false,
      };
    }

    // Server errors
    if (status >= 500) {
      return {
        type: 'server',
        message,
        userMessage: 'A server error occurred. Please try again later.',
        statusCode: status,
        isRetryable: true,
      };
    }

    // Other HTTP errors
    return {
      type: 'unknown',
      message,
      userMessage: message,
      statusCode: status,
      isRetryable: status >= 500 || status === 429,
    };
  }

  // Network error
  if (error.message === 'Network Error' || !error.response) {
    return {
      type: 'network',
      message: 'Unable to connect to the server',
      userMessage: 'Network error. Please check your connection and try again.',
      isRetryable: true,
    };
  }

  // Generic error
  return {
    type: 'unknown',
    message: error.message || 'An unexpected error occurred',
    userMessage: 'Something went wrong. Please try again.',
    isRetryable: true,
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(details?: Record<string, any>): string[] {
  if (!details) return [];

  if (Array.isArray(details)) {
    return details;
  }

  if (typeof details === 'string') {
    return [details];
  }

  return Object.entries(details)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}: ${v}`);
      }
      return `${key}: ${value}`;
    })
    .flat();
}
