import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  selectedDate: number | null = null;
  DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  years: number[] = [];
  no_of_days: number[] = [];
  blankdays: number[] = [];
  showDatepicker = false;
  datepickerValue = 'Select date'; // Default text
  month!: number;
  year!: number;
  minYear!: number;
  maxYear!: number;

  constructor() {}

  ngOnInit(): void {
    this.initDate();
    this.getNoOfDays();
    this.generateYearOptions();
  }

  initDate() {
    // Set default year to 2000 and random month and date internally
    this.year = 2000;
    this.month = Math.floor(Math.random() * 12); // Random month
    const today = new Date(this.year, this.month);
    const randomDay =
      Math.floor(
        Math.random() * new Date(this.year, this.month + 1, 0).getDate()
      ) + 1;
    // No need to update datepickerValue here since it should display 'Select date'
  }

  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = 1900; // Adjust the range as needed
    this.years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i
    );
    this.minYear = Math.min(...this.years);
    this.maxYear = Math.max(...this.years);
  }

  isToday(date: number) {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString();
  }

  getDateValue(date: number) {
    const selectedDate = new Date(this.year, this.month, date);
    this.datepickerValue = selectedDate.toDateString();
    this.selectedDate = date;
    this.showDatepicker = false;
  }

  getNoOfDays() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const dayOfWeek = new Date(this.year, this.month).getDay();

    this.blankdays = Array(dayOfWeek)
      .fill(0)
      .map((_, i) => i + 1);
    this.no_of_days = Array(daysInMonth)
      .fill(0)
      .map((_, i) => i + 1);
  }

  changeMonth(event: any) {
    this.month = parseInt(event.target.value, 10);
    this.getNoOfDays();
  }

  changeYear(offset: number) {
    this.year += offset;
    this.getNoOfDays();
  }

  trackByIdentity(index: number, item: any) {
    return item;
  }
}
