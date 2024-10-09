import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category, Skill } from '../types/category.model';
import { clientEntity } from '../../../shared/types/ClientEntity';
import { AdminDashboardData } from '../types/AdminDashboardData';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class adminManagementService {
  private apiUrl = `${environment.backendUrl}/job/`; // Replace with your API URL
  private userUrl = `${environment.backendUrl}/user/`; // Replace with your API URL

  constructor(private http: HttpClient) {}
  private skillsSubject = new BehaviorSubject<Skill[]>([]);
  skills$ = this.skillsSubject.asObservable();
  addSkill(skill: Skill): Observable<{ message: string; skill: Skill }> {
    return this.http.post<{ message: string; skill: Skill }>(
      `${this.apiUrl}addskill`,
      skill
    );
  }
  getSkills(
    page: number,
    itemsPerPage: number
  ): Observable<{
    skills: Skill[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
  }> {
    return this.http.get<{
      skills: Skill[];
      totalItems: number;
      currentPage: number;
      totalPages: number;
    }>(`${this.apiUrl}skills`, {
      params: {
        page: page.toString(),
        limit: itemsPerPage.toString(),
      },
    });
  }

  getSkillsForCategory(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}skills`, {
      params: {
        page: '0',
        itemsPerPage: '32',
      },
    });
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}deleteSkill/${id}`);
  }
  updateSkill(id: string, skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiUrl}update/${id}`, skill);
  }
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}addcategory`, category);
  }
  getCategories(
    page: number,
    itemsPerPage: number,
    searchQuery: string = ''
  ): Observable<any> {
    return this.http.get(`${this.apiUrl}getCategory`, {
      params: {
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
      },
    });
  }
  getAllCategories(): Observable<{ message: string; categories: Category[] }> {
    return this.http.get<{ message: string; categories: Category[] }>(
      `${this.apiUrl}get-all-category`
    );
  }

  getSkillsBtCategoryId(categoryId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(
      `${this.apiUrl}categories/${categoryId}/skills`
    );
  }
  // submitUserSkills(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}submit-skills-category`, payload); // Update with your API endpoint
  // }
  deleteCategory(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}deleteCategory/${categoryId}`);
  }

  getAllClients(): Observable<clientEntity[]> {
    return this.http.get<clientEntity[]>(`${this.userUrl}getAllClient`);
  }
  getTotalJobPost(): Observable<{ NumberOfJobPosts: number }> {
    return this.http.get<{ NumberOfJobPosts: number }>(
      `${this.apiUrl}getTotalNumberOfJobPost`
    );
  }
  getAdminDashboardData(timeRange: string): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(
      `${this.userUrl}getAdminDashboardData/${timeRange}`
    );
  }
}
