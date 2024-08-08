// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Skill } from '../interfaces/skill';


// @Injectable({
//   providedIn: 'root',
// })
// export class jobManagementService {
//   private apiUrl = 'http://localhost:8000/job/'; // Replace with your API URL

//   constructor(private http: HttpClient) {}

//   // Method to add a new skill
//   addSkill(skill: Skill): Observable<Skill> {
//     return this.http.post<Skill>(`${this.apiUrl}addskill`, skill);
//   }
//   getSkills(
//     page: number,
//     itemsPerPage: number
//   ): Observable<{ skills: Skill[]; totalItems: number }> {
//     return this.http.get<{ skills: Skill[]; totalItems: number }>(
//       `${this.apiUrl}skills`,
//       {
//         params: {
//           page: page.toString(),
//           itemsPerPage: itemsPerPage.toString(),
//         },
//       }
//     );
//   }

//   getSkillsForCategory(): Observable<Skill[]> {
//     return this.http.get<Skill[]>(`${this.apiUrl}skills`);
//   }

//   deleteSkill(id: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}delete/${id}`);
//   }
//   updateSkill(id: string, skill: Skill): Observable<Skill> {
//     return this.http.post<Skill>(`${this.apiUrl}update/${id}`, skill);
//   }
// }
