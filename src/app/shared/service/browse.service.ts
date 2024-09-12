import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { roleService } from '../../shared/service/role.service';
import { IJobPost } from '../../pages/client-pages/job-management/interfaces/jobPost';
import { ISavedJobs } from '../types/interfaces/saveJob';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  private apiUrl = 'http://localhost:8000/';

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

  // removeJobFromFavorite(jobId: string, freelancerId: string) {
  //   const payload = {
  //     jobId,
  //     freelancerId,
  //   };
  //   return this.http.post(`${this.apiUrl}/removeJob`, payload);
  // }

  getInvites(freelancerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}job/job-invites/${freelancerId}`);
  }
}
