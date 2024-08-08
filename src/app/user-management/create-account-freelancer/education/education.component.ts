import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddEducationModalComponent } from '../add-education-modal/add-education-modal.component';
import { Education } from '../../interfaces/education';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [RouterModule, AddEducationModalComponent,CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent {
  education: Education[] = [
     {
      school: 'Northwestern University',
      degree: 'Bachelor’s Degree',
      fieldOfStudy: 'Computer Science',
      fromMonth: 'September',
      fromYear: '2016',
      toMonth: 'June',
      toYear: '2020',
      description: 'Studied core concepts of computer science including algorithms, data structures, and software development.'
    },
  ];
  isModalOpen: boolean = false;

  // Open the modal for adding/editing education
  openModal() {
    this.isModalOpen = true;
  }

  // Close the modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Add new education entry
  addEducation(newEducation: Education) {
    this.education.push(newEducation);
    this.closeModal();
  }
}
