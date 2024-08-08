import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../../job-management/interfaces/skill';
import { Category } from '../types/category.model';



@Injectable({
  providedIn: 'root',
})
export class adminManagementService {
  private apiUrl = 'http://localhost:8000/job/'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Method to add a new skill
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

  getSkillsForCategory(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}skills`);
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}delete/${id}`);
  }
  updateSkill(id: string, skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiUrl}update/${id}`, skill);
  }
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}addcategory`, category);
  }
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}getCategory`);
  }
  getSkillsBtCategoryId(categoryId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(
      `${this.apiUrl}categories/${categoryId}/skills`
    );
  }
  submitUserSkills(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}submit-skills-category`, payload); // Update with your API endpoint
  }
}
