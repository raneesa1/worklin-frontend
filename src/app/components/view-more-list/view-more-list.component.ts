import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ListItem {
  id: number;
  content: string;
  priority: 'low' | 'medium' | 'high';
}
@Component({
  selector: 'app-view-more-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './view-more-list.component.html',
  styleUrl: './view-more-list.component.scss',
})
export class ViewMoreListComponent implements OnInit{
  listItems: ListItem[] = [];
  displayedListItems: ListItem[] = [];
  newItemContent: string = '';
  newItemPriority: 'low' | 'medium' | 'high' = 'medium';
  showAllItems: boolean = false;

  ngOnInit(): void {
    this.loadListItems();
  }

  loadListItems(): void {
     this.listItems = [
      // { id: 1, content: 'Meeting with candidate at 3pm', priority: 'high' },
      // {
      //   id: 2,
      //   content: 'Extend premium plan for next month',
      //   priority: 'medium',
      // },
      // { id: 3, content: 'Review new applicants', priority: 'low' },
      // { id: 4, content: 'Prepare quarterly report', priority: 'high' },
      // { id: 5, content: 'Team building event planning', priority: 'medium' },
    ];
    this.updateDisplayedItems();
  }

  updateDisplayedItems(): void {
    this.displayedListItems = this.listItems.slice(0, 3);
  }

  addListItem(): void {
    if (this.newItemContent.trim()) {
      const newItem: ListItem = {
        id: this.listItems.length + 1,
        content: this.newItemContent,
        priority: this.newItemPriority,
      };
      this.listItems.push(newItem);
      this.updateDisplayedItems();
      this.newItemContent = '';
      this.newItemPriority = 'medium';
    }
  }

  removeListItem(id: number): void {
    this.listItems = this.listItems.filter((item) => item.id !== id);
    this.updateDisplayedItems();
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return '';
    }
  }

  toggleAllItems(): void {
    this.showAllItems = !this.showAllItems;
  }
}
