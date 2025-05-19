import { apiService } from './api';
import { API_ENDPOINTS } from '../config';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  password?: string;
  isActive?: boolean;
}

export interface UserRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export interface UserPermission {
  id: number;
  name: string;
  description: string;
}

const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiService.get<User[]>(API_ENDPOINTS.users.base);
    return response;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await apiService.get<User>(`${API_ENDPOINTS.users.base}/${id}`);
    return response;
  },

  // Create new user
  createUser: async (userData: CreateUserDto): Promise<User> => {
    const response = await apiService.post<User>(API_ENDPOINTS.users.base, userData);
    return response;
  },

  // Update user
  updateUser: async (id: number, userData: UpdateUserDto): Promise<User> => {
    const response = await apiService.put<User>(`${API_ENDPOINTS.users.base}/${id}`, userData);
    return response;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await apiService.delete(`${API_ENDPOINTS.users.base}/${id}`);
  },

  // Get all roles
  getRoles: async (): Promise<UserRole[]> => {
    const response = await apiService.get<UserRole[]>(API_ENDPOINTS.users.roles);
    return response;
  },

  // Create new role
  createRole: async (roleData: Omit<UserRole, 'id'>): Promise<UserRole> => {
    const response = await apiService.post<UserRole>(API_ENDPOINTS.users.roles, roleData);
    return response;
  },

  // Update role
  updateRole: async (id: number, roleData: Partial<Omit<UserRole, 'id'>>): Promise<UserRole> => {
    const response = await apiService.put<UserRole>(`${API_ENDPOINTS.users.roles}/${id}`, roleData);
    return response;
  },

  // Delete role
  deleteRole: async (id: number): Promise<void> => {
    await apiService.delete(`${API_ENDPOINTS.users.roles}/${id}`);
  },

  // Get all permissions
  getPermissions: async (): Promise<UserPermission[]> => {
    const response = await apiService.get<UserPermission[]>(API_ENDPOINTS.users.permissions);
    return response;
  },

  // Update user role
  updateUserRole: async (userId: number, roleId: number): Promise<User> => {
    const response = await apiService.put<User>(`${API_ENDPOINTS.users.base}/${userId}/role`, { roleId });
    return response;
  },

  // Update user status
  updateUserStatus: async (userId: number, isActive: boolean): Promise<User> => {
    const response = await apiService.put<User>(`${API_ENDPOINTS.users.base}/${userId}/status`, { isActive });
    return response;
  }
};

export default userService; 