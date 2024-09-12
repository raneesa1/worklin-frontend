import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IJobPost } from '../../interfaces/jobPost';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-budget-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-budget-modal.component.html',
  styleUrl: './edit-budget-modal.component.scss',
})
export class EditBudgetModalComponent implements OnInit {
  selectedRate: string = 'hourly';
  priceFrom: number | null = null;
  priceTo: number | null = null;
  jobPost: IJobPost = {} as IJobPost;
  globalError: string = '';
  isFormValid: boolean = false;
  isPriceModalOpen = false;
  @Output() budgetUpdated = new EventEmitter<IJobPost>();

  ngOnInit() {
    this.loadJobPost();
  }

  loadJobPost() {
    const storedJobPost = localStorage.getItem('jobPost');
    if (storedJobPost) {
      this.jobPost = JSON.parse(storedJobPost);
      this.selectedRate = this.jobPost.rate || 'hourly';
      this.priceFrom = this.jobPost.priceFrom || null;
      this.priceTo = this.jobPost.priceTo || null;
    }
  }

  validateBudget() {
    this.isFormValid =
      !!this.priceFrom && !!this.priceTo && this.priceFrom <= this.priceTo;
    if (!this.isFormValid) {
      this.globalError = 'Please enter a valid budget range.';
    } else {
      this.globalError = '';
    }
  }

  onRateSelection(rate: string) {
    this.selectedRate = rate;
  }

  onSaveBudget() {
    if (this.isFormValid) {
      const updatedJobPost: IJobPost = {
        rate: this.selectedRate,
        priceFrom: this.priceFrom!,
        priceTo: this.priceTo!,
      } as IJobPost
      this.budgetUpdated.emit(updatedJobPost);
      this.closeModal();
    }
  }
  openModal() {
    this.isPriceModalOpen = true;
  }
  closeModal() {
    this.isPriceModalOpen = false;
  }
}
