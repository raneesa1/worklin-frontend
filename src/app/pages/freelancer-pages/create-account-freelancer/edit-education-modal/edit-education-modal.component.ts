import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Education } from '../../../../shared/types/interfaces/education';

@Component({
  selector: 'app-edit-education-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-education-modal.component.html',
  styleUrl: './edit-education-modal.component.scss',
})
export class EditEducationModalComponent {
  @Input() education: Education | null = {
    school: '',
    degree: '',
    fieldOfStudy: '',
    fromMonth: '',
    fromYear: '',
    toMonth: '',
    toYear: '',
    description: '',
  };
  @Output() save = new EventEmitter<Education>();
  @Output() close = new EventEmitter<void>();

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  years: number[] = [];

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 50 }, (v, i) => currentYear - i);
  }

  closeEditModal() {
    this.close.emit();
  }

  validateDates(): boolean {
    if (this.education) {
      const startYear = parseInt(this.education.fromYear, 10);
      const endYear = parseInt(this.education.toYear, 10);
      const startMonth = this.months.indexOf(this.education.fromMonth) + 1;
      const endMonth = this.months.indexOf(this.education.toMonth) + 1;

      if (
        endYear < startYear ||
        (endYear === startYear && endMonth < startMonth)
      ) {
        return false;
      }
    }
    return true;
  }

  saveEducation(form: NgForm) {
    if (form.valid && this.education) {
      if (this.validateDates()) {
        this.save.emit(this.education);
      } else {
        alert('The end date cannot be before the start date.');
      }
    }
  }
}