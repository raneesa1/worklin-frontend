import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { PhotoUploadModalComponent } from '../photo-upload-modal/photo-upload-modal.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerComponent,
    PhotoUploadModalComponent,
    RouterModule
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent {
  user = {
    dob: '',
    country: 'India',
    address: '',
    city: '',
    state: '',
    phone: '',
    zip: '',
    apt: '',
  };

  public date = new Date();

  constructor() {}

  onSubmit() {
    if (
      this.user.dob &&
      this.user.country &&
      this.user.address &&
      this.user.city &&
      this.user.phone &&
      this.user.zip
    ) {
      // Send user information to backend
      console.log('Form submitted:', this.user);
      // Example code to send data to backend:
      // this.http.post('your-backend-api-url', this.user).subscribe(response => { ... });
    }
  }
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  
}
