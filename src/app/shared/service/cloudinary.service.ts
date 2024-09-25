import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMessage, IRoom } from '../types/IChat';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudinaryUrl =
    'https://api.cloudinary.com/v1_1/dgyd6acjg/raw/upload'; // Adjust to your API base URL

  constructor(private http: HttpClient) {}

  uploadToCloudinary(formData: FormData): Observable<any> {
    return this.http.post<any>(this.cloudinaryUrl, formData);
  }
}
