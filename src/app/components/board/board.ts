import { Component } from '@angular/core';
import { Map } from './map/map';
import { Menu } from './menu/menu';

@Component({
  selector: 'app-board',
  imports: [Map, Menu],
  templateUrl: './board.html',
  styleUrl: './board.scss'
})
export class Board {

}
