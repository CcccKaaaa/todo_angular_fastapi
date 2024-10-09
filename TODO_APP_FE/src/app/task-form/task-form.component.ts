import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { TaskService } from '../app.todo.service';
import { TaskItem } from '../task-item';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  myTaskForm: FormGroup;

  constructor(private taskService: TaskService,) {
    this.myTaskForm = new FormGroup({
      title: new FormControl<string>('', Validators.required),
      description: new FormControl<string|null>(null),
      due_date: new FormControl<Date|null>(null)
    });
  }

  onSubmit() {
    let resource = this.myTaskForm.value as TaskItem;
    this.myTaskForm.reset();
    this.taskService.addTask(resource).subscribe(response => console.log(response));
  }
}
