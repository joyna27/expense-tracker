import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { TransactionService } from '../../services/transaction.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <h1>Dashboard</h1>

      <div class="summary-cards">
        <div class="card income">
          <span class="label">Income (this month)</span>
          <span class="value">₹{{ summary.income | number:'1.0-0' }}</span>
        </div>
        <div class="card expense">
          <span class="label">Expenses (this month)</span>
          <span class="value">₹{{ summary.expense | number:'1.0-0' }}</span>
        </div>
        <div class="card balance">
          <span class="label">Balance</span>
          <span class="value">₹{{ summary.balance | number:'1.0-0' }}</span>
        </div>
      </div>

      <div class="charts-row">
        <div class="chart-box">
          <h3>Spending by Category</h3>
          <canvas #categoryChart></canvas>
          <p class="empty" *ngIf="!hasCategoryData">No expense data yet for this month.</p>
        </div>
        <div class="chart-box">
          <h3>Income vs Expense Trend</h3>
          <canvas #trendChart></canvas>
          <p class="empty" *ngIf="!hasTrendData">No transactions yet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1100px; margin: 0 auto; padding: 28px; }
    h1 { color: #1e293b; margin-bottom: 20px; }
    .summary-cards { display: flex; gap: 16px; margin-bottom: 28px; }
    .card { flex: 1; padding: 20px; border-radius: 10px; color: white; display: flex; flex-direction: column; gap: 6px; }
    .card.income { background: #16a34a; }
    .card.expense { background: #dc2626; }
    .card.balance { background: #4f46e5; }
    .card .label { font-size: 0.85rem; opacity: 0.9; }
    .card .value { font-size: 1.6rem; font-weight: 700; }
    .charts-row { display: flex; gap: 20px; flex-wrap: wrap; }
    .chart-box { flex: 1; min-width: 320px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); position: relative; height: 320px; }
    .chart-box h3 { margin-top: 0; color: #334155; font-size: 1rem; }
    .empty { color: #94a3b8; font-size: 0.9rem; text-align: center; margin-top: 40px; }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('categoryChart') categoryCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendCanvas!: ElementRef<HTMLCanvasElement>;

  summary = { income: 0, expense: 0, balance: 0 };
  hasCategoryData = false;
  hasTrendData = false;

  private categoryChartInstance?: Chart;
  private trendChartInstance?: Chart;

  constructor(private txService: TransactionService) {}

  ngOnInit() {
    const now = new Date();
    this.txService.getSummary(now.getMonth() + 1, now.getFullYear()).subscribe(s => this.summary = s);
  }

  ngAfterViewInit() {
    const now = new Date();
    this.loadCategoryChart(now.getMonth() + 1, now.getFullYear());
    this.loadTrendChart();
  }

  private loadCategoryChart(month: number, year: number) {
    this.txService.getCategoryBreakdown(month, year).subscribe(data => {
      this.hasCategoryData = data.length > 0;
      if (!data.length) return;

      this.categoryChartInstance = new Chart(this.categoryCanvas.nativeElement, {
        type: 'pie',
        data: {
          labels: data.map(d => d._id),
          datasets: [{
            data: data.map(d => d.total),
            backgroundColor: ['#4f46e5', '#dc2626', '#16a34a', '#f59e0b', '#0891b2', '#9333ea', '#e11d48']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    });
  }

  private loadTrendChart() {
    this.txService.getMonthlyTrend().subscribe(data => {
      this.hasTrendData = data.length > 0;
      if (!data.length) return;

      const labels = [...new Set(data.map(d => `${d._id.month}/${d._id.year}`))];
      const incomeData = labels.map(l => {
        const [m, y] = l.split('/').map(Number);
        return data.find(d => d._id.month === m && d._id.year === y && d._id.type === 'income')?.total || 0;
      });
      const expenseData = labels.map(l => {
        const [m, y] = l.split('/').map(Number);
        return data.find(d => d._id.month === m && d._id.year === y && d._id.type === 'expense')?.total || 0;
      });

      this.trendChartInstance = new Chart(this.trendCanvas.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Income', data: incomeData, borderColor: '#16a34a', tension: 0.3 },
            { label: 'Expense', data: expenseData, borderColor: '#dc2626', tension: 0.3 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    });
  }
}
