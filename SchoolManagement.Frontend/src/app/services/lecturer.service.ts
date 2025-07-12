import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Lecturer, LecturerDto, CreateLecturerDto, UpdateLecturerDto } from '../models/lecturer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LecturerService {
  private apiUrl = `${environment.apiUrl}/lecturers`;

  constructor(private http: HttpClient) { }

  async getAllLecturers(): Promise<LecturerDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<LecturerDto[]>(`${this.apiUrl}`));
      return response;
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      throw error;
    }
  }

  async getLecturerById(id: number): Promise<LecturerDto> {
    try {
      const response = await firstValueFrom(this.http.get<LecturerDto>(`${this.apiUrl}/${id}`));
      return response;
    } catch (error) {
      console.error('Error fetching lecturer:', error);
      throw error;
    }
  }

  async createLecturer(lecturer: CreateLecturerDto): Promise<LecturerDto> {
    try {
      const response = await firstValueFrom(this.http.post<LecturerDto>(`${this.apiUrl}`, lecturer));
      return response;
    } catch (error) {
      console.error('Error creating lecturer:', error);
      throw error;
    }
  }

  async updateLecturer(lecturer: UpdateLecturerDto): Promise<LecturerDto> {
    try {
      const response = await firstValueFrom(this.http.put<LecturerDto>(`${this.apiUrl}/${lecturer.id}`, lecturer));
      return response;
    } catch (error) {
      console.error('Error updating lecturer:', error);
      throw error;
    }
  }

  async deleteLecturer(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error('Error deleting lecturer:', error);
      throw error;
    }
  }
}