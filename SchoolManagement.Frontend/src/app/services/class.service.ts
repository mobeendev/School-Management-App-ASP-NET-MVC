import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Class, ClassDto, CreateClassDto, UpdateClassDto } from '../models/class.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('ClassService - Token retrieved:', token ? 'Token exists' : 'No token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  async getAllClasses(): Promise<ClassDto[]> {
    try {
      const url = `${this.apiUrl}`;
      console.log('ClassService - Fetching all classes from:', url);
      const response = await firstValueFrom(this.http.get<ClassDto[]>(url, { headers: this.getHeaders() }));
      console.log('ClassService - All classes response:', response);
      return response;
    } catch (error) {
      console.error('ClassService - Error fetching classes:', error);
      throw error;
    }
  }

  async getClassById(id: number): Promise<ClassDto> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('ClassService - Fetching class by ID from:', url);
      const response = await firstValueFrom(this.http.get<ClassDto>(url, { headers: this.getHeaders() }));
      console.log('ClassService - Class by ID response:', response);
      return response;
    } catch (error) {
      console.error('ClassService - Error fetching class:', error);
      throw error;
    }
  }

  async createClass(classData: CreateClassDto): Promise<ClassDto> {
    try {
      const url = `${this.apiUrl}`;
      console.log('ClassService - Creating class at:', url, 'with data:', classData);
      const response = await firstValueFrom(this.http.post<ClassDto>(url, classData, { headers: this.getHeaders() }));
      console.log('ClassService - Create class response:', response);
      return response;
    } catch (error) {
      console.error('ClassService - Error creating class:', error);
      throw error;
    }
  }

  async updateClass(classData: UpdateClassDto): Promise<ClassDto> {
    try {
      const url = `${this.apiUrl}/${classData.id}`;
      console.log('ClassService - Updating class at:', url, 'with data:', classData);
      const response = await firstValueFrom(this.http.put<ClassDto>(url, classData, { headers: this.getHeaders() }));
      console.log('ClassService - Update class response:', response);
      return response;
    } catch (error) {
      console.error('ClassService - Error updating class:', error);
      throw error;
    }
  }

  async deleteClass(id: number): Promise<void> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('ClassService - Deleting class at:', url);
      await firstValueFrom(this.http.delete(url, { headers: this.getHeaders() }));
      console.log('ClassService - Class deleted successfully');
    } catch (error) {
      console.error('ClassService - Error deleting class:', error);
      throw error;
    }
  }
}