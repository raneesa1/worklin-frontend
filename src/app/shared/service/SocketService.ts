import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { IMessage } from '../types/IChat';


@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private messageSubject: Subject<IMessage> = new Subject<IMessage>();

  constructor() {
    this.socket = io('http://localhost:8004', {
      withCredentials: true,
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('message received', (message: IMessage) => {
      console.log('Received message in SocketService:', message);
      if (!message.chatId) {
        console.error('Received message without chatId:', message);
        return;
      }
      this.messageSubject.next(message);
    });
  }
  sendReadReceipt(messageId: string, roomId: string) {
    console.log('Sending read receipt for message:', messageId);
    this.socket.emit('read receipt', { messageId, roomId });
  }
  
  sendMessage(messageData: IMessage) {
    console.log('Sending message in SocketService:', messageData);
    this.socket.emit('new message', messageData);
  }

  onNewMessage(): Observable<IMessage> {
    return this.messageSubject.asObservable();
  }

  joinRoom(roomId: string) {
    console.log('Joining room:', roomId);
    this.socket.emit('join chat', roomId);
  }

  leaveRoom(roomId: string) {
    console.log('Leaving room:', roomId);
    this.socket.emit('leaveRoom', roomId);
  }

  disconnect() {
    console.log('Disconnecting socket');
    this.socket.disconnect();
  }
}
