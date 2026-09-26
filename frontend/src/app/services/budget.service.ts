import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface BudgetStatus {
  category: string;
  limit: number;
  spent: number;
  percentUsed: number;
  status: 'ok' | 'warning' | 'over';
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private apiUrl = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  setBudget(category: string, monthlyLimit: number, month: number, year: number) {
    return this.http.post(this.apiUrl, { category, monthlyLimit, month, year });
  }

  getBudgetStatus(month: number, year: number) {
    return this.http.get<BudgetStatus[]>(`${this.apiUrl}/status?month=${month}&year=${year}`);
  }
}
