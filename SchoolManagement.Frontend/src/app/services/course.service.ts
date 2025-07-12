import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Course, CourseDto, CreateCourseDto, UpdateCourseDto } from '../models/course.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) { }

  async getAllCourses(): Promise<CourseDto[]> {
    try {
      const response = await firstValueFrom(this.http.get<CourseDto[]>(`${this.apiUrl}`));
      return response;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  async getCourseById(id: number): Promise<CourseDto> {
    try {
      const response = await firstValueFrom(this.http.get<CourseDto>(`${this.apiUrl}/${id}`));
      return response;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  async createCourse(course: CreateCourseDto): Promise<CourseDto> {
    try {
      const response = await firstValueFrom(this.http.post<CourseDto>(`${this.apiUrl}`, course));
      return response;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(course: UpdateCourseDto): Promise<CourseDto> {
    try {
      const response = await firstValueFrom(this.http.put<CourseDto>(`${this.apiUrl}/${course.id}`, course));
      return response;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
}