import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProfileDto, UpdateProfileDto } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/Profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ProfileDto> {
    return this.http.get<ProfileDto>(this.apiUrl);
  }

  updateProfile(updateData: UpdateProfileDto): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.apiUrl, updateData);
  }
}