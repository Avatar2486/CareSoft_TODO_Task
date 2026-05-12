import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskFormValue } from '../models';

@Component({
  selector: 'task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Input() task: Task | null = null;
  @Input() pending = false;
  @Input() submitLabel = 'Save task';
  @Output() save = new EventEmitter<TaskFormValue>();
  @Output() cancel = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['Open', [Validators.required]]
  });

  ngOnChanges() {
    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status
      });
    } else {
      this.form.reset({ title: '', description: '', status: 'Open' });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value as TaskFormValue);
  }
}
