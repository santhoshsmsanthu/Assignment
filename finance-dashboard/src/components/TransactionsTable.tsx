import { Pencil } from 'lucide-react';
import { Transaction, UserRole } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  role: UserRole;
  onEdit: (transaction: Transaction) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function TransactionsTable({
  transactions,
  role,
  onEdit,
}: TransactionsTableProps) {
  if (!transactions.length) {
    return (
      <section className="section-card anim-enter">
        <h2 className="section-title">Transactions</h2>
        <div className="empty-state" style={{ marginTop: '0.7rem' }}>
          No matching transactions found. Try changing the current filters.
        </div>
      </section>
    );
  }

  return (
    <section className="section-card anim-enter">
      <h2 className="section-title">Transactions</h2>
      <p className="section-note">Track every inflow and outflow in one place</p>

      <div className="table-wrap" style={{ marginTop: '0.6rem' }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              {role === 'admin' ? <th>Action</th> : null}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>
                  <span className={`badge ${transaction.type}`}>{transaction.type}</span>
                </td>
                <td
                  style={{
                    color: transaction.type === 'income' ? '#1f8a4c' : '#be3144',
                    fontWeight: 700,
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </td>
                {role === 'admin' ? (
                  <td>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => onEdit(transaction)}
                      style={{ padding: '0.35rem 0.55rem' }}
                    >
                      <Pencil size={14} />
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
