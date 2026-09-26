import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Transaction {
  _id?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  isRecurring?: boolean;
  recurrenceInterval?: 'daily' | 'weekly' | 'monthly' | null;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(filters: any = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.http.get<Transaction[]>(`${this.apiUrl}${params ? '?' + params : ''}`);
  }

  createTransaction(tx: Transaction) {
    return this.http.post<Transaction>(this.apiUrl, tx);
  }

  updateTransaction(id: string, tx: Partial<Transaction>) {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, tx);
  }

  deleteTransaction(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCategoryBreakdown(month: number, year: number) {
    return this.http.get<{ _id: string; total: number }[]>(
      `${this.apiUrl}/analytics/category-breakdown?month=${month}&year=${year}`
    );
  }

  getMonthlyTrend() {
    return this.http.get<{ _id: { month: number; year: number; type: string }; total: number }[]>(
      `${this.apiUrl}/analytics/monthly-trend`
    );
  }

  getSummary(month: number, year: number) {
    return this.http.get<{ income: number; expense: number; balance: number }>(
      `${this.apiUrl}/analytics/summary?month=${month}&year=${year}`
    );
  }
}
