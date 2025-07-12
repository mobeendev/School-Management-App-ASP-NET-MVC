import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Enrollment, EnrollmentDto, CreateEnrollmentDto, UpdateEnrollmentDto } from '../models/enrollment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = `${environment.apiUrl}/enrollments`;

  constructor(private http: HttpClient) { }

  async getAllEnrollments(): Promise<EnrollmentDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<EnrollmentDto[]>(`${this.apiUrl}`));
      return response;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  }

  async getEnrollmentById(id: number): Promise<EnrollmentDto> {
    try {
      const response = await firstValueFrom(this.http.get<EnrollmentDto>(`${this.apiUrl}/${id}`));
      return response;
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      throw error;
    }
  }

  async getEnrollmentsByStudentId(studentId: number): Promise<EnrollmentDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<EnrollmentDto[]>(`${this.apiUrl}/student/${studentId}`));
      return response;
    } catch (error) {
      console.error('Error fetching enrollments by student:', error);
      throw error;
    }
  }

  async getEnrollmentsByClassId(classId: number): Promise<EnrollmentDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<EnrollmentDto[]>(`${this.apiUrl}/class/${classId}`));
      return response;
    } catch (error) {
      console.error('Error fetching enrollments by class:', error);
      throw error;
    }
  }

  async createEnrollment(enrollment: CreateEnrollmentDto): Promise<EnrollmentDto> {
    try {
      const response = await firstValueFrom(this.http.post<EnrollmentDto>(`${this.apiUrl}`, enrollment));
      return response;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  }

  async updateEnrollment(enrollment: UpdateEnrollmentDto): Promise<EnrollmentDto> {
    try {
      const response = await firstValueFrom(this.http.put<EnrollmentDto>(`${this.apiUrl}/${enrollment.id}`, enrollment));
      return response;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      throw error;
    }
  }

  async deleteEnrollment(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      throw error;
    }
  }
}