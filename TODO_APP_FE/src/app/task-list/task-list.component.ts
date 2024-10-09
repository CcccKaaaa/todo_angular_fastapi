import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../app.todo.service'
import { TaskItem } from '../task-item';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks: TaskItem[] = []
  showCompleted: boolean = true

  constructor(
    private taskService: TaskService,
    private router: Router) {}


  ngOnInit(): void {
    this.showTasks()
  }

  newTask() {
    this.router.navigate(['/task-form/create']);
  }

  gotoItems(taskId: number) {
    this.router.navigate(['/task-form', { id: taskId }]);
  }

  showTasks() {
    this.taskService.getTasks(this.showCompleted).subscribe((response) => {
      this.tasks = response;
    });
  }

  removeTask(task_id: number) {
    this.taskService.removeTask(task_id).subscribe((response) => {
      this.showTasks()
      this.router.navigate(['/task-form/create']);
    });
  }

  toggleTask(task: any) {
    console.log(task)
    this.taskService.editTask(task).subscribe((response) => {
      console.log(response)
      this.showTasks()
    });
  }

  toggleShowComplete() {
    this.showCompleted = ! this.showCompleted
    this.showTasks()
  }
}
