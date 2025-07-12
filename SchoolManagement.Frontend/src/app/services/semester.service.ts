import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Semester, SemesterDto, CreateSemesterDto, UpdateSemesterDto } from '../models/semester.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {
  private apiUrl = `${environment.apiUrl}/semesters`;

  constructor(private http: HttpClient) { }

  async getAllSemesters(): Promise<SemesterDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<SemesterDto[]>(`${this.apiUrl}`));
      return response;
    } catch (error) {
      console.error('Error fetching semesters:', error);
      throw error;
    }
  }

  async getSemesterById(id: number): Promise<SemesterDto> {
    try {
      const response = await firstValueFrom(this.http.get<SemesterDto>(`${this.apiUrl}/${id}`));
      return response;
    } catch (error) {
      console.error('Error fetching semester:', error);
      throw error;
    }
  }

  async createSemester(semester: CreateSemesterDto): Promise<SemesterDto> {
    try {
      const response = await firstValueFrom(this.http.post<SemesterDto>(`${this.apiUrl}`, semester));
      return response;
    } catch (error) {
      console.error('Error creating semester:', error);
      throw error;
    }
  }

  async updateSemester(semester: UpdateSemesterDto): Promise<SemesterDto> {
    try {
      const response = await firstValueFrom(this.http.put<SemesterDto>(`${this.apiUrl}/${semester.id}`, semester));
      return response;
    } catch (error) {
      console.error('Error updating semester:', error);
      throw error;
    }
  }

  async deleteSemester(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error('Error deleting semester:', error);
      throw error;
    }
  }
}