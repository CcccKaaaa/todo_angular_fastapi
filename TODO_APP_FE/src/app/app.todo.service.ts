import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskItem, CreateTaskItem } from './task-item';


@Injectable({providedIn: 'root'})
export class TaskService {
  APIURL = "http://localhost:8000/"
  constructor(private http: HttpClient) {
  }

  getTasks(showCompleted:boolean) {
    let endPoint = this.APIURL + "get-tasks/"
    if (!showCompleted) {
      endPoint += "?showCompleted=false"
    }
    return this.http.get<TaskItem[]>(endPoint);
  }

  getTask(task_id: string) {
    return this.http.get<TaskItem>(this.APIURL + "get-task" + "/?id=" + task_id);
  }

  addTask(newTask: CreateTaskItem) {
    return this.http.post<TaskItem>(this.APIURL + "add-task", newTask);
  }

  removeTask(task_id: number) {
    return this.http.post(this.APIURL + "remove-task", {id: task_id});
  }

  editTask(task: TaskItem) {
    return this.http.post(this.APIURL + "edit-task", task);
  }
}
