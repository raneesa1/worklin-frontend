import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarAfterLoginComponent } from '../../../shared/components/navbar-after-login/navbar-after-login.component';
import { roleService } from '../../../shared/service/role.service';
import { forkJoin, Subscription } from 'rxjs';
import { ChatService } from '../../../shared/service/chat.service';
import { SocketService } from '../../../shared/service/SocketService';
import { IMessage, IRoom } from '../../../shared/types/IChat';
import { FreelancerEntity } from '../../../shared/types/FreelancerEntity';
import { ChatHeaderComponent } from '../../../components/chat-header/chat-header.component';
import { environment } from '../../../../environment/environment';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Router } from '@angular/router';
import { ChatListComponent } from '../../../components/chat-list/chat-list.component';
import { VideoCallService } from '../../../shared/service/video-call.service';
import { IncomingCallComponent } from '../../../components/incoming-call/incoming-call.component';

interface RoomWithParticipant extends IRoom {
  participant?: FreelancerEntity;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    NavbarAfterLoginComponent,
    CommonModule,
    FormsModule,
    ChatHeaderComponent,
    PickerComponent,
    IncomingCallComponent,
    ChatListComponent,
  ],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('fileInput') private fileInput!: ElementRef;
  rooms: RoomWithParticipant[] = [];
  messages: IMessage[] = [];
  sendingAudioMessage: boolean = false;
  currentRoom: RoomWithParticipant | null = null;
  newMessage: string = '';
  currentReceiverId: string = '';
  userId: string = '';
  sendingFileMessage: boolean = false;
  selectedFile: File | null = null;
  currentUser: FreelancerEntity | null = null;
  currentReceiver: FreelancerEntity | null = null;
  isRecording: boolean = false;
  private messageSubscription: Subscription | undefined;
  private clickReadSubscription: Subscription | undefined;
  onlineUsers: string[] = [];
  showIncomingCall: boolean = false;

  audioRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  showEmojiPicker = false;
  private messageUpdateSubscription: Subscription | undefined;
  private incomingCallSubscription: Subscription | undefined;
  incomingCall: boolean = false;
  incomingCallerId: string = '';
  incomingCallerName: string = '';

  private onlineUsersSubscription: Subscription | undefined;

  constructor(
    private chatService: ChatService,
    private roleService: roleService,
    private socketService: SocketService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private videoCallService: VideoCallService
  ) {}

  ngOnInit() {
    this.scrollToBottom();
    this.userId = this.roleService.getUserId();
    this.loadRooms();
    this.subscribeToOnlineUsers();
    this.loadCurrentUser();
    this.messageSubscription = this.socketService
      .onNewMessage()
      .subscribe((message: IMessage) => {
        console.log('Received message in component:', message);
        if (this.currentRoom && message.chatId === this.currentRoom._id) {
          console.log('Adding message to current room');
          const existingMessageIndex = this.messages.findIndex(
            (m) => m._id === message._id
          );
          if (existingMessageIndex !== -1) {
            // Update existing message
            this.messages[existingMessageIndex] = message;
          } else {
            // Add new message
            this.messages.push(message);
          }
          this.changeDetectorRef.detectChanges();
          this.scrollToBottom();

          // Send read receipt if the message is from the other participant
          if (message.sender !== this.userId) {
            this.sendReadReceipt(message);
          }
        } else {
          // Handle messages for other rooms if needed
        }
        this.messageUpdateSubscription = this.socketService
          .onMessageUpdate()
          .subscribe(({ id, receiver, sender }) => {
            const messageIndex = this.messages.findIndex((m) => m._id === id);
            if (messageIndex !== -1) {
              this.messages[messageIndex].status = 'read';
              this.changeDetectorRef.detectChanges();
            }
          });
        this.clickReadSubscription = this.socketService
          .onClickRead()
          .subscribe(({ chatIds, click, view }) => {
            // Update the unread count or status for the affected chats
            this.updateChatReadStatus(chatIds);
          });
      });
    this.incomingCallSubscription = this.socketService
      .onIncomingCall()
      .subscribe((callData: { callerId: string; callerName: string }) => {
        console.log('Incoming call received:', callData);
        this.handleIncomingCall(callData);
      });

    this.socketService.getOnlineUsers().subscribe((users: string[]) => {
      this.onlineUsers = users;
      this.changeDetectorRef.detectChanges();
    });

    this.setViewportHeight();
    window.addEventListener('resize', this.setViewportHeight);
  }
  isModalOpen = false;

  isAudioMessage(message: IMessage): boolean {
    return message.type === 'audio';
  }

  getAudioUrl(content: string): string {
    return content;
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.newMessage += event.emoji.native;
    this.showEmojiPicker = false;
  }
  sendReadReceipt(message: IMessage) {
    if (message._id && this.currentRoom) {
      this.socketService.sendReadReceipt({
        sender: message.sender,
        receiver: this.userId,
        status: 'read',
        chatId: this.currentRoom._id,
        id: message._id,
      });
    }
  }
  updateChatReadStatus(chatIds: string[]) {
    // Update the read status or unread count for the specified chats
    // This will depend on how you're storing and displaying chat list items
  }

  onChatItemClick(chat: any) {
    // When a chat item is clicked, send the clickView event
    if (!this.currentUser?._id) {
      return;
    }
    this.socketService.sendClickView({
      view: this.currentUser?._id,
      click: chat.participantId,
      chatIds: [chat.id],
    });
  }
  handleIncomingCall(event: { callerId: string; callerName: string }) {
    this.showIncomingCall = true;
    this.incomingCallerId = event.callerId;
    this.incomingCallerName = event.callerName;
  }

  handleAcceptCall() {
    const roomID = `room_${this.roleService.getUserId()}`;
    this.socketService.acceptCall({
      callerId: this.incomingCallerId,
      accepterId: this.roleService.getUserId(),
      roomID: roomID,
    });
    this.videoCallService.setCallStatus('incall');
    this.router.navigate(['/video-call'], {
      queryParams: {
        roomID: roomID,
        id: this.roleService.getUserId(),
        receiverId: this.incomingCallerId,
      },
    });
    this.showIncomingCall = false;
  }

  handleRejectCall() {
    this.socketService.rejectCall({
      callerId: this.incomingCallerId,
      rejecterId: this.roleService.getUserId(),
    });
    this.videoCallService.setCallStatus('idle');
    this.showIncomingCall = false;
  }

  private subscribeToOnlineUsers() {
    this.onlineUsersSubscription = this.socketService
      .getOnlineUsers()
      .subscribe((users: string[]) => {
        console.log('Received online users:', users);
        this.onlineUsers = users;
        console.log('Updated onlineUsers array:', this.onlineUsers);
        this.changeDetectorRef.detectChanges();
      });
  }
  isUserOnline(userId: string | undefined): boolean {
    const isOnline = userId ? this.onlineUsers.includes(userId) : false;
    console.log(`Checking online status for user ${userId}: ${isOnline}`);
    return isOnline;
  }

  onChatClick(chatIds: string[], clickedUserId: string) {
    this.socketService.sendClickView({
      view: this.userId,
      click: clickedUserId,
      chatIds: chatIds,
    });
  }
  getFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  isImageMessage(message: IMessage): boolean {
    return message.type === 'image';
  }

  isFileMessage(message: IMessage): boolean {
    return message.type === 'file';
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;

      this.audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.audioRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.uploadToCloudinaryAndSend(audioBlob);
      };

      this.audioRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  stopRecording() {
    if (this.audioRecorder && this.isRecording) {
      this.audioRecorder.stop();
      this.isRecording = false;
    }
  }

  uploadToCloudinaryAndSend(audioBlob: Blob) {
    if (this.currentRoom) {
      this.sendingAudioMessage = true;
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice_message.webm');
      formData.append('upload_preset', 'worklinTwo'); // Replace with your Cloudinary upload preset

      this.chatService.uploadToCloudinary(formData).subscribe(
        (response) => {
          console.log('Voice message uploaded to Cloudinary:', response);
          const messageData: IMessage = {
            chatId: this.currentRoom!._id,
            sender: this.userId,
            receiver: this.getOtherParticipant(this.currentRoom!.participants),
            content: response.secure_url,
            type: 'audio',
            status: 'sending',
          };

          // Send the audio message to the backend
          this.chatService.sendMessage(messageData).subscribe(
            (response: {
              success: boolean;
              user: IMessage;
              message: string;
            }) => {
              this.sendingAudioMessage = false;
              if (response.success) {
                console.log('Audio message saved to backend:', response.user);
                const savedMessage = response.user;
                this.socketService.sendMessage(savedMessage);
                this.messages.push(savedMessage);
                this.changeDetectorRef.detectChanges();
              } else {
                console.error(
                  'Failed to save audio message:',
                  response.message
                );
                // Handle the error (e.g., show an error message to the user)
              }
            },
            (error) => {
              this.sendingAudioMessage = false;
              console.error('Error saving audio message to backend:', error);
              // Handle the error (e.g., show an error message to the user)
            }
          );
        },
        (error) => {
          this.sendingAudioMessage = false;
          console.error('Error uploading voice message to Cloudinary:', error);
          // Handle the error (e.g., show an error message to the user)
        }
      );
    }
  }

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  selectOption(option: string) {
    console.log(option); // Handle the selected option (e.g., file, photos)
    this.closeModal();
  }
  isPlusClicked = false; // Track whether the plus icon is clicked

  toggleIcon() {
    this.isPlusClicked = !this.isPlusClicked;
  }
  loadCurrentUser() {
    const role = this.roleService.getUserRole();
    if (role === 'freelancer') {
      this.chatService.getFreelancerById(this.userId).subscribe(
        (user) => {
          this.currentUser = user;
          console.log('Loaded current user:', this.currentUser);
        },
        (error) => {
          console.error('Error loading current user:', error);
        }
      );
    } else if (role === 'client') {
      this.chatService.getClientById(this.userId).subscribe(
        (user) => {
          this.currentUser = user;
          console.log('Loaded current user:', this.currentUser);
        },
        (error) => {
          console.error('Error loading current user:', error);
        }
      );
    }
  }

  loadRooms() {
    this.chatService.getRooms(this.userId).subscribe(
      (response: { success: boolean; user: IRoom[]; message: string }) => {
        if (response.success) {
          this.rooms = response.user.map((room) => ({
            ...room,
            participant: undefined,
          }));
          console.log('Loaded rooms:', this.rooms);
          this.loadParticipantsForRooms();
        } else {
          console.error('Failed to load rooms:', response.message);
        }
      },
      (error) => {
        console.error('Error loading rooms:', error);
      }
    );
  }
  loadParticipantsForRooms() {
    const participantRequests = this.rooms.map((room) =>
      this.chatService.getFreelancerById(
        this.getOtherParticipant(room.participants)
      )
    );

    forkJoin(participantRequests).subscribe(
      (participants) => {
        this.rooms.forEach((room, index) => {
          room.participant = participants[index];
        });
        this.changeDetectorRef.detectChanges();

        if (this.rooms.length > 0) {
          this.selectRoom(this.rooms[0]);
        }
      },
      (error) => {
        console.error('Error loading participants:', error);
      }
    );
  }

  loadMessages(roomId: string) {
    const room = this.rooms.find((r) => r._id === roomId);
    if (room) {
      this.messages = room.message || [];
      console.log('Loaded Messages:', this.messages);
    } else {
      console.error('Room not found:', roomId);
    }
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  selectRoom(room: RoomWithParticipant) {
    console.log('Selecting room:', room);
    if (this.currentRoom) {
      this.socketService.leaveRoom(this.currentRoom._id);
    }
    this.currentRoom = room;
    this.messages = room.message || [];
    this.socketService.joinRoom(room._id);
    this.currentReceiverId = this.getOtherParticipant(room.participants);
    this.currentReceiver = room.participant || null;
    this.changeDetectorRef.detectChanges();
    setTimeout(() => this.scrollToBottom(), 0);
    this.messages.forEach((message) => {
      if (message.sender !== this.userId && message.status !== 'read') {
        this.sendReadReceipt(message);
      }
    });
  }

  loadReceiverData(receiverId: string) {
    this.chatService.getFreelancerById(receiverId).subscribe(
      (user) => {
        this.currentReceiver = user;
        console.log('Loaded receiver:', this.currentReceiver);
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        console.error('Error loading receiver:', error);
      }
    );
  }

  sendMessage() {
    if (this.newMessage.trim() && this.currentRoom) {
      const messageData: IMessage = {
        chatId: this.currentRoom._id,
        sender: this.userId,
        receiver: this.getOtherParticipant(this.currentRoom.participants),
        content: this.newMessage,
        type: 'text',
        status: 'sending',
      };

      console.log('Sending message:', messageData);

      // Optimistically add the message to the current room
      // this.messages.push(messageData);
      this.changeDetectorRef.detectChanges();
      this.scrollToBottom();

      this.chatService.sendMessage(messageData).subscribe(
        (response: { success: boolean; user: IMessage; message: string }) => {
          if (response.success) {
            console.log('Message saved to backend:', response.user);
            const savedMessage = response.user;
            // Update the optimistically added message with the saved message
            const messageIndex = this.messages.findIndex(
              (m) => m === messageData
            );
            if (messageIndex !== -1) {
              this.messages[messageIndex] = savedMessage;
            }
            this.socketService.sendMessage(savedMessage);
            this.changeDetectorRef.detectChanges();
          } else {
            console.error('Failed to save message:', response.message);
            // Remove the optimistically added message if it failed to save
            this.messages = this.messages.filter((m) => m !== messageData);
            this.changeDetectorRef.detectChanges();
          }
        },
        (error) => {
          console.error('Error saving message to backend:', error);
          // Remove the optimistically added message if there was an error
          this.messages = this.messages.filter((m) => m !== messageData);
          this.changeDetectorRef.detectChanges();
        }
      );

      this.newMessage = '';
    }
  }
  getOtherParticipant(participants: string[]): string {
    return (
      participants.find((participant) => participant !== this.userId) || ''
    );
  }

  setViewportHeight = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  scrollToBottom(): void {
    try {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight - element.clientHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.closeModal();
      this.uploadFileToCloudinary(this.selectedFile);
    }
  }

  uploadFileToCloudinary(file: File) {
    if (this.currentRoom) {
      this.sendingFileMessage = true;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', environment.cloudinaryUploadPreset); // Replace with your Cloudinary upload preset

      this.chatService.uploadToCloudinary(formData).subscribe(
        (response) => {
          console.log('File uploaded to Cloudinary:', response);
          const messageData: IMessage = {
            chatId: this.currentRoom!._id,
            sender: this.userId,
            receiver: this.getOtherParticipant(this.currentRoom!.participants),
            content: response.secure_url,
            type: this.getFileType(file),
            status: 'sending',
          };

          this.sendFileMessage(messageData);
        },
        (error) => {
          this.sendingFileMessage = false;
          console.error('Error uploading file to Cloudinary:', error);
          // Handle the error (e.g., show an error message to the user)
        }
      );
    }
  }

  sendFileMessage(messageData: IMessage) {
    this.chatService.sendMessage(messageData).subscribe(
      (response: { success: boolean; user: IMessage; message: string }) => {
        this.sendingFileMessage = false;
        if (response.success) {
          console.log('File message saved to backend:', response.user);
          const savedMessage = response.user;
          this.socketService.sendMessage(savedMessage);
          this.messages.push(savedMessage);
          this.changeDetectorRef.detectChanges();
        } else {
          console.error('Failed to save file message:', response.message);
          // Handle the error (e.g., show an error message to the user)
        }
      },
      (error) => {
        this.sendingFileMessage = false;
        console.error('Error saving file message to backend:', error);
        // Handle the error (e.g., show an error message to the user)
      }
    );
  }

  getFileType(file: File): string {
    if (file.type.startsWith('image/')) {
      return 'image';
    } else if (file.type.startsWith('video/')) {
      return 'video';
    } else {
      return 'file';
    }
  }
  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.currentRoom) {
      this.socketService.leaveRoom(this.currentRoom._id);
    }
    if (this.messageUpdateSubscription) {
      this.messageUpdateSubscription.unsubscribe();
    }
    if (this.incomingCallSubscription) {
      this.incomingCallSubscription.unsubscribe();
    }

    // this.socketService.disconnect();
    window.removeEventListener('resize', this.setViewportHeight);
  }
}
