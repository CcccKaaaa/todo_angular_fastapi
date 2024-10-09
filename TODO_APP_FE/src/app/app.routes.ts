import { Routes } from '@angular/router';

import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';


export const routes: Routes = [
  { path: 'task-form/create', component: TaskFormComponent },
  { path: 'task-form/:id', component: TaskFormComponent },
];
