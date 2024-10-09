import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {  Router } from '@angular/router';

import { TaskService } from '../app.todo.service';
import { CreateTaskItem, TaskItem } from '../task-item';

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
      this.taskService.getTask(task_id).subscribe((response) => {
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
    return {
      title: task.title,
      description: task.description,
      due_date: task.due_date,
    }
  }

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
    let resource = this.myTaskForm.value as CreateTaskItem;
    this.myTaskForm.reset();
    this.taskService.addTask(resource).subscribe(response => console.log(response));
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
      this.taskService.editTask(task_data).subscribe(response => console.log(response));
      this.router.navigate(['/']);
    }
  }
}
