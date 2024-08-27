import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from '../overview/overview.component';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, OverviewComponent],
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss',
})
export class LanguageComponent {
  englishProficiency: string = 'Conversational';
  @Output() languagesSelected = new EventEmitter<
    { language: string; proficiency: string }[]
  >();

  languages: { language: string; proficiency: string }[] = [
    { language: 'English', proficiency: 'Fluent' }, // Default language
  ];

  languageOptions: string[] = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
  ]; // Example language options

  showOverview = false;
  addLanguage() {
    this.languages.push({ language: '', proficiency: '' });
  }

  removeLanguage(index: number) {
    this.languages.splice(index, 1);
  }
  onNext() {
    this.languagesSelected.emit(this.languages);
    this.showOverview = true;
  }
  get showFooter(): boolean {
    return !this.showOverview;
  }
}