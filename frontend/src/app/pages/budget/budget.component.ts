import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { BudgetService, BudgetStatus } from '../../services/budget.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <h1>Monthly Budgets</h1>

      <form class="budget-form" (ngSubmit)="onSubmit()">
        <input type="text" [(ngModel)]="category" name="category" placeholder="Category (e.g. Food)" required />
        <input type="number" [(ngModel)]="limit" name="limit" placeholder="Monthly limit" required min="0" step="0.01" />
        <button type="submit">Set Budget</button>
      </form>

      <div class="budget-list" *ngIf="statuses.length; else emptyState">
        <div class="budget-item" *ngFor="let b of statuses">
          <div class="row">
            <strong>{{ b.category }}</strong>
            <span [class.over]="b.status === 'over'" [class.warning]="b.status === 'warning'">
              ₹{{ b.spent }} / ₹{{ b.limit }}
            </span>
          </div>
          <div class="progress-bar">
            <div class="fill" [class.over]="b.status === 'over'" [class.warning]="b.status === 'warning'"
                 [style.width.%]="b.percentUsed > 100 ? 100 : b.percentUsed"></div>
          </div>
          <span class="pct-label" *ngIf="b.status === 'over'">⚠ Over budget</span>
          <span class="pct-label warning-text" *ngIf="b.status === 'warning'">Approaching limit ({{ b.percentUsed }}%)</span>
        </div>
      </div>
      <ng-template #emptyState><p class="empty">No budgets set for this month yet.</p></ng-template>
    </div>
  `,
  styles: [`
    .container { max-width: 700px; margin: 0 auto; padding: 28px; }
    h1 { color: #1e293b; }
    .budget-form { display: flex; gap: 10px; background: white; padding: 18px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); margin-bottom: 24px; }
    .budget-form input { flex: 1; padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; }
    .budget-form button { padding: 9px 18px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; }
    .budget-item { background: white; padding: 16px 18px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.95rem; }
    .row span.over { color: #dc2626; font-weight: 600; }
    .row span.warning { color: #f59e0b; font-weight: 600; }
    .progress-bar { background: #f1f5f9; height: 10px; border-radius: 6px; overflow: hidden; }
    .fill { height: 100%; background: #16a34a; transition: width 0.3s; }
    .fill.warning { background: #f59e0b; }
    .fill.over { background: #dc2626; }
    .pct-label { display: inline-block; margin-top: 6px; font-size: 0.8rem; color: #dc2626; }
    .pct-label.warning-text { color: #f59e0b; }
    .empty { color: #94a3b8; text-align: center; padding: 30px; }
  `]
})
export class BudgetComponent implements OnInit {
  category = '';
  limit: number | null = null;
  statuses: BudgetStatus[] = [];

  constructor(private budgetService: BudgetService) {}

  ngOnInit() {
    this.loadStatuses();
  }

  loadStatuses() {
    const now = new Date();
    this.budgetService.getBudgetStatus(now.getMonth() + 1, now.getFullYear()).subscribe(data => this.statuses = data);
  }

  onSubmit() {
    if (!this.limit) return;
    const now = new Date();
    this.budgetService.setBudget(this.category, this.limit, now.getMonth() + 1, now.getFullYear()).subscribe(() => {
      this.category = '';
      this.limit = null;
      this.loadStatuses();
    });
  }
}
