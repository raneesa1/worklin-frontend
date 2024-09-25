import { Component, OnDestroy, OnInit } from '@angular/core';
import { FreelancerEntity } from '../../../shared/types/FreelancerEntity';
import { Subject, takeUntil } from 'rxjs';
import { BrowseService } from '../../../shared/service/browse.service';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar.component';
import { adminManagementService } from '../service/admin-management.service';
import { clientEntity } from '../../../shared/types/ClientEntity';
import { FormsModule } from '@angular/forms';

interface ColumnDef {
  key: string;
  header: string;
}

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent, FormsModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss',
})
export class ListUsersComponent implements OnInit, OnDestroy {
  freelancers: FreelancerEntity[] = [];
  clients: clientEntity[] = [];
  displayedUsers: any[] = [];
  filteredUsers: any[] = [];
  columns: ColumnDef[] = [];
  totalUsers = 0;
  userType: 'freelancers' | 'clients' = 'freelancers';
  filterOptions = ['All', 'Active', 'Blocked'];
  currentFilter = 'All';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  private destroy$ = new Subject<void>();

  constructor(
    private browseService: BrowseService,
    private adminService: adminManagementService
  ) {}

  ngOnInit(): void {
    this.getFreelancers();
    this.getClients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFreelancers() {
    this.browseService
      .getFreelancers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FreelancerEntity[]) => {
        this.freelancers = data;
        if (this.userType === 'freelancers') {
          this.updateDisplayedUsers();
        }
      });
  }

  getClients() {
    this.adminService.getAllClients().subscribe((data: clientEntity[]) => {
      this.clients = data;
      if (this.userType === 'clients') {
        this.updateDisplayedUsers();
      }
    });
  }

  toggleUserType(type: 'freelancers' | 'clients') {
    this.userType = type;
    this.updateDisplayedUsers();
    this.resetFilters();
  }

  updateDisplayedUsers() {
    this.displayedUsers =
      this.userType === 'freelancers' ? this.freelancers : this.clients;
    this.totalUsers = this.displayedUsers.length;
    this.updateColumns();
    this.applyFilters();
  }

  updateColumns() {
    if (this.userType === 'freelancers') {
      this.columns = [
        { key: 'firstName', header: 'First Name' },
        { key: 'email', header: 'Email' },
        { key: 'dob', header: 'Date of Birth' },
        { key: 'isBlocked', header: 'Status' },
        { key: 'country', header: 'Country' },
      ];
    } else {
      this.columns = [
        { key: 'firstName', header: 'Company Name' },
        { key: 'email', header: 'Email' },
        { key: 'isBlocked', header: 'Status' },
        { key: 'country', header: 'Country' },
      ];
    }
  }

  applyFilters() {
    this.filteredUsers = this.displayedUsers.filter((user) => {
      const matchesFilter =
        this.currentFilter === 'All' ||
        (this.currentFilter === 'Active' && !user.isBlocked) ||
        (this.currentFilter === 'Blocked' && user.isBlocked);

      const matchesSearch =
        this.searchTerm === '' ||
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );

      return matchesFilter && matchesSearch;
    });
    this.currentPage = 1;
  }

  resetFilters() {
    this.currentFilter = 'All';
    this.searchTerm = '';
    this.applyFilters();
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  get hasUsers(): boolean {
    return this.filteredUsers.length > 0;
  }

  get emptyStateMessage(): string {
    if (this.searchTerm || this.currentFilter !== 'All') {
      return `No ${this.userType} found matching the current filters.`;
    }
    return `No ${this.userType} available.`;
  }
}
