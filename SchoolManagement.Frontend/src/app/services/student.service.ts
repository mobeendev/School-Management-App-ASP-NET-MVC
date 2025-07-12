import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Student, StudentDto, CreateStudentDto, UpdateStudentDto } from '../models/student.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('StudentService - Token retrieved:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    console.log('StudentService - Headers created with Authorization:', token ? 'Bearer token added' : 'No Authorization header');
    
    return headers;
  }

  async getAllStudents(): Promise<StudentDto[]> {
    try {
      console.log('StudentService - Making GET request to:', this.apiUrl);
      const response = await firstValueFrom(this.http.get<StudentDto[]>(`${this.apiUrl}`, { headers: this.getHeaders() }));
      console.log('StudentService - Response received:', response);
      return response;
    } catch (error) {
      console.error('StudentService - Error fetching students:', error);
      throw error;
    }
  }

  async getStudentById(id: number): Promise<StudentDto> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('StudentService - Making GET request to:', url);
      const response = await firstValueFrom(this.http.get<StudentDto>(url, { headers: this.getHeaders() }));
      console.log('StudentService - Response received:', response);
      return response;
    } catch (error) {
      console.error('StudentService - Error fetching student:', error);
      throw error;
    }
  }

  async createStudent(student: CreateStudentDto): Promise<StudentDto> {
    try {
      console.log('StudentService - Creating student:', student);
      console.log('StudentService - Making POST request to:', this.apiUrl);
      const response = await firstValueFrom(this.http.post<StudentDto>(`${this.apiUrl}`, student, { headers: this.getHeaders() }));
      console.log('StudentService - Student created successfully:', response);
      return response;
    } catch (error) {
      console.error('StudentService - Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(student: UpdateStudentDto): Promise<StudentDto> {
    try {
      const url = `${this.apiUrl}/${student.id}`;
      console.log('StudentService - Updating student:', student);
      console.log('StudentService - Making PUT request to:', url);
      const response = await firstValueFrom(this.http.put<StudentDto>(url, student, { headers: this.getHeaders() }));
      console.log('StudentService - Student updated successfully:', response);
      return response;
    } catch (error) {
      console.error('StudentService - Error updating student:', error);
      throw error;
    }
  }

  async deleteStudent(id: number): Promise<void> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('StudentService - Making DELETE request to:', url);
      await firstValueFrom(this.http.delete(url, { headers: this.getHeaders() }));
      console.log('StudentService - Student deleted successfully');
    } catch (error) {
      console.error('StudentService - Error deleting student:', error);
      throw error;
    }
  }
}