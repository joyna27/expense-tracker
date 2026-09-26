import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <form class="auth-card" (ngSubmit)="onSubmit()">
        <h2>Create account</h2>
        <p class="sub">Start tracking your expenses</p>

        <label>Name</label>
        <input type="text" [(ngModel)]="name" name="name" required placeholder="Your name" />

        <label>Email</label>
        <input type="email" [(ngModel)]="email" name="email" required placeholder="you@example.com" />

        <label>Password</label>
        <input type="password" [(ngModel)]="password" name="password" required minlength="6" placeholder="At least 6 characters" />

        <div class="error" *ngIf="error">{{ error }}</div>

        <button type="submit" [disabled]="loading">{{ loading ? 'Creating...' : 'Sign Up' }}</button>

        <p class="switch">Already have an account? <a routerLink="/login">Log in</a></p>
      </form>
    </div>
  `,
  styles: [`
    .auth-wrap { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f1f5f9; }
    .auth-card { background: white; padding: 36px; border-radius: 12px; width: 340px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    h2 { margin: 0 0 4px; color: #1e293b; }
    .sub { color: #64748b; font-size: 0.9rem; margin-bottom: 20px; }
    label { display: block; font-size: 0.85rem; color: #334155; margin: 12px 0 4px; }
    input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 0.95rem; }
    button { width: 100%; margin-top: 20px; padding: 11px; background: #4f46e5; color: white; border: none; border-radius: 6px; font-size: 0.95rem; cursor: pointer; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    button:hover:not(:disabled) { background: #4338ca; }
    .error { color: #dc2626; font-size: 0.85rem; margin-top: 10px; }
    .switch { text-align: center; font-size: 0.85rem; margin-top: 16px; color: #64748b; }
    .switch a { color: #4f46e5; text-decoration: none; }
  `]
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.auth.signup(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Signup failed';
        this.loading = false;
      }
    });
  }
}
