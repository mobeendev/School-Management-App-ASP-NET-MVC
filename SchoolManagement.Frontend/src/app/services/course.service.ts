import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Course, CourseDto, CreateCourseDto, UpdateCourseDto } from '../models/course.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('CourseService - Token retrieved:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    console.log('CourseService - Headers created with Authorization:', token ? 'Bearer token added' : 'No Authorization header');
    
    return headers;
  }

  async getAllCourses(): Promise<CourseDto[]> {
    try {
      console.log('CourseService - Making GET request to:', this.apiUrl);
      const response = await firstValueFrom(this.http.get<CourseDto[]>(`${this.apiUrl}`, { headers: this.getHeaders() }));
      console.log('CourseService - Response received:', response);
      return response;
    } catch (error) {
      console.error('CourseService - Error fetching courses:', error);
      throw error;
    }
  }

  async getCourseById(id: number): Promise<CourseDto> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('CourseService - Making GET request to:', url);
      const response = await firstValueFrom(this.http.get<CourseDto>(url, { headers: this.getHeaders() }));
      console.log('CourseService - Response received:', response);
      return response;
    } catch (error) {
      console.error('CourseService - Error fetching course:', error);
      throw error;
    }
  }

  async createCourse(course: CreateCourseDto): Promise<CourseDto> {
    try {
      console.log('CourseService - Creating course:', course);
      console.log('CourseService - Making POST request to:', this.apiUrl);
      const response = await firstValueFrom(this.http.post<CourseDto>(`${this.apiUrl}`, course, { headers: this.getHeaders() }));
      console.log('CourseService - Course created successfully:', response);
      return response;
    } catch (error) {
      console.error('CourseService - Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(course: UpdateCourseDto): Promise<CourseDto> {
    try {
      const url = `${this.apiUrl}/${course.id}`;
      console.log('CourseService - Updating course:', course);
      console.log('CourseService - Making PUT request to:', url);
      const response = await firstValueFrom(this.http.put<CourseDto>(url, course, { headers: this.getHeaders() }));
      console.log('CourseService - Course updated successfully:', response);
      return response;
    } catch (error) {
      console.error('CourseService - Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(id: number): Promise<void> {
    try {
      const url = `${this.apiUrl}/${id}`;
      console.log('CourseService - Making DELETE request to:', url);
      await firstValueFrom(this.http.delete(url, { headers: this.getHeaders() }));
      console.log('CourseService - Course deleted successfully');
    } catch (error) {
      console.error('CourseService - Error deleting course:', error);
      throw error;
    }
  }
}