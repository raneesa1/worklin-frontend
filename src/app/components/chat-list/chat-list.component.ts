import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FreelancerEntity } from '../../shared/types/FreelancerEntity';
import { IRoom } from '../../shared/types/IChat';
import { CommonModule } from '@angular/common';
import { roleService } from '../../shared/service/role.service';
import { SocketService } from '../../shared/service/SocketService';
import { ChatService } from '../../shared/service/chat.service';

interface RoomWithParticipant extends IRoom {
  participant?: FreelancerEntity;
}
@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
})
export class ChatListComponent implements OnInit {
  @Input() rooms: RoomWithParticipant[] = [];
  @Input() selectedRoomId: string | null | undefined = null;
  @Output() roomSelected = new EventEmitter<RoomWithParticipant>();
  currentRoom: RoomWithParticipant | null = null;

  userId: string = '';
  onlineUsers: string[] = [];

  constructor(
    private roleService: roleService,
    private socketService: SocketService,
    private chatService: ChatService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.roleService.getUserId();
    this.loadRooms();
    this.subscribeToOnlineUsers();
  }

  loadRooms() {
    this.chatService.getRooms(this.userId).subscribe(
      (response: { success: boolean; user: IRoom[]; message: string }) => {
        if (response.success) {
          this.rooms = response.user.map((room) => ({
            ...room,
            participant: undefined,
          }));
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
    this.rooms.forEach((room) => {
      const participantId = this.getOtherParticipant(room.participants);
      this.chatService.getFreelancerById(participantId).subscribe(
        (participant) => {
          room.participant = participant;
          this.changeDetectorRef.detectChanges();
        },
        (error) => {
          console.error('Error loading participant:', error);
        }
      );
    });
  }

  subscribeToOnlineUsers() {
    this.socketService.getOnlineUsers().subscribe((users: string[]) => {
      this.onlineUsers = users;
      this.changeDetectorRef.detectChanges();
    });
  }

  getOtherParticipant(participants: string[]): string {
    return (
      participants.find((participant) => participant !== this.userId) || ''
    );
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.includes(userId);
  }

  onRoomSelect(room: RoomWithParticipant) {
    this.currentRoom = room;
    this.roomSelected.emit(room);
  }
}
