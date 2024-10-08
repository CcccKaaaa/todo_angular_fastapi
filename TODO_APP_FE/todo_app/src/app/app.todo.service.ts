import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class TodoService {
  APIURL = "http://localhost:8000/"
  constructor(private http: HttpClient) {
  }

  getTasks() {
    return this.http.get(this.APIURL + "get-tasks");
  }

  addTask(newTask: string) {
    let body = new FormData();
    body.append('task_name', newTask);
    return this.http.post(this.APIURL + "add-task", body);
  }

  removeTask(task_id: number) {
    let body = new FormData();
    body.append('task_id', task_id.toString());
    return this.http.post(this.APIURL + "remove-task", body);
  }
}
