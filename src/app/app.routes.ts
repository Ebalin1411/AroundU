import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    providers: [
      provideHttpClient(),
      ReactiveFormsModule,
      FormsModule,
      CommonModule,
    ],
  },
];
