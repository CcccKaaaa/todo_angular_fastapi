import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../app.todo.service'
import { TaskItem } from '../task-item';
import { HandlerService } from '../../services/handler.service';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent, FormsModule, NgFor,NgIf],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks: TaskItem[] = []

  showCompleted: boolean = true
  ascendingDueDate: boolean | null = null
  query: string = ''
  eventHandler = inject(HandlerService)
  destroy$ = inject(DestroyRef)
  constructor(
    private taskService: TaskService,
    private router: Router) {}


  ngOnInit(): void {
    this.showTasks()
    this.eventHandler.datachange.pipe(takeUntilDestroyed(this.destroy$))
    .subscribe(() => this.showTasks())
  }

  newTask() {
    this.router.navigate(['/task-form/create']);
  }

  gotoItems(taskId: number) {
    this.router.navigate(['/task-form', { id: taskId }]);
  }

  showTasks() {
    const taskSearchParam = this._prepareTaskSearchParam(this.showCompleted, this.query)
    this.taskService.getTasks(taskSearchParam).pipe(take(1))
    .subscribe((response) => {
      this.tasks = response;
    });
  }

  _prepareTaskSearchParam(showCompleted: boolean, q: string) {
    let taskSearchParam = "";
    if (!showCompleted) {
      taskSearchParam += "&showCompleted=false";
    }
    if (q) {
      taskSearchParam += `&q=${q}`
    }
    if (this.ascendingDueDate === false) {
      taskSearchParam += `&order=due_date desc`
    } else if (this.ascendingDueDate) {
      taskSearchParam += `&order=due_date asc`
    }
    return taskSearchParam
  }

  removeTask(task_id: number) {
    this.taskService.removeTask(task_id).pipe(take(1)).subscribe((response) => {
      this.showTasks()
      this.router.navigate(['/']);
    });
  }

  toggleShowComplete() {
    this.showCompleted = ! this.showCompleted
    this.showTasks()
  }

  keyUpSearchBox(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.showTasks()
    }
  }

  clearSearchFilter() {
    this.query = ''
    this.showTasks()
  }

  sortByDueDate() {
    this.ascendingDueDate = ! this.ascendingDueDate
    this.showTasks()
  }

}
