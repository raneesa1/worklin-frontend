import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { roleService } from '../../shared/service/role.service';
import { IJobPost } from '../../pages/client-pages/job-management/interfaces/jobPost';
import { ISavedJobs } from '../types/interfaces/saveJob';
import { IJobOffer } from '../types/IJobOffer';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  private apiUrl = `${environment.backendUrl}/`;

  constructor(private http: HttpClient, roleService: roleService) {}

  getFreelancers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}user/getFreelancers`);
  }

  getSavedJobs(freelancerId: string): Observable<ISavedJobs[]> {
    return this.http.get<ISavedJobs[]>(
      `${this.apiUrl}user/getSavedJobs/${freelancerId}`
    );
  }

  getJobPosts(): Observable<IJobPost[]> {
    return this.http.get<IJobPost[]>(`${this.apiUrl}job/getJobPost`);
  }
  applyForJob(userId: string, jobPostId: string): Observable<any> {
    const payload = { userId, jobPostId };
    return this.http.post(`${this.apiUrl}user/apply`, payload);
  }
  updateInviteJob(
    userId: string,
    jobPostId: string,
    status: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}user/updateInviteJob`, {
      userId,
      jobPostId,
      status,
    });
  }

  toggleSavedJob(
    jobData: ISavedJobs,
    action: 'save' | 'unsave'
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}user/toggle-save-job`, {
      jobData,
      action,
    });
  }

  getInvites(freelancerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}job/job-invites/${freelancerId}`);
  }
  fetchOffers(freelancerId: string): Observable<{ jobOffer: IJobOffer[] }> {
    console.log(freelancerId, '------->>>>');
    return this.http.get<{ jobOffer: IJobOffer[] }>(
      `${this.apiUrl}job/getOffers/${freelancerId}`
    );
  }
  updateJobOfferStatus(
    jobOfferId: string,
    status: string
  ): Observable<{ jobOffer: IJobOffer }> {
    // Expecting a single job offer
    console.log(jobOfferId, status, '------->>>>');

    return this.http.patch<{ jobOffer: IJobOffer }>( // Expecting a single job offer in response
      `${this.apiUrl}job/update-status`,
      { jobOfferId, status } // Sending the jobOfferId and status in the request body
    );
  }
}
