import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { BrowseService } from '../../../shared/service/browse.service';
import { FreelancerEntity } from '../../../shared/types/FreelancerEntity';
import { roleService } from '../../../shared/service/role.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-discover-freelancers',
  standalone: true,
  imports: [CommonModule, NavbarAfterLoginComponent],
  templateUrl: './discover-freelancers.component.html',
  styleUrl: './discover-freelancers.component.scss',
})
export class DiscoverFreelancersComponent implements OnInit, OnDestroy {
  freelancers: FreelancerEntity[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private BrowseService: BrowseService,
    private router: Router,
    private roleService: roleService
  ) {}

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  ngOnInit(): void {
    this.fetchFreelancers();
  }

  onLogout() {
    this.roleService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
  fetchFreelancers(): void {
    this.BrowseService.getFreelancers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: FreelancerEntity[]) => {
          this.freelancers = data;
          console.log(this.freelancers, 'ergbegjer');
        },
        (error) => {
          console.error('Error fetching freelancers:', error);
        }
      );
  }
  viewFreelancerProfile(freelancerId: string | undefined): void {
    if (freelancerId) {
      console.log(freelancerId, 'consoling the freelancer id');
      this.router.navigate(['browse/freelancer', freelancerId]);
    } else {
      console.error('Freelancer ID is undefined');
    }
  }
  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  }
  ngOnDestroy(): void {
    // Emit a value to signal that the component is being destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
}
