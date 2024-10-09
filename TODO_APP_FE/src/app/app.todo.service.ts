import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskItem, CreateTaskItem } from './task-item';


@Injectable({providedIn: 'root'})
export class TaskService {
  APIURL = "http://localhost:8000/"
  constructor(private http: HttpClient) {
  }

  getTasks() {
    return this.http.get<TaskItem[]>(this.APIURL + "get-tasks",);
  }

  addTask(newTask: CreateTaskItem) {
    return this.http.post<TaskItem>(this.APIURL + "add-task", newTask);
  }

  removeTask(task_id: number) {
    let body = new FormData();
    body.append('task_id', task_id.toString());
    return this.http.post(this.APIURL + "remove-task", body);
  }
}
