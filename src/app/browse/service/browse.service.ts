import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IJobPost } from '../../job-management/interfaces/jobPost';
import { roleService } from '../../../role.service';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  private apiUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient, roleService: roleService) {}

  getFreelancers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}user/getFreelancers`);
  }
  getJobPosts(): Observable<IJobPost[]> {
    return this.http.get<IJobPost[]>(`${this.apiUrl}job/getJobPost`);
  }
  applyForJob(userId: string, jobPostId: string): Observable<any> {
    const payload = { userId, jobPostId };
    return this.http.post(`${this.apiUrl}user/apply`, payload);
  }

  saveJobToFavorite(job: IJobPost, freelancerId: string) {
    const payload = {
      job,
      freelancerId,
    };
    return this.http.post(`${this.apiUrl}/saveJob`, payload);
  }

  removeJobFromFavorite(jobId: string, freelancerId: string) {
    const payload = {
      jobId,
      freelancerId,
    };
    return this.http.post(`${this.apiUrl}/removeJob`, payload);
  }

  getSavedJobs(freelancerId: string): Observable<IJobPost[]> {
    return this.http.get<IJobPost[]>(
      `${this.apiUrl}user/getSavedJobs/${freelancerId}`
    );
  }
}
