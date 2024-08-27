import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-duration-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-duration-modal.component.html',
  styleUrl: './edit-duration-modal.component.scss',
})
export class EditDurationModalComponent {
  isDurationModalOpen = false;
  @Input() selectedDuration: string = '';
  @Output() durationSaved = new EventEmitter<string>();

  openModal() {
    this.isDurationModalOpen = true;
  }

  closeModal() {
    this.isDurationModalOpen = false;
  }

  saveDuration() {
    console.log('Duration saved:', this.selectedDuration);
    this.durationSaved.emit(this.selectedDuration); // Emit the updated duration
    this.closeModal();
  }
}
