import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ImagekitioAngularModule } from 'imagekitio-angular';
// import { NgxImageCropperModule } from 'ngx-image-cropper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as UC from '@uploadcare/file-uploader';
UC.defineComponents(UC);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
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
export class UserManagementModule {

}
