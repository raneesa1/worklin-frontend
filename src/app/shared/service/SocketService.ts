import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IMessage } from '../types/IChat';
import { roleService } from './role.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private clickReadSubject: Subject<{
    chatIds: string[];
    click: string;
    view: string;
  }> = new Subject();

  private messageSubject: Subject<IMessage> = new Subject<IMessage>();
  private messageUpdateSubject: Subject<{
    id: string;
    receiver: string;
    sender: string;
  }> = new Subject();

  private incomingCallSubject: Subject<{
    callerId: string;
    callerName: string;
  }> = new Subject();
  private callAcceptedSubject: Subject<{ accepterId: string; roomID: string }> =
    new Subject();
  private callRejectedSubject: Subject<{ rejecterId: string }> = new Subject();
  private callEndedSubject: Subject<{ callerId: string }> = new Subject();
  private userJoinedSubject: Subject<{ userId: string }> = new Subject();
  private userLeftSubject: Subject<{ userId: string }> = new Subject();
  private onlineUsers: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);

  constructor(private roleService: roleService) {
    this.socket = io('https://worklin.shop', {
      path: '/socket.io',
      withCredentials: true,
      transports: ['websocket'],
      query: {
        userId: this.getUserIdFromStorage(), // Implement this method to get userId from storage
      },
    });

    // this.setupSocketListeners();

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on(
      'updated message',
      (id: string, receiver: string, sender: string) => {
        this.messageUpdateSubject.next({ id, receiver, sender });
      }
    );

    this.socket.on(
      'click read',
      (chatIds: string[], click: string, view: string) => {
        this.clickReadSubject.next({ chatIds, click, view });
      }
    );

    this.socket.on('incoming_call', ({ callerId, callerName }) => {
      console.log(
        callerId,
        callerName,
        'consoing the incoming cal incoming_callincoming_callincoming_callincoming_callincoming_callincoming_callincoming_callincoming_callincoming_callincoming_callincoming_callincoming_callincoming_calll '
      );
      this.incomingCallSubject.next({ callerId, callerName });
    });
    this.socket.on('call_accepted', ({ accepterId, roomID }) => {
      this.callAcceptedSubject.next({ accepterId, roomID });
    });
    this.socket.on('call_rejected', ({ rejecterId }) => {
      this.callRejectedSubject.next({ rejecterId });
    });
    this.socket.on('call_ended', ({ callerId }) => {
      this.callEndedSubject.next({ callerId });
    });
    this.socket.on('user_joined', ({ userId }) => {
      this.userJoinedSubject.next({ userId });
    });
    this.socket.on('user_left', ({ userId }) => {
      this.userLeftSubject.next({ userId });
    });
    this.socket.on('message received', (message: IMessage) => {
      console.log('Received message in SocketService:', message);
      if (!message.chatId) {
        console.error('Received message without chatId:', message);
        return;
      }
      this.messageSubject.next(message);
    });
    this.socket.on('getOnlineUsers', (users: string[]) => {
      console.log('Received online users from server:', users);
      this.onlineUsers.next(users);
    });
  }
  getOnlineUsers(): Observable<string[]> {
    return this.onlineUsers.asObservable();
  }

  private getUserIdFromStorage(): string {
    // Implement based on how you store the user ID
    const userId = this.roleService.getUserId();
    console.log(
      userId,
      'consoling the user id from storageeee-e-e-e-e-e-e-e-e-e-e-e-e-e-e-e--e-e-ee-'
    );
    return userId;
  }

  onIncomingCall(): Observable<{ callerId: string; callerName: string }> {
    return this.incomingCallSubject.asObservable();
  }

  onCallAccepted(): Observable<{ accepterId: string; roomID: string }> {
    return this.callAcceptedSubject.asObservable();
  }

  onCallRejected(): Observable<{ rejecterId: string }> {
    return this.callRejectedSubject.asObservable();
  }

  joinVideoRoom(data: { roomID: string; userId: string }) {
    this.socket.emit('join_video_room', data);
  }

  leaveVideoRoom(data: { roomID: string; userId: string }) {
    this.socket.emit('leave_video_room', data);
  }

  // initiateCall(data: {
  //   callerId: string;
  //   receiverId: string;
  //   callerName: string;
  // }) {
  //   this.socket.emit('initiate_call', data);
  // }

  emitCallAccepted(data: {
    callerId: string;
    accepterId: string;
    roomID: string;
  }) {
    this.socket.emit('call_accepted', data);
  }

  emitCallRejected(data: { callerId: string; rejecterId: string }) {
    this.socket.emit('call_rejected', data);
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

  sendReadReceipt(data: {
    sender: string;
    receiver: string;
    status: string;
    chatId: string;
    id: string;
  }) {
    this.socket.emit('read message', data);
  }

  sendClickView(data: { view: string; click: string; chatIds: string[] }) {
    this.socket.emit('clickView', data);
  }

  onClickRead(): Observable<{
    chatIds: string[];
    click: string;
    view: string;
  }> {
    return this.clickReadSubject.asObservable();
  }

  onMessageUpdate(): Observable<{
    id: string;
    receiver: string;
    sender: string;
  }> {
    return this.messageUpdateSubject.asObservable();
  }

  leaveRoom(roomId: string) {
    console.log('Leaving room:', roomId);
    this.socket.emit('leaveRoom', roomId);
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  initiateCall(data: {
    callerId: string;
    receiverId: string;
    callerName: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket.connected) {
        reject(new Error('Socket is not connected'));
        return;
      }

      console.log(
        data,
        'consoling the data of initate call form the frontend socket service ------<<><><><><<><><><<><><><><><>><<><><><><>><><><><><><><><><><><><><>'
      );
      this.socket.emit('initiate_call', data, (error: any) => {
        if (error) {
          console.error('Error initiating call:', error);
          reject(error);
        } else {
          console.log('Call initiated successfully');
          resolve();
        }
      });
    });
  }

  acceptCall(data: { callerId: string; accepterId: string; roomID: string }) {
    this.socket.emit('call_accepted', data);
  }

  rejectCall(data: { callerId: string; rejecterId: string }) {
    this.socket.emit('call_rejected', data);
  }

  endCall(data: { callerId: string; receiverId: string }) {
    this.socket.emit('end_call', data);
  }

  // joinVideoRoom(data: { roomID: string; userId: string }) {
  //   this.socket.emit('join_video_room', data);
  // }

  // leaveVideoRoom(data: { roomID: string; userId: string }) {
  //   this.socket.emit('leave_video_room', data);
  // }

  // onIncomingCall(): Observable<{ callerId: string; callerName: string }> {
  //   return this.incomingCallSubject.asObservable();
  // }

  // onCallAccepted(): Observable<{ accepterId: string; roomID: string }> {
  //   return this.callAcceptedSubject.asObservable();
  // }

  // onCallRejected(): Observable<{ rejecterId: string }> {
  //   return this.callRejectedSubject.asObservable();
  // }

  onCallEnded(): Observable<{ callerId: string }> {
    return this.callEndedSubject.asObservable();
  }

  onUserJoined(): Observable<{ userId: string }> {
    return this.userJoinedSubject.asObservable();
  }

  onUserLeft(): Observable<{ userId: string }> {
    return this.userLeftSubject.asObservable();
  }

  disconnect() {
    console.log('Disconnecting socket');
    this.socket.disconnect();
  }
}
