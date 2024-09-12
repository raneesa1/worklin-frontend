import {
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
  ],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('fileInput') private fileInput!: ElementRef;
  rooms: RoomWithParticipant[] = [];
  messages: IMessage[] = [];
  sendingAudioMessage: boolean = false;
  currentRoom: RoomWithParticipant | null = null;
  newMessage: string = '';

  userId: string = '';
  sendingFileMessage: boolean = false;
  selectedFile: File | null = null;
  currentUser: FreelancerEntity | null = null;
  currentReceiver: FreelancerEntity | null = null;
  isRecording: boolean = false;
  private messageSubscription: Subscription | undefined;

  audioRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  constructor(
    private chatService: ChatService,
    private roleService: roleService,
    private socketService: SocketService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.scrollToBottom();
    this.userId = this.roleService.getUserId();
    this.loadRooms();

    this.loadCurrentUser();
    this.messageSubscription = this.socketService
      .onNewMessage()
      .subscribe((message: IMessage) => {
        console.log('Received message in component:', message);
        if (this.currentRoom && message.chatId === this.currentRoom._id) {
          console.log('Adding message to current room');
          // Check if the message is already in the array
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
          // ... (code for handling messages not in the current room remains the same)
        }
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

  sendReadReceipt(message: IMessage) {
    if (message._id) {
      this.socketService.sendReadReceipt(message._id, this.currentRoom!._id);
    }
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
    this.chatService.getFreelancerById(this.userId).subscribe(
      (user) => {
        this.currentUser = user;
        console.log('Loaded current user:', this.currentUser);
      },
      (error) => {
        console.error('Error loading current user:', error);
      }
    );
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

  selectRoom(room: RoomWithParticipant) {
    console.log('Selecting room:', room);
    if (this.currentRoom) {
      this.socketService.leaveRoom(this.currentRoom._id);
    }
    this.currentRoom = room;
    this.messages = room.message || [];
    this.socketService.joinRoom(room._id);
    this.currentReceiver = room.participant || null;
    this.changeDetectorRef.detectChanges();
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
      this.messages.push(messageData);
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
      setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }, 0);
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
      formData.append('upload_preset', 'worklin'); // Replace with your Cloudinary upload preset

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
    this.socketService.disconnect();
    window.removeEventListener('resize', this.setViewportHeight);
  }
}
