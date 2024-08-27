import { Component } from '@angular/core';
import { FreelancerEntity } from '../../browse/types/FreelancerEntity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowseService } from '../../browse/service/browse.service';

@Component({
  selector: 'app-list-freelancers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-freelancers.component.html',
  styleUrl: './list-freelancers.component.scss',
})
export class ListFreelancersComponent {
  freelancers: FreelancerEntity[] = [];
  totalFreelancers = 0;

  constructor(private browseService: BrowseService) {}

  ngOnInit(): void {
    this.browseService
      .getFreelancers()
      .subscribe((data: FreelancerEntity[]) => {
        this.freelancers = data;
        console.log(this.freelancers)
        this.totalFreelancers = data.length;
      });
  }
}
