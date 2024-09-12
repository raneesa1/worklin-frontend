import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './SocketService';
import { IMessage, IRoom } from '../types/IChat';

@Injectable({
  providedIn: 'root',
})
export class VoiceCallService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  public callStatus = new BehaviorSubject<'idle' | 'calling' | 'incall'>(
    'idle'
  );

  constructor(
    private socketService: SocketService,
    private voiceCallService: VoiceCallService
  ) {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socketService.onNewMessage().subscribe((message: IMessage) => {
      if (message.type === 'call-offer') {
        this.handleIncomingCall(JSON.parse(message.content), message.sender);
      } else if (message.type === 'call-answer') {
        this.handleCallAnswer(JSON.parse(message.content));
      } else if (message.type === 'ice-candidate') {
        this.addIceCandidate(JSON.parse(message.content));
      }
    });
  }

  async startCall(receiverId: string, chatId: string) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.peerConnection = new RTCPeerConnection();

      this.localStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      const offerMessage: IMessage = {
        sender: 'currentUserId', // Replace with actual current user ID
        receiver: receiverId,
        content: JSON.stringify(offer),
        chatId: chatId,
        type: 'call-offer',
      };
      this.socketService.sendMessage(offerMessage);
      this.callStatus.next('calling');

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const candidateMessage: IMessage = {
            sender: 'currentUserId', // Replace with actual current user ID
            receiver: receiverId,
            content: JSON.stringify(event.candidate),
            chatId: chatId,
            type: 'ice-candidate',
          };
          this.socketService.sendMessage(candidateMessage);
        }
      };

      this.peerConnection.ontrack = (event) => {
        const remoteAudio = new Audio();
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play();
      };
    } catch (error) {
      console.error('Error starting call:', error);
      this.endCall();
    }
  }

  private async handleIncomingCall(
    offer: RTCSessionDescriptionInit,
    callerId: string
  ) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.peerConnection = new RTCPeerConnection();

      this.localStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });

      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      const answerMessage: IMessage = {
        sender: 'currentUserId', // Replace with actual current user ID
        receiver: callerId,
        content: JSON.stringify(answer),
        chatId: 'currentChatId', // Replace with actual chat ID
        type: 'call-answer',
      };
      this.socketService.sendMessage(answerMessage);
      this.callStatus.next('incall');

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const candidateMessage: IMessage = {
            sender: 'currentUserId', // Replace with actual current user ID
            receiver: callerId,
            content: JSON.stringify(event.candidate),
            chatId: 'currentChatId', // Replace with actual chat ID
            type: 'ice-candidate',
          };
          this.socketService.sendMessage(candidateMessage);
        }
      };

      this.peerConnection.ontrack = (event) => {
        const remoteAudio = new Audio();
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play();
      };
    } catch (error) {
      console.error('Error handling incoming call:', error);
      this.endCall();
    }
  }

  answerCall() {
    // if (this.incomingOffer && this.incomingCallerId) {
    // Use the stored offer and callerId to establish the connection
    // This would involve creating and setting up the RTCPeerConnection
    // Similar to what's done in the startCall method
    // ...
    //   this.callStatus.next('in call');
    // }
  }

  private async handleCallAnswer(answer: RTCSessionDescriptionInit) {
    if (this.peerConnection) {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      this.callStatus.next('incall');
    }
  }

  private async addIceCandidate(candidate: RTCIceCandidate) {
    if (this.peerConnection) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  endCall() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.callStatus.next('idle');
  }
}
