// src/components/DashboardCharts.jsx
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

/* ─── STYLES ─────────────────────────────────────────────────────────────────── */
const chartStyles = `
  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 8px;
  }

  .chart-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    padding: 24px 24px 16px;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
    transition: var(--transition);
  }
  .chart-card:hover { box-shadow: var(--shadow-md); }
  .chart-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
  }
  .chart-card.pie-card::before  { background: linear-gradient(90deg, #8b5cf6, #c084fc); }
  .chart-card.bar-card::before  { background: linear-gradient(90deg, var(--income), var(--expense)); }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 12px;
    flex-wrap: wrap;
  }
  .chart-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }
  .chart-subtitle {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* ── Legend pills (pie) ── */
  .pie-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
  }
  .pie-legend-item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 500;
    background: var(--bg-secondary);
    color: var(--text-label);
    border: 1px solid var(--card-border);
  }
  .pie-legend-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Stat pill on bar chart ── */
  .chart-stat-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .chart-stat {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    border: 1.5px solid;
  }
  .chart-stat.income-stat {
    background: var(--income-soft);
    color: var(--income);
    border-color: rgba(45,122,79,0.2);
  }
  .chart-stat.expense-stat {
    background: var(--expense-soft);
    color: var(--expense);
    border-color: rgba(192,57,43,0.2);
  }

  /* ── Empty state ── */
  .chart-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 240px;
    gap: 8px;
    color: var(--text-muted);
    font-size: 13px;
  }
  .chart-empty-icon { font-size: 32px; opacity: 0.5; }

  /* ── Custom tooltip ── */
  .chart-tooltip {
    background: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    box-shadow: var(--shadow-md);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text-main);
    min-width: 120px;
  }
  .chart-tooltip-label {
    font-weight: 600;
    margin-bottom: 6px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    text-transform: uppercase;
  }
  .chart-tooltip-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .chart-tooltip-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: 4px;
  }
  .chart-tooltip-key {
    display: flex; align-items: center;
    color: var(--text-label); font-size: 12px;
  }
  .chart-tooltip-val { font-weight: 600; }

  /* ════════════════════════
     RESPONSIVE
  ════════════════════════ */
  @media (max-width: 900px) {
    .charts-grid { grid-template-columns: 1fr; gap: 14px; }
  }
  @media (max-width: 480px) {
    .chart-card { padding: 16px 14px 12px; }
    .chart-title { font-size: 14px; }
    .chart-stat  { font-size: 11px; padding: 4px 10px; }
    .pie-legend-item { font-size: 10px; padding: 3px 8px; }
  }
`;

function injectChartStyles() {
  if (!document.getElementById('chart-styles')) {
    const tag = document.createElement('style');
    tag.id = 'chart-styles';
    tag.textContent = chartStyles;
    document.head.appendChild(tag);
  }
}

/* ─── PALETTE ────────────────────────────────────────────────────────────────── */
const PIE_COLORS = ['#8b5cf6', '#f97316', '#eab308', '#3b82f6', '#ec4899'];

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────────────────────────── */
function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="chart-tooltip-row" style={{ marginTop: i > 0 ? 4 : 0 }}>
          <span className="chart-tooltip-key">
            <span className="chart-tooltip-dot" style={{ background: p.fill }} />
            {p.name}
          </span>
          <span className="chart-tooltip-val" style={{ color: p.fill }}>
            ${Number(p.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{p.name}</div>
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-key">
          <span className="chart-tooltip-dot" style={{ background: p.payload.fill }} />
          Amount
        </span>
        <span className="chart-tooltip-val" style={{ color: p.payload.fill }}>
          ${Number(p.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}

/* ─── CUSTOM PIE LABEL ───────────────────────────────────────────────────────── */
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x  = cx + r * Math.cos(-midAngle * RADIAN);
  const y  = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────────── */
export default function DashboardCharts({ transactions }) {
  injectChartStyles();

  /* ── Pie data ── */
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryMap = expenses.reduce((acc, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
    return acc;
  }, {});
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  /* ── Bar data ── */
  const dateMap = transactions.reduce((acc, cur) => {
    if (!acc[cur.date]) acc[cur.date] = { date: cur.date, income: 0, expense: 0 };
    acc[cur.date][cur.type] += cur.amount;
    return acc;
  }, {});
  const barData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

  /* ── Summary stats for bar card ── */
  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);

  /* ── Responsive chart height ── */
  const chartH = typeof window !== 'undefined' && window.innerWidth <= 480 ? 220 : 280;

  /* ── Axis tick style ── */
  const tickStyle = { fontSize: 11, fontFamily: 'DM Sans, sans-serif', fill: 'var(--text-muted)' };

  return (
    <div className="charts-grid">

      {/* ════ PIE CHART ════ */}
      <div className="chart-card pie-card">
        <div className="chart-header">
          <div>
            <div className="chart-title">Spending by Category</div>
            <div className="chart-subtitle">Expense breakdown</div>
          </div>
        </div>

        {pieData.length === 0 ? (
          <div className="chart-empty">
            <span className="chart-empty-icon">🍩</span>
            <span>No expense data yet</span>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={chartH}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius="72%"
                  innerRadius="38%"
                  paddingAngle={3}
                  labelLine={false}
                  label={<PieLabel />}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom legend pills */}
            <div className="pie-legend">
              {pieData.map((entry, i) => (
                <span key={entry.name} className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ════ BAR CHART ════ */}
      <div className="chart-card bar-card">
        <div className="chart-header">
          <div>
            <div className="chart-title">Cashflow Trend</div>
            <div className="chart-subtitle">Income vs expenses over time</div>
          </div>
          <div className="chart-stat-row">
            <span className="chart-stat income-stat">
              +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="chart-stat expense-stat">
              −${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {barData.length === 0 ? (
          <div className="chart-empty">
            <span className="chart-empty-icon">📊</span>
            <span>No transaction data yet</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={barData} barGap={4} barCategoryGap="32%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
              <XAxis
                dataKey="date"
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={d => {
                  const dt = new Date(d);
                  return `${dt.getMonth() + 1}/${dt.getDate()}`;
                }}
              />
              <YAxis
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `$${v}`}
                width={52}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'var(--bg-secondary)', radius: 6 }} />
              <Bar dataKey="income"  name="Income"  fill="var(--income)"  radius={[5, 5, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="var(--expense)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}