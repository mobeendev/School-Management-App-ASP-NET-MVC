import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Student, StudentDto, CreateStudentDto, UpdateStudentDto } from '../models/student.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) { }

  async getAllStudents(): Promise<StudentDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<StudentDto[]>(`${this.apiUrl}`));
      return response;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async getStudentById(id: number): Promise<StudentDto> {
    try {
      const response = await firstValueFrom(this.http.get<StudentDto>(`${this.apiUrl}/${id}`));
      return response;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  async createStudent(student: CreateStudentDto): Promise<StudentDto> {
    try {
      const response = await firstValueFrom(this.http.post<StudentDto>(`${this.apiUrl}`, student));
      return response;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(student: UpdateStudentDto): Promise<StudentDto> {
    try {
      const response = await firstValueFrom(this.http.put<StudentDto>(`${this.apiUrl}/${student.id}`, student));
      return response;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  async deleteStudent(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
}