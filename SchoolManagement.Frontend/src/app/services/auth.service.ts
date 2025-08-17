import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, UserInfo, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api'; // Base API URL
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'user_info';

  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    roles: []
  });

  public authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserInfo;
        this.authState.next({
          isAuthenticated: true,
          user,
          token,
          roles: user.roles || []
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.logout();
      }
    }
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      
      console.log('Making login request to:', `${this.apiUrl}/Account/Login`);
      console.log('Request payload:', loginRequest);
      console.log('Request headers:', headers);
      
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/Account/Login`, loginRequest, { headers })
      );
      
      if (response && response.token) {
        console.log('AuthService - Login successful, storing user data:', response);
        
        // Store authentication data
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        
        // Update state
        const newAuthState = {
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          roles: response.roles || []
        };
        
        console.log('AuthService - Updating auth state:', newAuthState);
        this.authState.next(newAuthState);
        
        return response;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      console.error('Error status:', error.status);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      
      if (error.status === 0) {
        throw new Error('Cannot connect to server. Please check if the backend API is running at http://localhost:5000');
      }
      
      throw error;
    }
  }

  async register(registerRequest: RegisterRequest): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.apiUrl}/Account/Register`, registerRequest));
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout(): void {
    // Clear localStorage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    // Update state
    this.authState.next({
      isAuthenticated: false,
      user: null,
      token: null,
      roles: []
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): UserInfo | null {
    return this.authState.value.user;
  }

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  hasRole(role: string): boolean {
    return this.authState.value.roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.authState.value.roles.includes(role));
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isLecturer(): boolean {
    return this.hasRole('Lecturer');
  }

  isStudent(): boolean {
    return this.hasRole('Student');
  }

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }
}