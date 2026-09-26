import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Transaction, TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <h1>Transactions</h1>

      <form class="tx-form" (ngSubmit)="onSubmit()">
        <select [(ngModel)]="form.type" name="type" required>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input type="number" [(ngModel)]="form.amount" name="amount" placeholder="Amount" required min="0" step="0.01" />
        <input type="text" [(ngModel)]="form.category" name="category" placeholder="Category (e.g. Food)" required />
        <input type="text" [(ngModel)]="form.description" name="description" placeholder="Description (optional)" />
        <input type="date" [(ngModel)]="form.date" name="date" required />

        <label class="recurring-check">
          <input type="checkbox" [(ngModel)]="form.isRecurring" name="isRecurring" />
          Recurring
        </label>
        <select *ngIf="form.isRecurring" [(ngModel)]="form.recurrenceInterval" name="recurrenceInterval">
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>

        <button type="submit">{{ editingId ? 'Update' : 'Add' }} Transaction</button>
        <button type="button" class="cancel" *ngIf="editingId" (click)="resetForm()">Cancel</button>
      </form>

      <table class="tx-table" *ngIf="transactions.length; else emptyState">
        <thead>
          <tr><th>Date</th><th>Type</th><th>Category</th><th>Description</th><th>Amount</th><th></th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let tx of transactions">
            <td>{{ tx.date | date:'mediumDate' }}</td>
            <td><span class="badge" [class.income]="tx.type === 'income'" [class.expense]="tx.type === 'expense'">{{ tx.type }}</span></td>
            <td>{{ tx.category }}</td>
            <td>{{ tx.description || '—' }}</td>
            <td [class.income-text]="tx.type === 'income'" [class.expense-text]="tx.type === 'expense'">₹{{ tx.amount }}</td>
            <td class="actions">
              <button (click)="edit(tx)">Edit</button>
              <button class="danger" (click)="remove(tx._id!)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <ng-template #emptyState><p class="empty">No transactions yet. Add your first one above.</p></ng-template>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 0 auto; padding: 28px; }
    h1 { color: #1e293b; }
    .tx-form { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; background: white; padding: 18px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); margin-bottom: 24px; }
    .tx-form input, .tx-form select { padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; }
    .recurring-check { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; color: #334155; }
    .tx-form button { padding: 9px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; background: #4f46e5; color: white; }
    .tx-form button.cancel { background: #94a3b8; }
    .tx-table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
    .tx-table th, .tx-table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
    .tx-table th { background: #f8fafc; color: #64748b; font-weight: 600; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; text-transform: capitalize; }
    .badge.income { background: #dcfce7; color: #16a34a; }
    .badge.expense { background: #fee2e2; color: #dc2626; }
    .income-text { color: #16a34a; font-weight: 600; }
    .expense-text { color: #dc2626; font-weight: 600; }
    .actions button { padding: 5px 10px; margin-right: 6px; border: none; border-radius: 5px; cursor: pointer; font-size: 0.82rem; background: #e2e8f0; }
    .actions button.danger { background: #fee2e2; color: #dc2626; }
    .empty { color: #94a3b8; text-align: center; padding: 30px; }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  editingId: string | null = null;

  form: Transaction = {
    type: 'expense',
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    isRecurring: false,
    recurrenceInterval: null
  };

  constructor(private txService: TransactionService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.txService.getTransactions().subscribe(data => this.transactions = data);
  }

  onSubmit() {
    if (this.form.isRecurring && !this.form.recurrenceInterval) {
      this.form.recurrenceInterval = 'monthly';
    }

    const action = this.editingId
      ? this.txService.updateTransaction(this.editingId, this.form)
      : this.txService.createTransaction(this.form);

    action.subscribe(() => {
      this.loadTransactions();
      this.resetForm();
    });
  }

  edit(tx: Transaction) {
    this.editingId = tx._id!;
    this.form = { ...tx, date: tx.date.slice(0, 10) };
  }

  remove(id: string) {
    if (!confirm('Delete this transaction?')) return;
    this.txService.deleteTransaction(id).subscribe(() => this.loadTransactions());
  }

  resetForm() {
    this.editingId = null;
    this.form = {
      type: 'expense',
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      isRecurring: false,
      recurrenceInterval: null
    };
  }
}
