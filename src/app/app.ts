import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Board } from './components/board/board';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Board],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('viadal');
}
