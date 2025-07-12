import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Lecturer, LecturerDto, CreateLecturerDto, UpdateLecturerDto, CreateLecturerWithUserDto } from '../models/lecturer.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LecturerService {
  private apiUrl = `${environment.apiUrl}/lecturers`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('LecturerService - Token retrieved:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    console.log('LecturerService - Headers created with Authorization:', token ? 'Bearer token added' : 'No Authorization header');
    
    return headers;
  }

  async getAllLecturers(): Promise<LecturerDto[]> {
    try {
      console.log('LecturerService - Making GET request to:', this.apiUrl);
      const response = await firstValueFrom(this.http.get<LecturerDto[]>(`${this.apiUrl}`, { headers: this.getHeaders() }));
      console.log('LecturerService - Response received:', response);
      return response;
    } catch (error) {
      console.error('LecturerService - Error fetching lecturers:', error);
      throw error;
    }
  }

  async getLecturerById(id: number): Promise<LecturerDto> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('LecturerService - Making GET request to:', url);
      const response = await firstValueFrom(this.http.get<LecturerDto>(url, { headers: this.getHeaders() }));
      console.log('LecturerService - Response received:', response);
      return response;
    } catch (error) {
      console.error('LecturerService - Error fetching lecturer:', error);
      throw error;
    }
  }

  async createLecturer(lecturer: CreateLecturerDto): Promise<LecturerDto> {
    try {
      console.log('LecturerService - Creating lecturer:', lecturer);
      console.log('LecturerService - Making POST request to:', this.apiUrl);
      const response = await firstValueFrom(this.http.post<LecturerDto>(`${this.apiUrl}`, lecturer, { headers: this.getHeaders() }));
      console.log('LecturerService - Lecturer created successfully:', response);
      return response;
    } catch (error) {
      console.error('LecturerService - Error creating lecturer:', error);
      throw error;
    }
  }

  async updateLecturer(lecturer: UpdateLecturerDto): Promise<LecturerDto> {
    try {
      const url = `${this.apiUrl}/${lecturer.id}`;
      console.log('LecturerService - Updating lecturer:', lecturer);
      console.log('LecturerService - Making PUT request to:', url);
      const response = await firstValueFrom(this.http.put<LecturerDto>(url, lecturer, { headers: this.getHeaders() }));
      console.log('LecturerService - Lecturer updated successfully:', response);
      return response;
    } catch (error) {
      console.error('LecturerService - Error updating lecturer:', error);
      throw error;
    }
  }

  async deleteLecturer(id: number): Promise<void> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('LecturerService - Making DELETE request to:', url);
      await firstValueFrom(this.http.delete(url, { headers: this.getHeaders() }));
      console.log('LecturerService - Lecturer deleted successfully');
    } catch (error) {
      console.error('LecturerService - Error deleting lecturer:', error);
      throw error;
    }
  }
}