import { Component, Input, output } from '@angular/core';
import { TaskItem } from '../task-item'

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  editable = false;
  removeTask = output<number>()
  @Input() task!: TaskItem;

  saveItem(description: string) {
    if (!description) return;

    this.editable = false;
    this.task.description = description;
  }

  removeTaskItem(taskId:number) {
    this.removeTask.emit(taskId)
  }
}
