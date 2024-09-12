import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { IJobPost } from '../interfaces/jobPost';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-joblist-view-more-modal',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './joblist-view-more-modal.component.html',
  styleUrls: ['./joblist-view-more-modal.component.scss'],
})
export class JoblistViewMoreModalComponent {
  activeDropdownIndex: number | null = null;

  @Input() jobPost?: IJobPost;
  @Input() index!: number;

  toggleDropdown(index: number) {
    if (this.activeDropdownIndex === index) {
      this.activeDropdownIndex = null;
    } else {
      this.activeDropdownIndex = index;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.activeDropdownIndex = null;
    }
  }
}
