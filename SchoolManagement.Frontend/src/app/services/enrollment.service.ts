import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Enrollment, EnrollmentDto, CreateEnrollmentDto, UpdateEnrollmentDto } from '../models/enrollment.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = `${environment.apiUrl}/enrollments`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('EnrollmentService - Token retrieved:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    console.log('EnrollmentService - Headers created with Authorization:', token ? 'Bearer token added' : 'No Authorization header');
    
    return headers;
  }

  async getAllEnrollments(): Promise<EnrollmentDto[]> {
    try {
      console.log('EnrollmentService - Making GET request to:', this.apiUrl);
      const response = await firstValueFrom(this.http.get<EnrollmentDto[]>(`${this.apiUrl}`, { headers: this.getHeaders() }));
      console.log('EnrollmentService - Response received:', response);
      return response;
    } catch (error) {
      console.error('EnrollmentService - Error fetching enrollments:', error);
      throw error;
    }
  }

  async getEnrollmentById(id: number): Promise<EnrollmentDto> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('EnrollmentService - Making GET request to:', url);
      const response = await firstValueFrom(this.http.get<EnrollmentDto>(url, { headers: this.getHeaders() }));
      console.log('EnrollmentService - Response received:', response);
      return response;
    } catch (error) {
      console.error('EnrollmentService - Error fetching enrollment:', error);
      throw error;
    }
  }

  async getEnrollmentsByStudentId(studentId: number): Promise<EnrollmentDto[]> {
    try {
      const url = `${this.apiUrl}/student/${studentId}`;
      console.log('EnrollmentService - Making GET request to:', url);
      const response = await firstValueFrom(this.http.get<EnrollmentDto[]>(url, { headers: this.getHeaders() }));
      console.log('EnrollmentService - Response received:', response);
      return response;
    } catch (error) {
      console.error('EnrollmentService - Error fetching enrollments by student:', error);
      throw error;
    }
  }

  async getEnrollmentsByClassId(classId: number): Promise<EnrollmentDto[]> {
    try {
      const url = `${this.apiUrl}/class/${classId}`;
      console.log('EnrollmentService - Making GET request to:', url);
      const response = await firstValueFrom(this.http.get<EnrollmentDto[]>(url, { headers: this.getHeaders() }));
      console.log('EnrollmentService - Response received:', response);
      return response;
    } catch (error) {
      console.error('EnrollmentService - Error fetching enrollments by class:', error);
      throw error;
    }
  }

  async createEnrollment(enrollment: CreateEnrollmentDto): Promise<EnrollmentDto> {
    try {
      console.log('EnrollmentService - Creating enrollment:', enrollment);
      console.log('EnrollmentService - Making POST request to:', this.apiUrl);
      const response = await firstValueFrom(this.http.post<EnrollmentDto>(`${this.apiUrl}`, enrollment, { headers: this.getHeaders() }));
      console.log('EnrollmentService - Enrollment created successfully:', response);
      return response;
    } catch (error) {
      console.error('EnrollmentService - Error creating enrollment:', error);
      throw error;
    }
  }

  async updateEnrollment(enrollment: UpdateEnrollmentDto): Promise<EnrollmentDto> {
    try {
      const url = `${this.apiUrl}/${enrollment.id}`;
      console.log('EnrollmentService - Updating enrollment:', enrollment);
      console.log('EnrollmentService - Making PUT request to:', url);
      const response = await firstValueFrom(this.http.put<EnrollmentDto>(url, enrollment, { headers: this.getHeaders() }));
      console.log('EnrollmentService - Enrollment updated successfully:', response);
      return response;
    } catch (error) {
      console.error('EnrollmentService - Error updating enrollment:', error);
      throw error;
    }
  }

  async deleteEnrollment(id: number): Promise<void> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('EnrollmentService - Making DELETE request to:', url);
      await firstValueFrom(this.http.delete(url, { headers: this.getHeaders() }));
      console.log('EnrollmentService - Enrollment deleted successfully');
    } catch (error) {
      console.error('EnrollmentService - Error deleting enrollment:', error);
      throw error;
    }
  }
}