import { Component, Input, output } from '@angular/core';
import { TaskItem } from '../task-item'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  editable = false;
  removeTask = output<number>();
  toggleTask = output<TaskItem>();
  @Input() task!: TaskItem;

  saveItem(description: string) {
    if (!description) return;

    this.editable = false;
    this.task.description = description;
  }

  removeTaskItem(taskId: number) {
    this.removeTask.emit(taskId);
  }

  toggleTaskItem(taskId: number, completed: boolean) {
    const task = {id: taskId, completed: completed} as TaskItem;
    this.toggleTask.emit(task);
  }
}
