import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Experience } from '../../../../shared/types/interfaces/experience';

@Component({
  selector: 'app-edit-experience-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-experience-modal.component.html',
  styleUrls: ['./edit-experience-modal.component.scss'],
})
export class EditExperienceModalComponent implements OnInit {
  @Input() experience: Experience | null = null;
  @Input() countries: string[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  isCurrentlyWorking: boolean = false;
  dateError: boolean = false;

  months: string[] = [
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
  years: string[] = [
    '2024',
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
    '2018',
    '2017',
  ];

  ngOnInit() {
    if (this.experience) {
      // Initialize the isCurrentlyWorking based on whether there is an end date or not
      this.isCurrentlyWorking = !this.experience.endDate;
    }
  }
  closeEditModal() {
    this.close.emit();
  }
  onSave(form: NgForm) {
    if (form.valid && this.experience) {
      if (this.isCurrentlyWorking) {
        this.experience.endDate = ''; // Clear end date if currently working
        this.dateError = false;
        this.save.emit(this.experience);
      } else if (this.experience.endDate) {
        const startDate = new Date(this.experience.startDate);
        const endDate = new Date(this.experience.endDate);

        if (endDate < startDate) {
          this.dateError = true;
        } else {
          this.dateError = false;
          this.save.emit(this.experience);
        }
      } else {
        this.dateError = false;
        this.save.emit(this.experience);
      }
    }
  }

  toggleCurrentlyWorking(event: Event) {
    this.isCurrentlyWorking = (event.target as HTMLInputElement).checked;
    if (this.isCurrentlyWorking && this.experience) {
      this.experience.endDate = ''; // Clear end date if checkbox is checked
    }
  }
}
