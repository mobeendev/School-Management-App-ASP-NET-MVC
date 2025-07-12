import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Semester, SemesterDto, CreateSemesterDto, UpdateSemesterDto } from '../models/semester.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {
  private apiUrl = `${environment.apiUrl}/semesters`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('SemesterService - Token retrieved:', token ? 'Token exists' : 'No token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  async getAllSemesters(): Promise<SemesterDto[]> {
    try {
      const url = `${this.apiUrl}`;
      console.log('SemesterService - Fetching all semesters from:', url);
      const response = await firstValueFrom(this.http.get<SemesterDto[]>(url, { headers: this.getHeaders() }));
      console.log('SemesterService - All semesters response:', response);
      return response;
    } catch (error) {
      console.error('SemesterService - Error fetching semesters:', error);
      throw error;
    }
  }

  async getSemesterById(id: number): Promise<SemesterDto> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('SemesterService - Fetching semester by ID from:', url);
      const response = await firstValueFrom(this.http.get<SemesterDto>(url, { headers: this.getHeaders() }));
      console.log('SemesterService - Semester by ID response:', response);
      return response;
    } catch (error) {
      console.error('SemesterService - Error fetching semester:', error);
      throw error;
    }
  }

  async createSemester(semester: CreateSemesterDto): Promise<SemesterDto> {
    try {
      const url = `${this.apiUrl}`;
      console.log('SemesterService - Creating semester at:', url, 'with data:', semester);
      const response = await firstValueFrom(this.http.post<SemesterDto>(url, semester, { headers: this.getHeaders() }));
      console.log('SemesterService - Create semester response:', response);
      return response;
    } catch (error) {
      console.error('SemesterService - Error creating semester:', error);
      throw error;
    }
  }

  async updateSemester(semester: UpdateSemesterDto): Promise<SemesterDto> {
    try {
      const url = `${this.apiUrl}/${semester.id}`;
      console.log('SemesterService - Updating semester at:', url, 'with data:', semester);
      const response = await firstValueFrom(this.http.put<SemesterDto>(url, semester, { headers: this.getHeaders() }));
      console.log('SemesterService - Update semester response:', response);
      return response;
    } catch (error) {
      console.error('SemesterService - Error updating semester:', error);
      throw error;
    }
  }

  async deleteSemester(id: number): Promise<void> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('SemesterService - Deleting semester at:', url);
      await firstValueFrom(this.http.delete(url, { headers: this.getHeaders() }));
      console.log('SemesterService - Semester deleted successfully');
    } catch (error) {
      console.error('SemesterService - Error deleting semester:', error);
      throw error;
    }
  }
}