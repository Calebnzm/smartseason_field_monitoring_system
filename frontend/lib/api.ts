import axios, { AxiosInstance, AxiosError } from 'axios';
import { parseError } from './error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Enhance error with parsed information
    const parsedError = parseError(error);
    error.message = parsedError.userMessage;
    
    return Promise.reject(error);
  }
);

// Types
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'agent' | 'farmer';
  is_active: boolean;
}

export interface Field {
  id: number;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  crop_type: string;
  size_hectares: number;
  planting_date: string;
  current_stage: string;
  health_status: 'active' | 'at_risk' | 'completed' | 'unknown';
  assigned_agent?: number;
  created_at: string;
  updated_at: string;
}

export interface FieldUpdate {
  id: number;
  field: number;
  stage: string;
  status: string;
  notes: string;
  satellite_data?: Record<string, any>;
  created_at: string;
}

export interface Invitation {
  id: number;
  email: string;
  role: 'admin' | 'agent' | 'farmer';
  token: string;
  accepted: boolean;
  created_at: string;
  expires_at: string;
}
