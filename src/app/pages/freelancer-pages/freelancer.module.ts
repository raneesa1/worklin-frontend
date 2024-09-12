import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FreelancerRoutingModule } from './freelancer-routing.module';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ImagekitioAngularModule } from 'imagekitio-angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // UserManagementRoutingModule,
    FreelancerRoutingModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    ImagekitioAngularModule.forRoot({
      publicKey: 'public_ood9hGFlXtYEBoFCXgQy1p7uFog=',
      urlEndpoint: 'https://ik.imagekit.io/6bssqybye',
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MatDatepickerModule],
})
export class FreelancerModule {}
