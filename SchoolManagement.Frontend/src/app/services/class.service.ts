import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Class, ClassDto, CreateClassDto, UpdateClassDto } from '../models/class.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient) { }

  async getAllClasses(): Promise<ClassDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<ClassDto[]>(`${this.apiUrl}`));
      return response;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  async getClassById(id: number): Promise<ClassDto> {
    try {
      const response = await firstValueFrom(this.http.get<ClassDto>(`${this.apiUrl}/${id}`));
      return response;
    } catch (error) {
      console.error('Error fetching class:', error);
      throw error;
    }
  }

  async createClass(classData: CreateClassDto): Promise<ClassDto> {
    try {
      const response = await firstValueFrom(this.http.post<ClassDto>(`${this.apiUrl}`, classData));
      return response;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  async updateClass(classData: UpdateClassDto): Promise<ClassDto> {
    try {
      const response = await firstValueFrom(this.http.put<ClassDto>(`${this.apiUrl}/${classData.id}`, classData));
      return response;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  async deleteClass(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }
}