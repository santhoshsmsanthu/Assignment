interface Hero3DSceneProps {
  balanceLabel: string;
  incomeLabel: string;
  expenseLabel: string;
}

export function Hero3DScene({
  balanceLabel,
  incomeLabel,
  expenseLabel,
}: Hero3DSceneProps) {
  return (
    <div className="hero-scene-wrap" aria-hidden="true">
      <div className="hero-scene">
        <div className="coin coin-main" />
        <div className="coin coin-secondary" />
        <div className="glass-panel">
          <span className="tiny-label">Net Position</span>
          <strong>{balanceLabel}</strong>
        </div>
        <div className="floating-tag tag-income">Income {incomeLabel}</div>
        <div className="floating-tag tag-expense">Expense {expenseLabel}</div>
      </div>
    </div>
  );
}
