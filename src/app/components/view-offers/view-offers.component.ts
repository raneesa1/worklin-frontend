import { Component, OnInit } from '@angular/core';
import {
  IJobOffer,
  offerStatus,
  paymentOption,
} from '../../shared/types/IJobOffer';
import { CommonModule } from '@angular/common';
import { NavbarAfterLoginComponent } from '../../shared/components/navbar-after-login/navbar-after-login.component';
import { roleService } from '../../shared/service/role.service';
import { BrowseService } from '../../shared/service/browse.service';
import { DisplayResultModalComponent } from '../display-result-modal/display-result-modal.component';

@Component({
  selector: 'app-view-offers',
  standalone: true,
  imports: [
    CommonModule,
    NavbarAfterLoginComponent,
    DisplayResultModalComponent,
  ],
  templateUrl: './view-offers.component.html',
  styleUrl: './view-offers.component.scss',
})
export class ViewOffersComponent implements OnInit {
  jobOffers: IJobOffer[] = [];
  showMore: boolean[] = [];
  selectedOffer: IJobOffer | null = null;
  isClosing: boolean = false;

  showResultModal: boolean = false;
  resultStatus: 'success' | 'fail' | 'info' = 'info';
  resultMessage: string = '';

  constructor(
    private roleService: roleService,
    private jobOfferService: BrowseService
  ) {}

  ngOnInit(): void {
    this.fetchJobOffers();
  }

  fetchJobOffers(): void {
    const freelancerId = this.roleService.getUserId();
    console.log(freelancerId, 'consoling the freleancer id');
    this.jobOfferService.fetchOffers(freelancerId).subscribe(
      (result) => {
        console.log(result.jobOffer, 'consoling offers');
        this.jobOffers = result.jobOffer;
        this.showMore = new Array(this.jobOffers.length).fill(false);
      },
      (error) => {
        console.error('Error fetching job offers:', error);
      }
    );
  }

  handleShowMoreClick(event: Event, index: number): void {
    event.stopPropagation();
    this.showMore[index] = !this.showMore[index];
  }
  getFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Unknown File';
  }

  showOfferDetails(offer: IJobOffer): void {
    this.selectedOffer = offer;
  }

  hideOfferDetails(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.selectedOffer = null;
      this.isClosing = false;
    }, 300);
  }
  acceptOffer(event: Event, offer: IJobOffer | null): void {
    event.stopPropagation();
    if (offer && !this.isOfferAccepted(offer)) {
      this.jobOfferService
        .updateJobOfferStatus(offer._id, 'accepted')
        .subscribe(
          (response) => {
            console.log(response, 'consoling the resp of job offer');
            this.resultStatus = 'success';
            this.resultMessage = 'Offer accepted successfully!';
            this.showResultModal = true;
            this.fetchJobOffers(); // Refresh offers after acceptance
          },
          (error) => {
            this.resultStatus = 'fail';
            this.resultMessage = 'Failed to accept the offer.';
            this.showResultModal = true;
            console.error('Error accepting offer:', error);
          }
        );
    }
  }

  declineOffer(event: Event, offer: IJobOffer | null): void {
    event.stopPropagation();
    if (offer && !this.isOfferAccepted(offer)) {
      this.jobOfferService
        .updateJobOfferStatus(offer._id, 'rejected')
        .subscribe(
          (response) => {
            this.resultStatus = 'success';
            this.resultMessage = 'Offer declined successfully!';
            this.showResultModal = true;
            this.fetchJobOffers(); // Refresh offers after decline
          },
          (error) => {
            this.resultStatus = 'fail';
            this.resultMessage = 'Failed to decline the offer.';
            this.showResultModal = true;
            console.error('Error declining offer:', error);
          }
        );
    }
  }
  isOfferAccepted(offer: IJobOffer): boolean {
    return offer.offerStatus === 'accepted';
  }

  closeResultModal() {
    this.showResultModal = false;
  }
}
