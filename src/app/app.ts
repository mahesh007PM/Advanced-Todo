import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Todos } from './components/todos/todos';

@Component({
  selector: 'app-root',
  imports: [Todos, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
