import { Routes } from '@angular/router';

import { TaskFormComponent } from './task-form/task-form.component';


export const routes: Routes = [
  {
    path: 'task-form/create',
    title: 'Todo-App: Create',
    component: TaskFormComponent
  },
  {
    path: 'task-form/:id',
    title: 'Todo-App: Form',
    component: TaskFormComponent
  },
];
