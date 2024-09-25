import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';

import '@uploadcare/blocks/web/lr-file-uploader-regular.min.css';
import { DatePickerComponent } from '../../../../components/date-picker/date-picker.component';
import { PhotoUploadModalComponent } from '../photo-upload-modal/photo-upload-modal.component';
import { Router, RouterModule } from '@angular/router';
import { isClassInstance } from '@ngrx/effects/src/utils';
import { roleService } from '../../../../shared/service/role.service';
import { ProfileManagementService } from '../../../../shared/service/profile-management.service';
import { Address } from '../../../../shared/types/interfaces/address';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerComponent,
    PhotoUploadModalComponent,
    RouterModule,
  ],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {
  selectedDate!: Date;
  dobError = false;
  dobErrorMessage: string = '';
  profileForm: FormGroup;
  uploadedImageUrl: string | null = null;
  imageError = false; // New property for image validation

  user = {
    dob: new Date(),
    country: 'India',
    address: '',
    city: '',
    state: '',
    phone: '',
    zip: '',
    apt: '',
  };

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileManagementService,
    private roleService: roleService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      country: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      zip: [''],
      apt: [''],
    });
  }

  ngOnInit(): void {}

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.user.dob = this.selectedDate;
    this.dobError = false;
    this.dobErrorMessage = '';
    this.validateDate(this.selectedDate);
  }

  validateDate(date: Date | undefined) {
    if (!date) {
      this.dobError = true;
      this.dobErrorMessage = 'Date of birth is required.';
      return;
    }

    const today = new Date();
    const fifteenYearsAgo = new Date();
    fifteenYearsAgo.setFullYear(today.getFullYear() - 18);

    if (this.isToday(date)) {
      this.dobError = true;
      this.dobErrorMessage = 'Date cannot be today.';
    } else if (date > fifteenYearsAgo) {
      this.dobError = true;
      this.dobErrorMessage = 'You must be at least 18 years old.';
    } else {
      this.dobError = false;
      this.dobErrorMessage = '';
    }
  }

  isToday(date: Date | undefined): boolean {
    if (!date) return false;
    const today = new Date();
    return today.toDateString() === date.toDateString();
  }

  onSubmit() {
    this.profileForm.markAllAsTouched();
    this.validateDate(this.selectedDate);

    this.imageError = !this.uploadedImageUrl; // Check if image is uploaded

    if (this.dobError || !this.profileForm.valid || this.imageError) {
      // Handle validation errors
      console.log('Validation errors:', this.dobErrorMessage);
      console.log('Form errors:', this.profileForm.errors);
      return;
    }

    const locationData: Address = {
      country: this.profileForm.get('country')?.value,
      address: this.profileForm.get('address')?.value,
      city: this.profileForm.get('city')?.value,
      state: this.profileForm.get('state')?.value,
      phone: this.profileForm.get('phone')?.value,
      zip: this.profileForm.get('zip')?.value,
      apt: this.profileForm.get('apt')?.value,
      dob: this.selectedDate,
    };

    const userId = this.roleService.getUserId();
    if (userId && this.uploadedImageUrl) {
      const payload = {
        freelancerId: userId, // Ensure userId is a string
        locationData: locationData,
        imageUrl: this.uploadedImageUrl, // Ensure imageUrl is a string
      };

      console.log(payload, 'consoling the location data');

      this.profileService.sendLocationData(payload).subscribe((response) => {
        console.log('Location data sent successfully:', response);
        if (response && response.freelancer) {
          this.router.navigate(['/freelancer/create-account-preview']);
          localStorage.setItem(
            'freelancer',
            JSON.stringify(response.freelancer)
          );
          console.log('Freelancer details saved to local storage.');
        }
      });
    }
  }

  onImageUploaded(imageUrl: string) {
    this.uploadedImageUrl = imageUrl;
    this.imageError = false;
    console.log(imageUrl, 'consoling the image url from location ts file');
  }
}
