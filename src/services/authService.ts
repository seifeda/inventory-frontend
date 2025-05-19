import apiService from './api';
import { API_ENDPOINTS } from '../config';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.register, data);
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await apiService.get<AuthResponse['user']>('/api/auth/me');
    return response;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await apiService.post<{ token: string }>(API_ENDPOINTS.auth.refresh, { refreshToken });
    localStorage.setItem('token', response.token);
    return response;
  }
};

export default authService; 