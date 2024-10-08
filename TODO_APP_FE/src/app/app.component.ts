import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { TodoService } from './app.todo.service'
import { FormsModule, ReactiveFormsModule} from '@angular/forms'

interface Task {
  id: string;
  name: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'todo';
  tasks:any = []
  newTask: string = '';
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.showTasks()
  }

  showTasks() {
    this.todoService.getTasks().subscribe((response) => {
      this.tasks = response;
    });
  }

  addTask() {
    this.newTask = this.newTask.trim()
    if (this.newTask) {
      this.todoService.addTask(this.newTask).subscribe((response) => {
        this.showTasks()
      });
      this.newTask = '';
    }
  }

  removeTask(task_id: number) {
    this.todoService.removeTask(task_id).subscribe((response) => {
      this.showTasks()
    });
  }
}
