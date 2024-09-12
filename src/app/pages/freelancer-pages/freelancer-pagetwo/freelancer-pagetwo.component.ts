import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-freelancer-pagetwo',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './freelancer-pagetwo.component.html',
  styleUrl: './freelancer-pagetwo.component.scss',
})
export class FreelancerPagetwoComponent {
  constructor(private router: Router) {}
  @Output() goalSelected = new EventEmitter<string>();

  selected: boolean = false;
  goal: string | null = null;
  selectGoal(goal: string) {
    this.goal = goal;
    this.selected = true;
    this.router.navigate(['freelancer/create-account-resume']);
    this.goalSelected.emit(this.goal);
    console.log(`Freelancing goal selected: ${this.goal}`);
  }
  isSelected(){
    this.selected = true
  }
}
