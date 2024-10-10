import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { take } from 'rxjs';
import { HandlerService } from '../../services/handler.service';
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
  task: TaskItem | null = null


  myTaskForm: FormGroup;

  @Input()
  set id(task_id: string) {
    if (task_id) {
      this.taskService.getTask(task_id).pipe(take(1)).subscribe((response) => {
        this.task = response || null
        if (this.task) {
          this.myTaskForm.disable()
          const task_val = this._parseTaskVal(this.task)
          console.log(this.task.id)
          console.log(task_id)
          this.myTaskForm.setValue(task_val)
        }
      });
    } else {
      this.task = null
      this.myTaskForm.reset()
    }
  }

  _parseTaskVal(task:TaskItem){
    /**
   * Fillter out some value of task should not put in Form.
   * @param {TaskItem} task - The task.
   * @returns {object} - The value to set in Form
   */
    return {
      title: task.title,
      description: task.description,
      due_date: task.due_date,
    }
  }


  eventHandler = inject(HandlerService)
  constructor(private taskService: TaskService,
              private router: Router
  ) {
    this.myTaskForm = new FormGroup({
      title: new FormControl<string>('', Validators.required),
      description: new FormControl<string|null>(null),
      due_date: new FormControl<Date|null>(null),
    });
  }

  onSubmit() {
    const resource = {...this.myTaskForm.value };
    this.taskService.addTask(resource)
    .pipe(take(1)) // Memory leak
      .subscribe({
        next: response => {
          this.myTaskForm.reset();
        }, error: (error) => {
          console.log(error);
        }
      });
    this.eventHandler.updateData();
  }

  editTaskForm(){
    if (this.task) {
      this.myTaskForm.enable()
      const task_val = this._parseTaskVal(this.task)
      this.myTaskForm.setValue(task_val)
    }
  }

  saveTaskForm(){
    this.myTaskForm.disable()
    if (this.task) {
      const task_data = {
        ...this.myTaskForm.value,
        id: this.task.id
      }
      this.taskService.editTask(task_data).pipe(take(1)).subscribe(response => {
        console.log(response)
        this.eventHandler.updateData();
      });

    }
  }
}
