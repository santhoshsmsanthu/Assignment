import { FormEvent, useEffect, useState } from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionFormProps {
  mode: 'create' | 'edit';
  transaction?: Transaction;
  onSubmit: (payload: Omit<Transaction, 'id'> | Transaction) => void;
  onCancel: () => void;
}

interface FormState {
  date: string;
  description: string;
  category: string;
  amount: string;
  type: TransactionType;
}

const initialState: FormState = {
  date: '',
  description: '',
  category: '',
  amount: '',
  type: 'expense',
};

export function TransactionForm({
  mode,
  transaction,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [form, setForm] = useState<FormState>(initialState);

  useEffect(() => {
    if (!transaction) {
      setForm(initialState);
      return;
    }

    setForm({
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      amount: String(transaction.amount),
      type: transaction.type,
    });
  }, [transaction]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number(form.amount);
    if (!form.date || !form.description || !form.category || !amount) {
      return;
    }

    const payload = {
      date: form.date,
      description: form.description,
      category: form.category,
      amount,
      type: form.type,
    };

    if (mode === 'edit' && transaction) {
      onSubmit({ ...payload, id: transaction.id });
      return;
    }

    onSubmit(payload);
    setForm(initialState);
  }

  return (
    <section className="section-card anim-enter">
      <h2 className="section-title">
        {mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      <p className="section-note">Admin-only transaction management form</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '0.7rem' }}>
        <div className="form-grid">
          <label>
            <div className="section-note">Date</div>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            />
          </label>

          <label>
            <div className="section-note">Description</div>
            <input
              className="input"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="What was this for?"
            />
          </label>

          <label>
            <div className="section-note">Category</div>
            <input
              className="input"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="e.g. Food"
            />
          </label>

          <label>
            <div className="section-note">Amount</div>
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            />
          </label>

          <label>
            <div className="section-note">Type</div>
            <select
              className="select"
              value={form.type}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  type: event.target.value as TransactionType,
                }))
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            {mode === 'edit' ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </section>
  );
}
