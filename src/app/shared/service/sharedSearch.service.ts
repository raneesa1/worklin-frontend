import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SharedSearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  private searchTypeSubject = new BehaviorSubject<string>('');

  searchQuery$ = this.searchQuerySubject.asObservable();
  searchType$ = this.searchTypeSubject.asObservable();

  constructor(private router: Router) {}

  updateSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  updateSearchType(type: string) {
    this.searchTypeSubject.next(type);
  }

  performSearch() {
    const query = this.searchQuerySubject.getValue();
    const type = this.searchTypeSubject.getValue();

    if (query.trim()) {
      let route: string;
      if (type === 'jobs') {
        route = '/freelancer/search';
      } else if (type === 'talent') {
        route = '/client/search';
      } else {
        route = '/search';
      }

      this.router.navigate([route], {
        queryParams: { q: query, type: type },
      });
    }
  }
}
