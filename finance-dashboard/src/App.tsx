import { useEffect, useMemo, useState } from 'react';
import { ChartsSection } from './components/ChartsSection';
import { FiltersBar } from './components/FiltersBar';
import { Hero3DScene } from './components/Hero3DScene';
import { InsightsSection } from './components/InsightsSection';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionsTable } from './components/TransactionsTable';
import { useDashboard } from './state/DashboardContext';
import { Transaction } from './types';

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function monthLabel(isoMonth: string) {
  const [year, month] = isoMonth.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function App() {
  const {
    role,
    setRole,
    transactions,
    filters,
    setFilters,
    resetFilters,
    addTransaction,
    updateTransaction,
    categories,
  } = useDashboard();

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const availableMonths = useMemo(() => {
    const months = transactions.map((tx) => tx.date.slice(0, 7));
    return Array.from(new Set(months)).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      const query = filters.search.toLowerCase();
      const matchesSearch =
        !query ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query);
      const matchesCategory =
        filters.category === 'all' || transaction.category === filters.category;
      const matchesType = filters.type === 'all' || transaction.type === filters.type;
      const matchesMonth =
        filters.month === 'all' || transaction.date.startsWith(filters.month);

      return matchesSearch && matchesCategory && matchesType && matchesMonth;
    });

    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc':
          return a.date.localeCompare(b.date);
        case 'date-desc':
          return b.date.localeCompare(a.date);
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        default:
          return 0;
      }
    });
  }, [transactions, filters]);

  const totals = useMemo(() => {
    const totalIncome = transactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
    };
  }, [transactions]);

  const balanceTrend = useMemo(() => {
    const sortedByDate = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    let runningBalance = 0;

    return sortedByDate.map((tx) => {
      runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
      return {
        date: new Date(tx.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        balance: runningBalance,
      };
    });
  }, [transactions]);

  const spendingBreakdown = useMemo(() => {
    const map = new Map<string, number>();

    filteredTransactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
      });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const highestSpendingCategory = useMemo(() => {
    if (!spendingBreakdown.length) {
      return 'No expense data available';
    }

    const top = spendingBreakdown[0];
    return `${top.name} (${formatMoney(top.value)})`;
  }, [spendingBreakdown]);

  const monthlyComparison = useMemo(() => {
    if (availableMonths.length < 2) {
      return 'Not enough month data to compare.';
    }

    const currentMonth = availableMonths[0];
    const previousMonth = availableMonths[1];

    const expenseOf = (month: string) =>
      transactions
        .filter((tx) => tx.type === 'expense' && tx.date.startsWith(month))
        .reduce((sum, tx) => sum + tx.amount, 0);

    const currentExpense = expenseOf(currentMonth);
    const previousExpense = expenseOf(previousMonth);

    if (previousExpense === 0) {
      return `${monthLabel(currentMonth)} has ${formatMoney(currentExpense)} in expenses.`;
    }

    const changePercent = ((currentExpense - previousExpense) / previousExpense) * 100;
    const direction = changePercent >= 0 ? 'up' : 'down';

    return `${monthLabel(currentMonth)} expenses are ${Math.abs(changePercent).toFixed(
      1,
    )}% ${direction} vs ${monthLabel(previousMonth)}.`;
  }, [availableMonths, transactions]);

  const savingsObservation = useMemo(() => {
    if (totals.totalIncome === 0) {
      return 'No income recorded yet, so savings rate is unavailable.';
    }

    const savingsRate =
      ((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100;

    if (savingsRate < 0) {
      return `Spending is exceeding income by ${Math.abs(savingsRate).toFixed(
        1,
      )}% of income.`;
    }

    return `Current savings rate is ${savingsRate.toFixed(1)}% of income.`;
  }, [totals]);

  const isFormOpen = role === 'admin' && (showCreateForm || Boolean(editingTransaction));

  useEffect(() => {
    const shouldReduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (shouldReduceMotion || hasCoarsePointer) {
      return;
    }

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('.section-card, .summary-card'),
    );

    const cleanupFns = cards.map((card) => {
      const handleMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;

        const rotateY = (px - 0.5) * 8;
        const rotateX = (0.5 - py) * 8;

        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        card.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
        card.style.setProperty('--card-glow-opacity', '1');
      };

      const handleLeave = () => {
        card.style.setProperty('--card-rotate-x', '0deg');
        card.style.setProperty('--card-rotate-y', '0deg');
        card.style.setProperty('--card-glow-opacity', '0');
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);

      return () => {
        card.removeEventListener('mousemove', handleMove);
        card.removeEventListener('mouseleave', handleLeave);
      };
    });

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    const shouldReduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>('.anim-enter'),
    );

    if (shouldReduceMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -6% 0px',
      },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const shouldReduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (shouldReduceMotion || hasCoarsePointer) {
      return;
    }

    const aura = document.createElement('div');
    aura.className = 'cursor-aura';

    const core = document.createElement('div');
    core.className = 'cursor-core';

    document.body.appendChild(aura);
    document.body.appendChild(core);

    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
    let currentX = mouseX;
    let currentY = mouseY;
    let animationFrame = 0;

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      core.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      aura.style.opacity = '1';
      core.style.opacity = '1';
    };

    const handleLeave = () => {
      aura.style.opacity = '0';
      core.style.opacity = '0';
    };

    const handleEnter = () => {
      aura.style.opacity = '1';
      core.style.opacity = '1';
    };

    const animateAura = () => {
      currentX += (mouseX - currentX) * 0.17;
      currentY += (mouseY - currentY) * 0.17;
      aura.style.transform = `translate3d(${currentX - 20}px, ${currentY - 20}px, 0)`;
      animationFrame = window.requestAnimationFrame(animateAura);
    };

    animateAura();
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseout', handleLeave);
    window.addEventListener('mouseover', handleEnter);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseout', handleLeave);
      window.removeEventListener('mouseover', handleEnter);
      aura.remove();
      core.remove();
    };
  }, []);

  return (
    <main className="dashboard-shell">
      <section className="section-card topbar anim-enter">
        <div className="title-wrap">
          <h1>Personal Finance Dashboard</h1>
          <p>Visualize activity, inspect transactions, and get quick insights.</p>
        </div>

        <div className="role-control">
          <span>Role</span>
          <select
            className="select"
            value={role}
            onChange={(event) => setRole(event.target.value as 'viewer' | 'admin')}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>

          {role === 'admin' ? (
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                setEditingTransaction(null);
                setShowCreateForm((prev) => !prev);
              }}
            >
              {showCreateForm ? 'Close Form' : 'Add Transaction'}
            </button>
          ) : null}
        </div>
      </section>

      <section className="section-card hero-layout anim-enter">
        <div className="hero-copy">
          <h2>Finance at a Glance, with Depth</h2>
          <p>
            A premium first-screen experience using layered 3D visuals to make
            your balance story feel dynamic and memorable.
          </p>
          <div className="hero-pills">
            <span className="hero-pill">Live role: {role}</span>
            <span className="hero-pill">Records: {transactions.length}</span>
          </div>
        </div>
        <Hero3DScene
          balanceLabel={formatMoney(totals.totalBalance)}
          incomeLabel={formatMoney(totals.totalIncome)}
          expenseLabel={formatMoney(totals.totalExpenses)}
        />
      </section>

      <SummaryCards
        totalBalance={totals.totalBalance}
        totalIncome={totals.totalIncome}
        totalExpenses={totals.totalExpenses}
      />

      <ChartsSection
        balanceTrend={balanceTrend}
        spendingBreakdown={spendingBreakdown}
      />

      <InsightsSection
        highestSpendingCategory={highestSpendingCategory}
        monthlyComparison={monthlyComparison}
        savingsObservation={savingsObservation}
      />

      <FiltersBar
        filters={filters}
        categories={categories}
        months={availableMonths}
        onChange={setFilters}
        onReset={resetFilters}
      />

      {role === 'viewer' ? (
        <section className="section-card anim-enter">
          <div className="empty-state">
            Viewer role is read-only. Switch to admin to add or edit transactions.
          </div>
        </section>
      ) : null}

      {isFormOpen ? (
        <TransactionForm
          mode={editingTransaction ? 'edit' : 'create'}
          transaction={editingTransaction ?? undefined}
          onSubmit={(payload) => {
            if ('id' in payload) {
              updateTransaction(payload);
              setEditingTransaction(null);
              return;
            }

            addTransaction(payload);
            setShowCreateForm(false);
          }}
          onCancel={() => {
            setEditingTransaction(null);
            setShowCreateForm(false);
          }}
        />
      ) : null}

      <TransactionsTable
        transactions={filteredTransactions}
        role={role}
        onEdit={(transaction) => {
          if (role !== 'admin') {
            return;
          }
          setShowCreateForm(false);
          setEditingTransaction(transaction);
        }}
      />
    </main>
  );
}

export default App;
