import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { CommonModule } from '@angular/common';
import { roleService } from '../../../shared/service/role.service';
import { JobDetailPageComponent } from '../job-detail-page/job-detail-page.component';
import { ViewRequestModalComponent } from '../../../components/view-request-modal/view-request-modal.component';
import {
  IInviteFreelancer,
  IJobPost,
  jobPostStatus,
  applicationStatus,
} from '../../client-pages/job-management/interfaces/jobPost';
import { BrowseService } from '../../../shared/service/browse.service';
import { Skill } from '../../client-pages/job-management/interfaces/skill';
import { IJobOffer } from '../../../shared/types/IJobOffer';
import { takeUntil } from 'rxjs';
import { ViewOffersComponent } from '../../../components/view-offers/view-offers.component';

@Component({
  selector: 'app-invites',
  standalone: true,
  imports: [
    NavbarAfterLoginComponent,
    CommonModule,
    JobDetailPageComponent,
    ViewRequestModalComponent,
    ViewOffersComponent,
  ],
  templateUrl: './invites.component.html',
  styleUrl: './invites.component.scss',
})
export class InvitesComponent implements OnInit {
  jobPosts: IJobPost[] = [];
  showMore: boolean[] = [];
  selectedJob: IJobPost | null = null;
  isClosing: boolean = false;
  clientName: string | null = null;
  message: string | null = null;
  IsInviteSelected: boolean = false;
  hasAppliedToSelectedJob: boolean = false;
  currentUserId: string;
  jobOffers: IJobOffer[] = [];
  activeTab: 'invites' | 'offers' = 'invites';
  selectedOffer: IJobOffer | null = null;
  @Output() jobAppliedEvent = new EventEmitter<void>();

  selectedInvite: IInviteFreelancer | null = null;

  constructor(
    private invitesService: BrowseService,
    private roleService: roleService
  ) {
    this.currentUserId = this.roleService.getUserId();
  }

  ngOnInit(): void {
    this.loadInvites();
    this.fetchJobOffers();
  }
  setActiveTab(tab: 'invites' | 'offers') {
    this.activeTab = tab;
  }

  loadInvites(): void {
    const freelancerId = this.roleService.getUserId();
    this.invitesService.getInvites(freelancerId).subscribe({
      next: (data: any) => {
        this.jobPosts = data.jobPosts.map((job: IJobPost) => ({
          ...job,
          appliedFreelancers: job.appliedFreelancers || [],
          isApplied: this.checkIfApplied(job),
        }));
        this.showMore = new Array(this.jobPosts.length).fill(false);
        console.log('Job posts fetched:', this.jobPosts);
      },
      error: (error) => {
        console.error('Error fetching job posts:', error);
      },
    });
  }

  toggleFavorite(event: Event, job: IJobPost): void {
    event.stopPropagation();
    job.isFavorite = !job.isFavorite;
  }

  checkIfApplied(job: IJobPost): boolean {
    return job.appliedFreelancers?.includes(this.currentUserId) || false;
  }

  showJobDetails(job: IJobPost): void {
    this.selectedJob = job;
    this.hasAppliedToSelectedJob = this.checkIfApplied(job);
    console.log(
      this.hasAppliedToSelectedJob,
      'consoling in show job detail function from invites component'
    );
  }

  fetchJobOffers(): void {
    const clientId = this.roleService.getUserId();
    this.invitesService.fetchOffers(clientId).subscribe({
      next: (response: any) => {
        this.jobOffers = response.jobOffer;
        console.log(this.jobOffers, 'Fetched job offers');
      },
      error: (err) => {
        console.error('Error fetching job offers', err);
      },
    });
  }

  showOfferDetails(offer: any) {
    this.selectedOffer = offer;
  }

  closeOfferModal() {
    this.selectedOffer = null;
  }

  acceptOffer(offerId: string) {
    // Implement accept offer logic
  }

  declineOffer(offerId: string) {
    // Implement decline offer logic
  }

  hideJobDetails(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.selectedJob = null;
      this.isClosing = false;
    }, 300);
  }

  handleShowMoreClick(event: Event, index: number): void {
    event.stopPropagation();
    this.showMore[index] = !this.showMore[index];
  }

  scrollLeft(event: Event, container: HTMLElement): void {
    event.stopPropagation();
    container.scrollBy({ left: -100, behavior: 'smooth' });
  }

  scrollRight(event: Event, container: HTMLElement): void {
    event.stopPropagation();
    container.scrollBy({ left: 100, behavior: 'smooth' });
  }

  viewRequest(event: Event, invite: IInviteFreelancer): void {
    event.stopPropagation();
    if (invite && invite.jobId) {
      console.log('Invite selected:', invite);
      this.selectedInvite = invite;
      this.clientName = invite.clientName;
      this.message = invite.description;
      this.IsInviteSelected = true;
    } else {
      console.warn('Invalid invite or missing jobId:', invite);
    }
  }

  closeInviteModal(): void {
    this.selectedInvite = null;
    this.IsInviteSelected = false;
  }

  onJobApplied(): void {
    if (this.selectedJob) {
      this.selectedJob.appliedFreelancers =
        this.selectedJob.appliedFreelancers || [];
      this.selectedJob.appliedFreelancers.push(this.currentUserId);
      this.hasAppliedToSelectedJob = true;
    }
    this.updateJobInList(this.selectedJob);
    this.jobAppliedEvent.emit();
  }

  acceptInvite(event: { jobId: string; status: string }): void {
    console.log('acceptInvite called with event:', event);
    if (this.selectedInvite && this.selectedInvite.jobId) {
      console.log('Accepting invite for job:', this.selectedInvite.jobId);
      this.applyToJob(this.selectedInvite.jobId, 'accepted');
    } else {
      console.error('No valid job ID available for accepting invite');
    }
  }

  declineInvite(event: { jobId: string; status: string }): void {
    console.log('declineInvite called with event:', event);
    if (this.selectedInvite && this.selectedInvite.jobId) {
      console.log('Declining invite for job:', this.selectedInvite.jobId);
      this.applyToJob(this.selectedInvite.jobId, 'rejected');
    } else {
      console.error('No valid job ID available for declining invite');
    }
  }

  applyToJob(jobId: string, status: string): void {
    const freelancerId = this.roleService.getUserId();
    console.log('Applying to job:', { freelancerId, jobId, status });
    this.invitesService.updateInviteJob(freelancerId, jobId, status).subscribe({
      next: (response) => {
        console.log(`Successfully ${status} job:`, response);
        if (status === 'accepted') {
          this.onJobApplied();
        }
        this.closeInviteModal();
      },
      error: (error) => {
        console.error(`Error ${status} job:`, error);
      },
    });
  }
  updateJobInList(updatedJob: IJobPost | null): void {
    if (updatedJob) {
      const index = this.jobPosts.findIndex(
        (job) => job._id === updatedJob._id
      );
      if (index !== -1) {
        this.jobPosts[index] = { ...this.jobPosts[index], ...updatedJob };
      }
    }
  }
}
