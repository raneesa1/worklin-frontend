import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Experience } from '../interfaces/experience';
import { BioData } from '../interfaces/bioData';
import { roleService } from '../../../role.service';
import { Address } from '../interfaces/address';
import { Education } from '../interfaces/education';
import { FreelancerEntity } from '../../browse/types/FreelancerEntity';

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
  sendRateBioLanguage(data: BioData): Observable<any> {
    return this.http.post(`${this.baseUrl}/setBioData`, data);
  }
  sendLocationData(data: {
    freelancerId: string;
    locationData: Address;
    imageUrl: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateLocation`, data);
  }
  addEducation(data: Education): Observable<any> {
    return this.http.post(`${this.baseUrl}/addEducation`, data);
  }
  getEducation(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getEducation/${userId}`);
  }
  deleteEducation(educationId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteEducation/${educationId}`);
  }
  saveRole(freelancerId: string, role: string): Observable<any> {
    const payload = { freelancerId, role };
    return this.http.post(`${this.baseUrl}/saveRole`, payload);
  }
  updateExperience(experienceId: string, data: Experience): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/updateExperience/${experienceId}`,
      data
    );
  }
  updateEducation(educationId: string, data: Education): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/updateEducation/${educationId}`,
      data
    );
  }

  submitUserSkills(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit-skills-category`, payload); // Update with your API endpoint
  }
  editProfile(freelancer:FreelancerEntity):Observable<any>{
    return this.http.patch(`${this.baseUrl}/editProfileFromPreview`,freelancer)
  }
}
