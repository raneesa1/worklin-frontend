import { Component, OnInit } from '@angular/core';
import { FreelancerEntity } from '../types/FreelancerEntity';
import { BrowseService } from '../service/browse.service';
import { CommonModule } from '@angular/common';
import { NavbarAfterLoginComponent } from '../../shared/components/navbar-after-login/navbar-after-login.component';

@Component({
  selector: 'app-discover-freelancers',
  standalone: true,
  imports: [CommonModule,NavbarAfterLoginComponent],
  templateUrl: './discover-freelancers.component.html',
  styleUrl: './discover-freelancers.component.scss',
})
export class DiscoverFreelancersComponent implements OnInit {
  freelancers: FreelancerEntity[] = [];

  constructor(private BrowseService: BrowseService) {}

  ngOnInit(): void {
    this.fetchFreelancers();
  }

  fetchFreelancers(): void {
    this.BrowseService.getFreelancers().subscribe(
      (data: FreelancerEntity[]) => {
        this.freelancers = data;
        console.log(this.freelancers,'ergbegjer')
      },
      (error) => {
        console.error('Error fetching freelancers:', error);
      }
    );
  }
}
