import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-address-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-address-modal.component.html',
  styleUrl: './edit-address-modal.component.scss',
})
export class EditAddressModalComponent {
  @Input() address: any = {}; // Receive the address object from the parent component
  @Output() addressUpdated = new EventEmitter<any>();

  isAddressModalOpen = false;

  openModal() {
    this.isAddressModalOpen = true;
  }

  closeModal() {
    this.isAddressModalOpen = false;
  }

  saveChanges() {
    // Emit the updated address data back to the parent component
    this.addressUpdated.emit(this.address);
    this.closeModal();
  }
}
