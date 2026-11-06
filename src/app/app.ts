import { Component, signal } from '@angular/core';
import { ProgressNotes } from './project-handler/project-handler';

@Component({
  imports: [ProgressNotes],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('project-info');
}
