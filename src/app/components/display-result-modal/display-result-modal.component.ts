import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-display-result-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-result-modal.component.html',
  styleUrl: './display-result-modal.component.scss',
})
export class DisplayResultModalComponent {
  @Input() status!: 'success' | 'fail' | 'info'; // Different status options
  @Input() message!: string; // Dynamic message to display
  displayResultModal: boolean = true;
  @Output() closed = new EventEmitter<void>();
  closeModal(): void {
    this.closed.emit();
    this.displayResultModal = false;
  }
}
