import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'signup-page',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.css']
})
export class SignupPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loading = false;
  error = '';

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.signup(this.form.value as { username: string; email: string; password: string }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = err?.error?.detail || 'Unable to sign up right now.';
        this.loading = false;
      }
    });
  }
}
