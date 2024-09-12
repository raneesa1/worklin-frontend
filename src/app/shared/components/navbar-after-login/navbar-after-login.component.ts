import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { roleService } from '../../service/role.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedSearchService } from '../../service/sharedSearch.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-after-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar-after-login.component.html',
  styleUrls: ['./navbar-after-login.component.scss'],
})
export class NavbarAfterLoginComponent implements OnInit, OnDestroy {
  isMobileMenuOpen: boolean = false;
  isDropdownOpen: boolean = false;
  rolePrefix: string = '';
  buttonLabel: string = '';
  searchQuery: string = '';
  searchType: string = '';
  searchTypePlaceholder: string = '';

  private searchQuerySubscription: Subscription = new Subscription();
  private searchTypeSubscription: Subscription = new Subscription();

  constructor(
    private roleService: roleService,
    private router: Router,
    private sharedSearchService: SharedSearchService
  ) {
    this.setRolePrefix();
  }

  ngOnInit(): void {
    this.setRolePrefix();
    this.setButtonLabel();
    this.setInitialSearchType();

    this.searchQuerySubscription =
      this.sharedSearchService.searchQuery$.subscribe((query) => {
        this.searchQuery = query;
      });

    this.searchTypeSubscription =
      this.sharedSearchService.searchType$.subscribe((type) => {
        this.searchType = type;
        this.updateButtonLabel();
      });
  }

  ngOnDestroy(): void {
    this.searchQuerySubscription.unsubscribe();
    this.searchTypeSubscription.unsubscribe();
  }

  setRolePrefix(): void {
    if (this.roleService.isRole('client')) {
      this.rolePrefix = 'client';
    } else if (this.roleService.isRole('freelancer')) {
      this.rolePrefix = 'freelancer';
    }
  }

  setButtonLabel(): void {
    this.updateButtonLabel();
  }

  updateButtonLabel(): void {
    this.buttonLabel = this.searchType === 'talent' ? 'Talents' : 'Jobs';
  }

  setInitialSearchType(): void {
    this.searchType = this.roleService.isRole('client') ? 'talent' : 'jobs';
    this.sharedSearchService.updateSearchType(this.searchType);
  }

  toggleSearchType(): void {
    this.searchType = this.searchType === 'talent' ? 'jobs' : 'talent';
    this.sharedSearchService.updateSearchType(this.searchType);
    this.updateButtonLabel();
  }

  onSearchQueryChange(): void {
    this.sharedSearchService.updateSearchQuery(this.searchQuery);
  }

  onSearch(): void {
    this.sharedSearchService.performSearch();

    // Determine the appropriate route based on the user's role
    let route: string;
    if (this.roleService.isRole('freelancer')) {
      route = '/freelancer/search';
    } else if (this.roleService.isRole('client')) {
      route = '/client/talent';
    } else {
      // Default route if role is not recognized
      route = '/search';
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
