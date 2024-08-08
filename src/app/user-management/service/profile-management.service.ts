import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Experience } from '../interfaces/experience';

@Injectable({
  providedIn: 'root',
})
export class ProfileManagementService {
  private baseUrl = 'http://localhost:8000/user';

  constructor(private http: HttpClient) {}

  uploadResume(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/resume`, formData);
  }
  sendProfileData(data: { goal: string; experience: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/profile-data`, data);
  }
  sendExperienceData(data: Experience): Observable<any> {
    return this.http.post(`${this.baseUrl}/addExperience`, data);
  }
  getExperience(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getExperience/${userId}`);
  }
  deleteExperience(experienceId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteExperience/${experienceId}`);
  }
}
