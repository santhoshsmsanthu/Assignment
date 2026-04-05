import { DashboardFilters, TransactionType } from '../types';

interface FiltersBarProps {
  filters: DashboardFilters;
  categories: string[];
  months: string[];
  onChange: (filters: Partial<DashboardFilters>) => void;
  onReset: () => void;
}

const typeOptions: Array<'all' | TransactionType> = ['all', 'income', 'expense'];

export function FiltersBar({
  filters,
  categories,
  months,
  onChange,
  onReset,
}: FiltersBarProps) {
  return (
    <section className="section-card anim-enter">
      <h2 className="section-title">Transactions Filters</h2>
      <p className="section-note">Search, narrow, and sort transactions quickly</p>
      <div className="filters-grid" style={{ marginTop: '0.7rem' }}>
        <label>
          <div className="section-note">Search</div>
          <input
            className="input"
            placeholder="Description or category"
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
          />
        </label>

        <label>
          <div className="section-note">Category</div>
          <select
            className="select"
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value })}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div className="section-note">Type</div>
          <select
            className="select"
            value={filters.type}
            onChange={(event) =>
              onChange({ type: event.target.value as 'all' | TransactionType })
            }
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option[0].toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div className="section-note">Month</div>
          <select
            className="select"
            value={filters.month}
            onChange={(event) => onChange({ month: event.target.value })}
          >
            <option value="all">All</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div className="section-note">Sort</div>
          <select
            className="select"
            value={filters.sortBy}
            onChange={(event) =>
              onChange({
                sortBy: event.target.value as DashboardFilters['sortBy'],
              })
            }
          >
            <option value="date-desc">Date: Newest</option>
            <option value="date-asc">Date: Oldest</option>
            <option value="amount-desc">Amount: High to low</option>
            <option value="amount-asc">Amount: Low to high</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="ghost-btn" onClick={onReset}>
          Reset Filters
        </button>
      </div>
    </section>
  );
}
