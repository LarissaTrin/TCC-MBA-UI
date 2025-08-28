import { Component, signal } from '@angular/core';
import { Sidebar, Toolbar } from './shared';

@Component({
  selector: 'app-root',
  imports: [Sidebar, Toolbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Front-end');
}
