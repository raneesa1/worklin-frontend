import { Component, OnInit, Renderer2 } from '@angular/core';
import { BrowseService } from '../../../shared/service/browse.service';
import { IJobPost } from '../job-management/interfaces/jobPost';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { CommonModule } from '@angular/common';
import { SharedSearchService } from '../../../shared/service/sharedSearch.service';
import { FormsModule } from '@angular/forms';
import { FreelancerEntity } from '../../../shared/types/FreelancerEntity';

@Component({
  selector: 'app-client-search',
  standalone: true,
  imports: [NavbarAfterLoginComponent, CommonModule, FormsModule],
  templateUrl: './client-search.component.html',
  styleUrl: './client-search.component.scss',
})
export class ClientSearchComponent implements OnInit {
  searchQuery: string = '';
  freelancers: FreelancerEntity[] = []; // Original freelancers list
  filteredFreelancers: FreelancerEntity[] = []; // Filtered freelancers list
  showMore: boolean[] = []; // To manage 'Show More' functionality per freelancer

  constructor(private browseService: BrowseService) {}

  ngOnInit(): void {
    this.fetchFreelancers();
  }

  // Fetch all freelancers initially
  fetchFreelancers(): void {
    this.browseService.getFreelancers().subscribe((data: FreelancerEntity[]) => {
      this.freelancers = data;
      this.filteredFreelancers = [...this.freelancers]; // Copy freelancers to filteredFreelancers initially
      this.showMore = new Array(this.freelancers.length).fill(false); // Initialize showMore array
    });
  }

  // Search query change handler
  onSearchQueryChange(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredFreelancers = [...this.freelancers]; // If query is empty, show all freelancers
    } else {
      this.filteredFreelancers = this.freelancers.filter(
        (freelancer) =>
          freelancer.firstName
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          freelancer.role
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          freelancer.skill.some((skill) =>
            skill.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
      );
    }
  }

  // Toggle showing more/less freelancer bio
  handleShowMoreClick(event: Event, index: number): void {
    event.stopPropagation();
    this.showMore[index] = !this.showMore[index];
  }

  // Show freelancer details when card is clicked
  showFreelancerDetails(freelancer: FreelancerEntity): void {
    // Logic to show freelancer details (e.g., navigate to profile page)
    console.log('Freelancer details:', freelancer);
  }

  // Toggle favorite status
  toggleFavorite(event: Event, freelancer: FreelancerEntity): void {
    event.stopPropagation(); // Prevent event from triggering other handlers like `showFreelancerDetails`
    // freelancer.isFavorite = !freelancer.isFavorite; // Toggle favorite status
    // Additional logic to handle favorite action (e.g., update backend)
  }

  // Scroll freelancer skills container left
  scrollLeft(event: Event, container: HTMLElement): void {
    event.stopPropagation();
    container.scrollBy({
      left: -150,
      behavior: 'smooth',
    });
  }

  // Scroll freelancer skills container right
  scrollRight(event: Event, container: HTMLElement): void {
    event.stopPropagation();
    container.scrollBy({
      left: 150,
      behavior: 'smooth',
    });
  }
}
