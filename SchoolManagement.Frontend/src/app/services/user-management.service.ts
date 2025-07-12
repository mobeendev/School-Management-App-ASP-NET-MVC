import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { 
  UserManagementDto, 
  CreateUserDto, 
  UpdateUserDto, 
  UserDetailsDto, 
  UserByRoleDto 
} from '../models/user-management.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = `${environment.apiUrl}/usermanagement`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('UserManagementService - Token retrieved:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    console.log('UserManagementService - Headers created:', {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'No Authorization header'
    });
    
    return headers;
  }

  async getAllUsers(role?: string): Promise<UserManagementDto[]> {
    try {
      let url = this.apiUrl;
      if (role) {
        url += `?role=${encodeURIComponent(role)}`;
      }
      console.log('UserManagementService - Making GET request to:', url);
      const response = await firstValueFrom(this.http.get<UserManagementDto[]>(url, { headers: this.getHeaders() }));
      console.log('UserManagementService - Response received:', response);
      return response;
    } catch (error) {
      console.error('UserManagementService - Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserDetailsDto> {
    try {
      const response = await firstValueFrom(this.http.get<UserDetailsDto>(`${this.apiUrl}/${id}`));
      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(user: CreateUserDto): Promise<UserManagementDto> {
    try {
      console.log('UserManagementService - Creating user:', user);
      console.log('UserManagementService - Making POST request to:', this.apiUrl);
      const response = await firstValueFrom(this.http.post<UserManagementDto>(this.apiUrl, user, { headers: this.getHeaders() }));
      console.log('UserManagementService - User created successfully:', response);
      return response;
    } catch (error) {
      console.error('UserManagementService - Error creating user:', error);
      throw error;
    }
  }

  async updateUser(user: UpdateUserDto): Promise<UserManagementDto> {
    try {
      const response = await firstValueFrom(this.http.put<UserManagementDto>(`${this.apiUrl}/${user.id}`, user));
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async setUserActiveStatus(id: string, isActive: boolean): Promise<void> {
    try {
      await firstValueFrom(this.http.patch(`${this.apiUrl}/${id}/status`, isActive));
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUsersByRole(role: string): Promise<UserByRoleDto[]> {
    try {
      const url = `${this.apiUrl}/by-role/${role}`;
      console.log('UserManagementService - Making GET request to:', url);
      const response = await firstValueFrom(this.http.get<UserByRoleDto[]>(url, { headers: this.getHeaders() }));
      console.log('UserManagementService - Users by role response:', response);
      return response;
    } catch (error) {
      console.error('UserManagementService - Error fetching users by role:', error);
      throw error;
    }
  }

  async updateUserRole(id: string, newRole: string): Promise<void> {
    try {
      await firstValueFrom(this.http.patch(`${this.apiUrl}/${id}/role`, newRole));
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async resetUserPassword(id: string, newPassword: string): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/${id}/reset-password`, newPassword));
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw error;
    }
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.get<{exists: boolean}>(`${this.apiUrl}/check-email/${encodeURIComponent(email)}`));
      return response.exists;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  }

  // Helper method to get role badge color
  getRoleBadgeColor(role: string): string {
    switch (role) {
      case 'Admin':
        return 'bg-error-100 text-error-800';
      case 'Lecturer':
        return 'bg-primary-100 text-primary-800';
      case 'Student':
        return 'bg-accent-100 text-accent-800';
      case 'Staff':
        return 'bg-secondary-100 text-secondary-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  }

  // Helper method to get status badge color
  getStatusBadgeColor(isActive: boolean): string {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  // Helper method to format user display name
  formatUserDisplayName(user: UserManagementDto | UserDetailsDto): string {
    return `${user.firstName} ${user.lastName}`;
  }
}