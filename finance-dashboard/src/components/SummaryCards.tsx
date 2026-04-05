import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function SummaryCards({
  totalBalance,
  totalIncome,
  totalExpenses,
}: SummaryCardsProps) {
  return (
    <section className="summary-grid anim-enter">
      <article className="summary-card">
        <div className="label">Total Balance</div>
        <div className="amount">{formatCurrency(totalBalance)}</div>
        <Wallet size={18} color="#0f766e" />
      </article>

      <article className="summary-card income">
        <div className="label">Income</div>
        <div className="amount">{formatCurrency(totalIncome)}</div>
        <ArrowUpCircle size={18} color="#1f8a4c" />
      </article>

      <article className="summary-card expense">
        <div className="label">Expenses</div>
        <div className="amount">{formatCurrency(totalExpenses)}</div>
        <ArrowDownCircle size={18} color="#be3144" />
      </article>
    </section>
  );
}
