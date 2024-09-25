import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { roleService } from '../../service/role.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedSearchService } from '../../service/sharedSearch.service';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-after-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar-after-login.component.html',
  styleUrls: ['./navbar-after-login.component.scss'],
})
export class NavbarAfterLoginComponent implements OnInit, OnDestroy {
  @ViewChild('profileDropdown') profileDropdown!: ElementRef;

  isProfileDropdownOpen: boolean = false;
  private closeDropdownTimer: any;

  isMobileMenuOpen: boolean = false;
  isDropdownOpen: boolean = false;

  buttonLabel: string = '';
  searchQuery: string = '';
  searchType: string = '';
  searchTypePlaceholder: string = '';
  rolePrefix: string = 'freelancer'; // default to freelancer
  isFreelancer: boolean = true;
  jobsLink: string = 'my-proposals';

  private destroy$ = new Subscription();

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
    this.determineRole();

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
    this.destroy$.unsubscribe();
    if (this.closeDropdownTimer) {
      clearTimeout(this.closeDropdownTimer);
    }
  }

  setRolePrefix(): void {
    if (this.roleService.isRole('client')) {
      this.rolePrefix = 'client';
    } else if (this.roleService.isRole('freelancer')) {
      this.rolePrefix = 'freelancer';
    }
  }
  determineRole() {
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/client')) {
      this.rolePrefix = 'client';
      this.isFreelancer = false;
      this.jobsLink = 'list-my-jobs';
    } else {
      this.rolePrefix = 'freelancer';
      this.isFreelancer = true;
      this.jobsLink = 'my-proposals';
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
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.roleService.logout();
    this.router.navigate(['/login']);  
  }

  openProfileDropdown(): void {
    if (this.closeDropdownTimer) {
      clearTimeout(this.closeDropdownTimer);
    }
    this.isProfileDropdownOpen = true;
  }

  closeProfileDropdown(): void {
    this.closeDropdownTimer = setTimeout(() => {
      this.isProfileDropdownOpen = false;
    }, 200); // 200ms delay before closing
  }
  
}
