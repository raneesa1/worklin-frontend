import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { RateComponent } from '../rate/rate.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterModule, CommonModule, RateComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  @Input() languages: { language: string; proficiency: string }[] = [];
  @ViewChild('bio') bioTextArea!: ElementRef;
  rate = false;
  bioContent = '';
  showError = false;
  getDescription(): void {
    this.bioContent = this.bioTextArea.nativeElement.value;
    this.rate = true;
    console.log('Bio content:', this.bioTextArea.nativeElement.value);
  }
  validateAndProceed(): void {
    if (this.bioTextArea.nativeElement.value.trim() === '') {
      this.showError = true;
    } else {
      this.getDescription();
    }
  }

  hideError(): void {
    this.showError = false;
  }
}
