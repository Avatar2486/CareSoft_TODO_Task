import { Routes } from '@angular/router';
import { LoginPage } from './pages/login.page';
import { SignupPage } from './pages/signup.page';
import { TaskPage } from './pages/task.page';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'signup', component: SignupPage },
  { path: 'tasks', component: TaskPage, canActivate: [authGuard] },
  { path: '**', redirectTo: 'tasks' }
];
