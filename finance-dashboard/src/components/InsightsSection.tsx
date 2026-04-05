interface InsightsSectionProps {
  highestSpendingCategory: string;
  monthlyComparison: string;
  savingsObservation: string;
}

export function InsightsSection({
  highestSpendingCategory,
  monthlyComparison,
  savingsObservation,
}: InsightsSectionProps) {
  return (
    <section className="section-card anim-enter">
      <h2 className="section-title">Insights</h2>
      <p className="section-note">Simple, useful observations from current data</p>

      <ul className="insights-list" style={{ marginTop: '0.7rem' }}>
        <li className="insight-item">Highest spending category: {highestSpendingCategory}</li>
        <li className="insight-item">Monthly comparison: {monthlyComparison}</li>
        <li className="insight-item">Observation: {savingsObservation}</li>
      </ul>
    </section>
  );
}
