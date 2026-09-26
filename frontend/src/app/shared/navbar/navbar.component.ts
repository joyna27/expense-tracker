import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="brand">💰 ExpenseTracker</div>
      <div class="links">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/transactions" routerLinkActive="active">Transactions</a>
        <a routerLink="/budget" routerLinkActive="active">Budget</a>
      </div>
      <div class="user-area">
        <span>{{ auth.getUser()?.name }}</span>
        <button (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 28px; background: #1e293b; color: white;
    }
    .brand { font-weight: 700; font-size: 1.1rem; }
    .links { display: flex; gap: 20px; }
    .links a { color: #cbd5e1; text-decoration: none; font-size: 0.95rem; }
    .links a.active, .links a:hover { color: white; }
    .user-area { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; }
    .user-area button {
      background: #ef4444; color: white; border: none; padding: 6px 14px;
      border-radius: 6px; cursor: pointer; font-size: 0.85rem;
    }
    .user-area button:hover { background: #dc2626; }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
