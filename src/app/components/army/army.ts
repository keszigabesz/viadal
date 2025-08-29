import { Component, input } from '@angular/core';

@Component({
  selector: 'app-army',
  imports: [],
  templateUrl: './army.html',
  styleUrl: './army.scss'
})
export class Army {
  strength = input.required<number>();
  owner = input.required<'ott' | 'hun'>();
}
