import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMessage, IRoom } from '../types/IChat';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseUrl = `${environment.backendUrl}/chat`; // Adjust to your API base URL
  private userUrl = `${environment.backendUrl}/user`; // Adjust to your API base URL
  private cloudinaryUrl =
    'https://api.cloudinary.com/v1_1/dgyd6acjg/raw/upload'; // Adjust to your API base URL

  constructor(private http: HttpClient) {}

  getRooms(
    userId: string
  ): Observable<{ success: boolean; user: IRoom[]; message: string }> {
    return this.http.get<{ success: boolean; user: IRoom[]; message: string }>(
      `${this.baseUrl}/get-room?id=${userId}` // Updated endpoint
    );
  }
  getFreelancerById(freelancerId: string): Observable<any> {
    return this.http.get(`${this.userUrl}/freelancer/${freelancerId}`);
  }
  getClientById(clientId: string): Observable<any> {
    return this.http.get(`${this.userUrl}/client/${clientId}`);
  }

  getMessages(
    roomId: string
  ): Observable<{ success: boolean; user: IMessage[]; message: string }> {
    return this.http.get<{
      success: boolean;
      user: IMessage[];
      message: string;
    }>(`${this.baseUrl}/getMessage?roomId=${roomId}`);
  }
  sendMessage(messageData: {
    sender: string;
    receiver: string;
    content: string;
    type: string;
  }): Observable<{ success: boolean; user: IMessage; message: string }> {
    return this.http.post<{
      success: boolean;
      user: IMessage;
      message: string;
    }>(`${this.baseUrl}/sendMessage`, messageData);
  }
  createRoom(messageData: {
    sender: string;
    receiver: string;
  }): Observable<{ success: boolean; user: any; message: string }> {
    return this.http.post<{ success: boolean; user: any; message: string }>(
      `${this.baseUrl}/create-room`,
      messageData
    );
  }

  uploadVoiceMessage(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload-voice`, formData);
  }
  uploadToCloudinary(formData: FormData): Observable<any> {
    return this.http.post<any>(this.cloudinaryUrl, formData);
  }
}
