import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { roleService } from './role.service';
import { Experience } from '../types/interfaces/experience';
import { BioData } from '../types/interfaces/bioData';
import { Address } from '../types/interfaces/address';
import { Education } from '../types/interfaces/education';
import { FreelancerEntity } from '../types/FreelancerEntity';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileManagementService {
  private baseUrl = `${environment.backendUrl}/user`;

  constructor(private http: HttpClient, private roleService: roleService) {}

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
  editProfile(freelancer: FreelancerEntity): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/editProfileFromPreview`,
      freelancer
    );
  }
  getFreelancerProfile(freelancerId: string): Observable<FreelancerEntity> {
    return this.http.get<FreelancerEntity>(
      `${this.baseUrl}/freelancer/${freelancerId}`
    );
  }
}
