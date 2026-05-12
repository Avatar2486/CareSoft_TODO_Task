import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Task, TaskCreatePayload, TaskUpdatePayload } from './models';

const API_BASE = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  getTasks(status?: string): Observable<Task[]> {
    let params = new HttpParams();
    if (status && status !== 'All') {
      params = params.set('status', status);
    }
    return this.http.get<Task[]>(`${API_BASE}/tasks`, {
      params,
      headers: this.auth.authHeader
    });
  }

  createTask(payload: TaskCreatePayload): Observable<Task> {
    return this.http.post<Task>(`${API_BASE}/tasks`, payload, {
      headers: this.auth.authHeader
    });
  }

  updateTask(taskId: number, payload: TaskUpdatePayload): Observable<Task> {
    return this.http.put<Task>(`${API_BASE}/task/${taskId}`, payload, {
      headers: this.auth.authHeader
    });
  }

  deleteTask(taskId: number) {
    return this.http.delete<void>(`${API_BASE}/task/${taskId}`, {
      headers: this.auth.authHeader
    });
  }
}
