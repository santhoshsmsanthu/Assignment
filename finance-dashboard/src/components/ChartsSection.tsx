import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface BalancePoint {
  date: string;
  balance: number;
}

interface BreakdownPoint {
  name: string;
  value: number;
}

interface ChartsSectionProps {
  balanceTrend: BalancePoint[];
  spendingBreakdown: BreakdownPoint[];
}

const colors = ['#0f766e', '#d18f00', '#be3144', '#204f9e', '#6e7d11', '#7f406f'];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ChartsSection({ balanceTrend, spendingBreakdown }: ChartsSectionProps) {
  return (
    <section className="content-grid anim-enter">
      <article className="section-card">
        <h2 className="chart-title">Balance Trend</h2>
        <p className="chart-subtitle">Time-based view of account movement</p>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <AreaChart data={balanceTrend}>
              <defs>
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} />
              <Area
                dataKey="balance"
                type="monotone"
                stroke="#0f766e"
                fill="url(#balanceFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="section-card">
        <h2 className="chart-title">Spending Breakdown</h2>
        <p className="chart-subtitle">Expense categories at a glance</p>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={spendingBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={86}
                paddingAngle={3}
              >
                {spendingBreakdown.map((item, index) => (
                  <Cell key={item.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
