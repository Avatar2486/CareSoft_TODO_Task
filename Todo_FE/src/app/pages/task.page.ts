import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class TaskPage {
  private taskService = inject(TaskService);
  private auth = inject(AuthService);

  tasks: Task[] = [];
  activeStatus: string = 'Open';
  loading = false;
  saving = false;
  error = '';
  selectedTask: Task | null = null;

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.error = '';

    this.taskService.getTasks(this.activeStatus).subscribe({
      next: (items) => {
        this.tasks = items;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load tasks. Try again.';
        this.loading = false;
      }
    });
  }

  createTask(payload: { title: string; description: string; status: string }) {
    this.saving = true;
    this.error = '';

    this.taskService.createTask(payload).subscribe({
      next: () => {
        this.selectedTask = null;
        this.saving = false;
        this.loadTasks();
      },
      error: () => {
        this.error = 'Unable to create task.';
        this.saving = false;
      }
    });
  }

  editTask(task: Task) {
    this.selectedTask = task;
  }

  cancelEdit() {
    this.selectedTask = null;
  }

  saveTask(payload: { title: string; description: string; status: string }) {
    if (!this.selectedTask) {
      this.createTask(payload);
      return;
    }

    this.saving = true;
    this.taskService.updateTask(this.selectedTask.id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.selectedTask = null;
        this.loadTasks();
      },
      error: () => {
        this.error = 'Unable to update task.';
        this.saving = false;
      }
    });
  }

  removeTask(task: Task) {
    const confirmed = confirm('Delete this task?');
    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(task.id).subscribe({
      next: () => this.loadTasks(),
      error: () => {
        this.error = 'Unable to remove task.';
      }
    });
  }

  changeFilter(status: string) {
    this.activeStatus = status;
    this.loadTasks();
  }

  get username() {
    return this.auth.user()?.username ?? 'User';
  }
}
