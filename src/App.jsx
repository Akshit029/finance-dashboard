// src/App.jsx
import TransactionTable from './components/TransactionTable';
import DashboardCharts from './components/DashboardCharts';
import AddTransactionForm from './components/AddTransactionForm';

import React, { useState, useEffect } from 'react';
import { initialTransactions } from './data';

/* ─── GLOBAL STYLES ────────────────────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #f4f3ef;
    --bg-secondary: #eceae4;
    --card-bg:      #ffffff;
    --card-border:  rgba(0,0,0,0.07);
    --text-main:    #1a1814;
    --text-muted:   #8c8882;
    --text-label:   #5a5854;
    --accent:       #c8a96e;
    --accent-soft:  #f5efe3;
    --income:       #2d7a4f;
    --income-soft:  #e6f5ed;
    --expense:      #c0392b;
    --expense-soft: #fdecea;
    --info:         #1d5fa6;
    --info-soft:    #e8f1fb;
    --shadow-sm:    0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:    0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
    --shadow-lg:    0 12px 40px rgba(0,0,0,0.1);
    --radius:       14px;
    --radius-sm:    8px;
    --transition:   all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  [data-theme="dark"] {
    --bg:           #13120f;
    --bg-secondary: #1c1b17;
    --card-bg:      #211f1a;
    --card-border:  rgba(255,255,255,0.07);
    --text-main:    #f0ede8;
    --text-muted:   #7a7772;
    --text-label:   #a09d99;
    --accent:       #c8a96e;
    --accent-soft:  rgba(200,169,110,0.12);
    --income:       #4caf7d;
    --income-soft:  rgba(76,175,125,0.12);
    --expense:      #e05c4f;
    --expense-soft: rgba(224,92,79,0.12);
    --info:         #5b9bd5;
    --info-soft:    rgba(91,155,213,0.12);
    --shadow-sm:    0 1px 3px rgba(0,0,0,0.3);
    --shadow-md:    0 4px 16px rgba(0,0,0,0.4);
    --shadow-lg:    0 12px 40px rgba(0,0,0,0.5);
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background-color: var(--bg);
    color: var(--text-main);
    min-height: 100vh;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 99px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.4); opacity: 0.7; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .fade-up   { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation-delay: 0.08s; }
  .fade-up-2 { animation-delay: 0.16s; }
  .fade-up-3 { animation-delay: 0.24s; }
  .fade-up-4 { animation-delay: 0.32s; }
  .fade-up-5 { animation-delay: 0.40s; }

  /* ── Page wrapper ── */
  .dash-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px 64px;
  }

  /* ── Header ── */
  .dash-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    gap: 16px;
  }
  .dash-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-main);
  }
  .dash-header-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  /* ── Stat grid ── */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  /* ── Stat card ── */
  .stat-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    padding: 26px 24px 20px;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }
  .stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .stat-card.balance::before { background: linear-gradient(90deg, var(--accent), #e8c98e); }
  .stat-card.income::before  { background: linear-gradient(90deg, var(--income), #52c97a); }
  .stat-card.expense::before { background: linear-gradient(90deg, var(--expense), #e87b70); }
  .stat-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .stat-card-label  { font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-muted); }
  .stat-card-icon   { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .stat-card-value  { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }

  /* ── Toggle button ── */
  .toggle-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 16px; border-radius: 99px;
    border: 1.5px solid var(--card-border);
    background: var(--card-bg); color: var(--text-main);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: var(--transition);
    box-shadow: var(--shadow-sm); white-space: nowrap;
  }
  .toggle-btn:hover { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); transform: translateY(-1px); }

  /* ── Role badge ── */
  .role-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 13px; border-radius: 99px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase; white-space: nowrap;
  }
  .role-badge.admin  { background: var(--accent-soft); color: var(--accent); border: 1.5px solid rgba(200,169,110,0.25); }
  .role-badge.viewer { background: var(--bg-secondary); color: var(--text-label); border: 1.5px solid var(--card-border); }
  .role-badge .dot   { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse-dot 2s ease-in-out infinite; }

  /* ── Insight banner ── */
  .insight-banner {
    background: var(--info-soft);
    border: 1.5px solid rgba(29,95,166,0.15);
    border-radius: var(--radius-sm);
    padding: 13px 18px;
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 14px; color: var(--info);
    margin-bottom: 28px;
  }
  [data-theme="dark"] .insight-banner { border-color: rgba(91,155,213,0.2); }
  .insight-banner .ibn-icon { font-size: 17px; flex-shrink: 0; margin-top: 2px; }

  /* ── Toast notification ── */
  .toast {
    position: fixed;
    bottom: 24px; right: 24px;
    background: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: var(--radius-sm);
    padding: 12px 18px;
    box-shadow: var(--shadow-lg);
    font-size: 13px; font-weight: 500;
    color: var(--text-main);
    display: flex; align-items: center; gap: 8px;
    animation: slideIn 0.25s ease both;
    z-index: 10000;
    max-width: 300px;
  }
  .toast-icon { font-size: 16px; flex-shrink: 0; }

  /* ── Section label ── */
  .section-label {
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 14px;
  }

  /* ── Separator ── */
  .separator { border: none; border-top: 1px solid var(--card-border); margin: 32px 0; }

  /* ════════════════════════════════════
     RESPONSIVE
  ════════════════════════════════════ */
  @media (max-width: 768px) {
    .dash-wrapper  { padding: 20px 16px 48px; }
    .dash-header   { flex-direction: column; align-items: flex-start; margin-bottom: 24px; gap: 12px; }
    .dash-header-controls { width: 100%; flex-wrap: wrap; }
    .dash-title    { font-size: 22px; }
    .stat-grid     { grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .stat-grid > :first-child { grid-column: 1 / -1; }
    .stat-card     { padding: 20px 18px 16px; }
    .stat-card-value { font-size: 24px; }
    .insight-banner { font-size: 13px; padding: 12px 14px; }
    .separator     { margin: 22px 0; }
    .toast         { bottom: 16px; right: 16px; left: 16px; max-width: none; }
  }
  @media (max-width: 480px) {
    .dash-wrapper  { padding: 14px 12px 36px; }
    .dash-header   { gap: 10px; margin-bottom: 18px; }
    .dash-title    { font-size: 19px; }
    .toggle-btn    { padding: 8px 12px; font-size: 12px; gap: 5px; }
    .role-badge    { padding: 6px 10px; font-size: 10px; }
    .stat-grid     { grid-template-columns: 1fr; gap: 10px; }
    .stat-grid > :first-child { grid-column: auto; }
    .stat-card     { padding: 18px 16px 14px; }
    .stat-card-value { font-size: 26px; }
    .insight-banner { font-size: 12px; padding: 11px 13px; }
    .separator     { margin: 18px 0; }
    .section-label { font-size: 10px; }
  }
  @media (max-width: 360px) {
    .dash-title    { font-size: 17px; }
    .toggle-btn    { padding: 7px 10px; font-size: 11px; }
    .stat-card-value { font-size: 22px; }
  }
`;

function injectStyles() {
  if (!document.getElementById('finance-dashboard-styles')) {
    const tag = document.createElement('style');
    tag.id = 'finance-dashboard-styles';
    tag.textContent = globalStyles;
    document.head.appendChild(tag);
  }
}

/* ─── STAT CARD ─────────────────────────────────────────────────────────────── */
function StatCard({ label, value, type, icon, prefix = '', color }) {
  const iconBg = type === 'balance' ? 'var(--accent-soft)' : type === 'income' ? 'var(--income-soft)' : 'var(--expense-soft)';
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-icon" style={{ background: iconBg }}>{icon}</span>
      </div>
      <div className="stat-card-value" style={{ color: color || 'var(--text-main)' }}>
        {prefix}{Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}

/* ─── TOAST ──────────────────────────────────────────────────────────────────── */
function Toast({ message, icon }) {
  return (
    <div className="toast">
      <span className="toast-icon">{icon}</span>
      {message}
    </div>
  );
}

/* ─── APP ───────────────────────────────────────────────────────────────────── */
function App() {
  injectStyles();

  const [transactions, setTransactions] = useState(initialTransactions);
  const [role, setRole]                 = useState('viewer');
  const [isDarkMode, setIsDarkMode]     = useState(false);
  const [toast, setToast]               = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Auto-dismiss toast after 3 s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message, icon = '✅') => setToast({ message, icon });

  const handleAddTransaction = (newTxn) => {
    setTransactions(prev => [newTxn, ...prev]);
    showToast(`"${newTxn.description}" added`, '✅');
  };

  const handleDeleteTransaction = (id) => {
    const txn = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (txn) showToast(`"${txn.description}" deleted`, '🗑');
  };

  const totalIncome   = transactions.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
  const totalBalance  = totalIncome - totalExpenses;

  const highestExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((max, cur) => cur.amount > max.amount ? cur : max, { amount: 0, category: 'None' });

  return (
    <div className="dash-wrapper">

      {/* ── HEADER ── */}
      <header className="dash-header fade-up">
        <div>
          <p className="section-label" style={{ marginBottom: 5 }}>Overview</p>
          <h1 className="dash-title">Finance Dashboard</h1>
        </div>
        <div className="dash-header-controls">
          <button className="toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <div className={`role-badge ${role}`}>
            <span className="dot" />
            {role.toUpperCase()}
          </div>
          <button className="toggle-btn" onClick={() => setRole(role === 'viewer' ? 'admin' : 'viewer')}>
            {role === 'viewer' ? '🔑 Go Admin' : '👁 Viewer'}
          </button>
        </div>
      </header>

      {/* ── STAT CARDS ── */}
      <section className="stat-grid">
        <div className="fade-up fade-up-1">
          <StatCard
            label="Total Balance" value={totalBalance} type="balance" icon="⚖️"
            prefix={totalBalance >= 0 ? '$' : '-$'}
            color={totalBalance >= 0 ? 'var(--text-main)' : 'var(--expense)'}
          />
        </div>
        <div className="fade-up fade-up-2">
          <StatCard label="Total Income"   value={totalIncome}   type="income"  icon="📈" prefix="+$" color="var(--income)" />
        </div>
        <div className="fade-up fade-up-3">
          <StatCard label="Total Expenses" value={totalExpenses} type="expense" icon="📉" prefix="-$" color="var(--expense)" />
        </div>
      </section>

      {/* ── INSIGHT BANNER ── */}
      <div className="insight-banner fade-up fade-up-4">
        <span className="ibn-icon">💡</span>
        <span>
          Your highest spending category is{' '}
          <strong style={{ fontWeight: 600 }}>{highestExpense.category}</strong>
          {' '}at{' '}
          <strong style={{ fontWeight: 600 }}>
            ${highestExpense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </strong>
        </span>
      </div>

      {/* ── ADMIN: ADD TRANSACTION ── */}
      {role === 'admin' && (
        <div className="fade-up fade-up-4" style={{ marginBottom: '28px' }}>
          <p className="section-label">Add Transaction</p>
          <AddTransactionForm onAdd={handleAddTransaction} />
        </div>
      )}

      <hr className="separator" />

      {/* ── TRANSACTION TABLE ── */}
      <div className="fade-up fade-up-5">
        <p className="section-label">Transaction History</p>
        <TransactionTable
          transactions={transactions}
          role={role}
          onDelete={handleDeleteTransaction}
        />
      </div>

      <hr className="separator" />

      {/* ── CHARTS ── */}
      <div className="fade-up fade-up-5">
        <p className="section-label">Visualizations</p>
        <DashboardCharts transactions={transactions} />
      </div>

      {/* ── TOAST ── */}
      {toast && <Toast message={toast.message} icon={toast.icon} />}

    </div>
  );
}

export default App;