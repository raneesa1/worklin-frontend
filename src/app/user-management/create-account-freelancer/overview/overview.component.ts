import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  @Input() languages: { language: string; proficiency: string }[] = [];
  @ViewChild('bio') bioTextArea!: ElementRef;

  getDescription(): void {
    console.log('Bio content:', this.bioTextArea.nativeElement.value);
  }
}
