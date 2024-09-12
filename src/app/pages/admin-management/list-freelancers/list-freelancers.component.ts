import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowseService } from '../../../shared/service/browse.service';
import { FreelancerEntity } from '../../../shared/types/FreelancerEntity';
import { AdminNavbarComponent } from '../../../components/admin-navbar/admin-navbar.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-freelancers',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './list-freelancers.component.html',
  styleUrl: './list-freelancers.component.scss',
})
export class ListFreelancersComponent implements OnInit, OnDestroy {
  freelancers: FreelancerEntity[] = [];
  totalFreelancers = 0;
  private destroy$ = new Subject<void>();
  constructor(private browseService: BrowseService) {}

  ngOnInit(): void {
    this.browseService
      .getFreelancers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FreelancerEntity[]) => {
        this.freelancers = data;
        console.log(this.freelancers);
        this.totalFreelancers = data.length;
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
