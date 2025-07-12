import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Schedule, ScheduleDto, CreateScheduleDto, UpdateScheduleDto } from '../models/schedule.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('ScheduleService - Token retrieved:', token ? 'Token exists' : 'No token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  async getAllSchedules(): Promise<ScheduleDto[]> {
    try {
      const url = `${this.apiUrl}`;
      console.log('ScheduleService - Fetching all schedules from:', url);
      const response = await firstValueFrom(this.http.get<ScheduleDto[]>(url, { headers: this.getHeaders() }));
      console.log('ScheduleService - All schedules response:', response);
      return response;
    } catch (error) {
      console.error('ScheduleService - Error fetching schedules:', error);
      throw error;
    }
  }

  async getScheduleById(id: number): Promise<ScheduleDto> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('ScheduleService - Fetching schedule by ID from:', url);
      const response = await firstValueFrom(this.http.get<ScheduleDto>(url, { headers: this.getHeaders() }));
      console.log('ScheduleService - Schedule by ID response:', response);
      return response;
    } catch (error) {
      console.error('ScheduleService - Error fetching schedule:', error);
      throw error;
    }
  }

  async getSchedulesByClassId(classId: number): Promise<ScheduleDto[]> {
    try {
      const url = `${this.apiUrl}/class/${classId}`;
      console.log('ScheduleService - Fetching schedules by class ID from:', url);
      const response = await firstValueFrom(this.http.get<ScheduleDto[]>(url, { headers: this.getHeaders() }));
      console.log('ScheduleService - Schedules by class ID response:', response);
      return response;
    } catch (error) {
      console.error('ScheduleService - Error fetching schedules by class:', error);
      throw error;
    }
  }

  async getSchedulesByLecturerId(lecturerId: number): Promise<ScheduleDto[]> {
    try {
      const url = `${this.apiUrl}/lecturer/${lecturerId}`;
      console.log('ScheduleService - Fetching schedules by lecturer ID from:', url);
      const response = await firstValueFrom(this.http.get<ScheduleDto[]>(url, { headers: this.getHeaders() }));
      console.log('ScheduleService - Schedules by lecturer ID response:', response);
      return response;
    } catch (error) {
      console.error('ScheduleService - Error fetching schedules by lecturer:', error);
      throw error;
    }
  }

  async createSchedule(schedule: CreateScheduleDto): Promise<ScheduleDto> {
    try {
      const url = `${this.apiUrl}`;
      console.log('ScheduleService - Creating schedule at:', url, 'with data:', schedule);
      const response = await firstValueFrom(this.http.post<ScheduleDto>(url, schedule, { headers: this.getHeaders() }));
      console.log('ScheduleService - Create schedule response:', response);
      return response;
    } catch (error) {
      console.error('ScheduleService - Error creating schedule:', error);
      throw error;
    }
  }

  async updateSchedule(schedule: UpdateScheduleDto): Promise<ScheduleDto> {
    try {
      const url = `${this.apiUrl}/${schedule.id}`;
      console.log('ScheduleService - Updating schedule at:', url, 'with data:', schedule);
      const response = await firstValueFrom(this.http.put<ScheduleDto>(url, schedule, { headers: this.getHeaders() }));
      console.log('ScheduleService - Update schedule response:', response);
      return response;
    } catch (error) {
      console.error('ScheduleService - Error updating schedule:', error);
      throw error;
    }
  }

  async deleteSchedule(id: number): Promise<void> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('ScheduleService - Deleting schedule at:', url);
      await firstValueFrom(this.http.delete(url, { headers: this.getHeaders() }));
      console.log('ScheduleService - Schedule deleted successfully');
    } catch (error) {
      console.error('ScheduleService - Error deleting schedule:', error);
      throw error;
    }
  }
}