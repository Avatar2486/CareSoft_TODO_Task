import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TaskService } from '../task.service';
import { AuthService } from '../auth.service';
import { Task } from '../models';
import { TaskFormComponent } from '../components/task-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  selector: 'task-page',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.css']
})
export class TaskPage implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private auth = inject(AuthService);

  tasks = signal<Task[]>([]);
  activeStatus = signal('All');
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  selectedTask = signal<Task | null>(null);
  private taskSub?: Subscription;

  ngOnInit() {
    this.loadTasks(true);
  }

  ngOnDestroy() {
    this.taskSub?.unsubscribe();
  }

  loadTasks(forceAll = false) {
    if (forceAll) {
      this.activeStatus.set('All');
    }

    this.loading.set(true);
    this.error.set('');
    this.tasks.set([]);

    this.taskSub?.unsubscribe();
    this.taskSub = this.taskService.getTasks(this.activeStatus()).subscribe({
      next: (data) => {
        this.tasks.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load tasks. Try again.');
        this.loading.set(false);
      }
    });
  }

  refreshTasks() {
    this.selectedTask.set(null);
    this.loadTasks(true);
  }

  createTask(payload: { title: string; description: string; status: string }) {
    this.saving.set(true);
    this.error.set('');

    this.taskService.createTask(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.refreshTasks();
      },
      error: () => {
        this.error.set('Unable to create task.');
        this.saving.set(false);
      }
    });
  }

  editTask(task: Task) {
    this.selectedTask.set(task);
  }

  cancelEdit() {
    this.selectedTask.set(null);
  }

  saveTask(payload: { title: string; description: string; status: string }) {
    if (!this.selectedTask()) {
      this.createTask(payload);
      return;
    }

    this.saving.set(true);
    this.taskService.updateTask(this.selectedTask()!.id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.refreshTasks();
      },
      error: () => {
        this.error.set('Unable to update task.');
        this.saving.set(false);
      }
    });
  }

  removeTask(task: Task) {
    const confirmed = confirm('Delete this task?');
    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(task.id).subscribe({
      next: () => this.refreshTasks(),
      error: () => {
        this.error.set('Unable to remove task.');
      }
    });
  }

  changeFilter(status: string) {
    this.activeStatus.set(status);
    this.loadTasks();
  }

  get username() {
    return this.auth.user()?.username ?? 'User';
  }
}
