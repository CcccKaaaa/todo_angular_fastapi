import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { TaskItem, CreateTaskItem } from './task-item';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  APIURL = "http://localhost:8000/api/";

  // JSON headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // Function to handle JSON requests and errors
  private makeJsonRequest<T>(method: string, url: string, body?: any): Observable<T> {
    let httpCall: Observable<T>;

    // Make the appropriate HTTP call based on the method
    if (method === 'GET') {
      httpCall = this.http.get<T>(url, this.httpOptions);
    } else if (method === 'POST') {
      httpCall = this.http.post<T>(url, JSON.stringify(body), this.httpOptions);
    } else {
      throw new Error('Unsupported HTTP method');
    }

    // Apply error handling
    return httpCall.pipe(
      catchError(this.handleError)
    );
  }

  getTasks(taskfilter: string): Observable<TaskItem[]> {
    return this.makeJsonRequest<TaskItem[]>('GET', this.APIURL + 'get-tasks/?' + taskfilter);
  }

  addTask(newTask: CreateTaskItem): Observable<TaskItem> {
    return this.makeJsonRequest<TaskItem>('POST', `${this.APIURL}add-task`, newTask);
  }

  removeTask(task_id: number): Observable<any> {
    return this.makeJsonRequest<any>('POST', `${this.APIURL}remove-task`, {task_id: task_id});
  }

  editTask(task: TaskItem): Observable<TaskItem> {
    return this.makeJsonRequest<TaskItem>('POST', `${this.APIURL}edit-task`, task);
  }

  // Centralized error handler
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
