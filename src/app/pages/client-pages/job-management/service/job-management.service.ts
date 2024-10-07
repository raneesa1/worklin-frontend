import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../interfaces/skill';
import { IInviteFreelancer, IJobPost } from '../interfaces/jobPost';
import { FreelancerEntity } from '../../../../shared/types/FreelancerEntity';
import { IJobOffer } from '../../../../shared/types/IJobOffer';
import { environment } from '../../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class jobManagementService {
  private apiUrl = `${environment.backendUrl}/job/`; // Replace with your API URL
  private UserApiUrl = `${environment.backendUrl}/user/`; // Replace with your API URL

  constructor(private http: HttpClient) {}

  addSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiUrl}addskill`, skill);
  }
  getSkills(
    page: number,
    itemsPerPage: number
  ): Observable<{ skills: Skill[]; totalItems: number }> {
    return this.http.get<{ skills: Skill[]; totalItems: number }>(
      `${this.apiUrl}skills`,
      {
        params: {
          page: page.toString(),
          itemsPerPage: itemsPerPage.toString(),
        },
      }
    );
  }
  submitJobPost(jobPost: IJobPost): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}jobPost`, jobPost);
  }
  sendJobPostData(jobPost: IJobPost): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}editPost`, jobPost);
  }
  getJobPostsByUserId(userId: string): Observable<IJobPost[]> {
    return this.http.get<IJobPost[]>(`${this.apiUrl}getJobPostById/${userId}`, {
      // userId is sent as a query parameter
    });
  }
  getJobPostById(jobPostId: string): Observable<IJobPost> {
    return this.http.get<IJobPost>(`${this.apiUrl}getJobPost/${jobPostId}`, {});
  }
  getFreelancersBySkills(skills: string[]): Observable<FreelancerEntity[]> {
    return this.http.post<FreelancerEntity[]>(
      `${environment.backendUrl}/user/freelancersBySkills`,
      {
        skills,
      }
    );
  }
  sendInvitation(
    invitationData: IInviteFreelancer
  ): Observable<IInviteFreelancer> {
    return this.http.post<IInviteFreelancer>(
      `${this.apiUrl}invite-freelancer`,
      invitationData
    );
  }
  getInvitedFreelancers(jobId: string): Observable<FreelancerEntity[]> {
    return this.http.get<FreelancerEntity[]>(
      `${this.UserApiUrl}/getInvitedFreelancer/${jobId}`
    );
  }
  createJobOffer(jobOfferData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}createJobOffer`, jobOfferData);
  }
  fetchClientOffers(clientId: string): Observable<{ jobOffer: IJobOffer[] }> {
    console.log(clientId, '------->>>>');
    return this.http.get<{ jobOffer: IJobOffer[] }>(
      `${this.apiUrl}getClientOffers/${clientId}`
    );
  }
  deleteJobPost(jobId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/deleteJobPost`, { jobId });
  }
}
