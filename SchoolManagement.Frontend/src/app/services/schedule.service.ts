import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Schedule, ScheduleDto, CreateScheduleDto, UpdateScheduleDto } from '../models/schedule.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient) { }

  async getAllSchedules(): Promise<ScheduleDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<ScheduleDto[]>(`${this.apiUrl}`));
      return response;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  }

  async getScheduleById(id: number): Promise<ScheduleDto> {
    try {
      const response = await firstValueFrom(this.http.get<ScheduleDto>(`${this.apiUrl}/${id}`));
      return response;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  }

  async getSchedulesByClassId(classId: number): Promise<ScheduleDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<ScheduleDto[]>(`${this.apiUrl}/class/${classId}`));
      return response;
    } catch (error) {
      console.error('Error fetching schedules by class:', error);
      throw error;
    }
  }

  async getSchedulesByLecturerId(lecturerId: number): Promise<ScheduleDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<ScheduleDto[]>(`${this.apiUrl}/lecturer/${lecturerId}`));
      return response;
    } catch (error) {
      console.error('Error fetching schedules by lecturer:', error);
      throw error;
    }
  }

  async createSchedule(schedule: CreateScheduleDto): Promise<ScheduleDto> {
    try {
      const response = await firstValueFrom(this.http.post<ScheduleDto>(`${this.apiUrl}`, schedule));
      return response;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }

  async updateSchedule(schedule: UpdateScheduleDto): Promise<ScheduleDto> {
    try {
      const response = await firstValueFrom(this.http.put<ScheduleDto>(`${this.apiUrl}/${schedule.id}`, schedule));
      return response;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  }

  async deleteSchedule(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }
}