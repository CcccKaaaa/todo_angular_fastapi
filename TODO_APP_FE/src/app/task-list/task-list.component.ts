import { Component } from '@angular/core';

import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../app.todo.service'
import { TaskItem } from '../task-item';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks: TaskItem[] = []
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router) {}


  ngOnInit(): void {
    this.showTasks()
    const taskID = this.route.snapshot.paramMap.get('id');
  }

  newTask() {
    this.router.navigate(['/task-form/create']);
  }

  gotoItems(taskId: number) {
    this.router.navigate(['/task-form', { id: taskId }]);
  }

  showTasks() {
    this.taskService.getTasks().subscribe((response) => {
      this.tasks = response;
    });
  }

  removeTask(task_id: number) {
    this.taskService.removeTask(task_id).subscribe((response) => {
      console.log(response)
      this.showTasks()
    });
  }
}
