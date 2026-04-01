// src/components/TransactionTable.jsx
import React, { useState } from 'react';

/* ─── STYLES ─────────────────────────────────────────────────────────────────── */
const tableStyles = `
  /* ── Container ── */
  .tt-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  /* ── Top bar ── */
  .tt-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 0;
    gap: 12px;
    flex-wrap: wrap;
  }
  .tt-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }
  .tt-count {
    font-size: 12px;
    color: var(--text-muted);
    background: var(--bg-secondary);
    border: 1px solid var(--card-border);
    border-radius: 99px;
    padding: 3px 10px;
    font-weight: 500;
  }

  /* ── Controls ── */
  .tt-controls {
    display: flex;
    gap: 10px;
    padding: 14px 24px 16px;
    flex-wrap: wrap;
  }
  .tt-search-wrap {
    position: relative;
    flex: 1;
    min-width: 160px;
  }
  .tt-search-icon {
    position: absolute;
    left: 12px; top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    color: var(--text-muted);
    pointer-events: none;
  }
  .tt-input {
    width: 100%;
    padding: 9px 12px 9px 34px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--card-border);
    background: var(--bg);
    color: var(--text-main);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.18s ease;
  }
  .tt-input::placeholder { color: var(--text-muted); }
  .tt-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
    background: var(--card-bg);
  }

  .tt-select-wrap {
    position: relative;
    flex-shrink: 0;
  }
  .tt-select-wrap::after {
    content: '▾';
    position: absolute;
    right: 11px; top: 50%;
    transform: translateY(-50%);
    font-size: 11px;
    color: var(--text-muted);
    pointer-events: none;
  }
  .tt-select {
    padding: 9px 30px 9px 13px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--card-border);
    background: var(--bg);
    color: var(--text-main);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    appearance: none; -webkit-appearance: none;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .tt-select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  /* ── Divider ── */
  .tt-divider {
    height: 1px;
    background: var(--card-border);
    margin: 0 24px;
  }

  /* ── Desktop table ── */
  .tt-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .tt-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }
  .tt-table thead tr {
    background: var(--bg-secondary);
  }
  .tt-th {
    padding: 11px 16px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-muted);
    white-space: nowrap;
    font-family: 'Syne', sans-serif;
    border-bottom: 1px solid var(--card-border);
  }
  .tt-th:first-child { padding-left: 24px; }
  .tt-th:last-child  { padding-right: 24px; }

  .tt-tr {
    border-bottom: 1px solid var(--card-border);
    transition: background 0.14s ease;
  }
  .tt-tr:last-child { border-bottom: none; }
  .tt-tr:hover { background: var(--bg-secondary); }

  .tt-td {
    padding: 13px 16px;
    color: var(--text-main);
    vertical-align: middle;
  }
  .tt-td:first-child { padding-left: 24px; }
  .tt-td:last-child  { padding-right: 24px; }

  /* ── Date cell ── */
  .tt-date {
    font-size: 13px;
    color: var(--text-muted);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* ── Description ── */
  .tt-desc {
    font-weight: 500;
    color: var(--text-main);
  }

  /* ── Category badge ── */
  .tt-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
    background: var(--bg-secondary);
    color: var(--text-label);
    border: 1px solid var(--card-border);
    white-space: nowrap;
  }

  /* ── Amount ── */
  .tt-amount {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    letter-spacing: -0.01em;
  }
  .tt-amount.income  { color: var(--income); }
  .tt-amount.expense { color: var(--expense); }

  /* ── Type pill ── */
  .tt-type {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 99px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .tt-type.income  { background: var(--income-soft);  color: var(--income); }
  .tt-type.expense { background: var(--expense-soft); color: var(--expense); }

  /* ── Delete button ── */
  .tt-delete {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 13px;
    border-radius: 99px;
    border: 1.5px solid rgba(192,57,43,0.2);
    background: var(--expense-soft);
    color: var(--expense);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.16s ease;
    white-space: nowrap;
  }
  .tt-delete:hover {
    background: var(--expense);
    color: #fff;
    border-color: var(--expense);
  }

  /* ── Empty state ── */
  .tt-empty {
    padding: 48px 24px;
    text-align: center;
    color: var(--text-muted);
    font-size: 14px;
  }
  .tt-empty-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.5; }
  .tt-empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text-label);
    margin-bottom: 4px;
  }

  /* ── Footer bar ── */
  .tt-footer {
    padding: 12px 24px;
    background: var(--bg-secondary);
    border-top: 1px solid var(--card-border);
    font-size: 12px;
    color: var(--text-muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* ════════════════════════════
     MOBILE CARD VIEW (≤ 600px)
  ════════════════════════════ */
  .tt-mobile-list { display: none; }

  @media (max-width: 600px) {
    .tt-table-wrap  { display: none; }
    .tt-mobile-list { display: block; }

    .tt-topbar  { padding: 16px 16px 0; }
    .tt-controls { padding: 12px 16px 14px; }
    .tt-divider  { margin: 0 16px; }
    .tt-footer   { padding: 10px 16px; }

    /* Each txn as a card */
    .tt-mob-card {
      padding: 14px 16px;
      border-bottom: 1px solid var(--card-border);
      transition: background 0.14s ease;
    }
    .tt-mob-card:last-child { border-bottom: none; }
    .tt-mob-card:hover { background: var(--bg-secondary); }

    .tt-mob-row1 {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
      gap: 8px;
    }
    .tt-mob-desc {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-main);
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tt-mob-amount {
      font-family: 'Syne', sans-serif;
      font-size: 15px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .tt-mob-row2 {
      display: flex;
      align-items: center;
      gap: 7px;
      flex-wrap: wrap;
    }
    .tt-mob-date {
      font-size: 11px;
      color: var(--text-muted);
    }
    .tt-mob-delete {
      margin-left: auto;
    }
  }

  /* Tablet (601–768px): table visible but tighter */
  @media (min-width: 601px) and (max-width: 768px) {
    .tt-topbar   { padding: 16px 18px 0; }
    .tt-controls { padding: 12px 18px 14px; }
    .tt-divider  { margin: 0 18px; }
    .tt-th:first-child, .tt-td:first-child { padding-left: 18px; }
    .tt-th:last-child,  .tt-td:last-child  { padding-right: 18px; }
    .tt-td, .tt-th { padding: 11px 12px; }
    /* Hide type column to save space */
    .tt-col-type { display: none; }
  }
`;

function injectTableStyles() {
  if (!document.getElementById('tt-styles')) {
    const tag = document.createElement('style');
    tag.id = 'tt-styles';
    tag.textContent = tableStyles;
    document.head.appendChild(tag);
  }
}

/* ─── CATEGORY COLOR MAP ─────────────────────────────────────────────────────── */
const CAT_COLORS = {
  Food:          { bg: 'rgba(249,115,22,0.1)',  color: '#f97316' },
  Housing:       { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  Utilities:     { bg: 'rgba(234,179,8,0.12)',  color: '#ca8a04' },
  Entertainment: { bg: 'rgba(139,92,246,0.1)',  color: '#8b5cf6' },
  Income:        { bg: 'rgba(45,122,79,0.1)',   color: 'var(--income)' },
};

function CategoryBadge({ category }) {
  const style = CAT_COLORS[category] || {};
  return (
    <span className="tt-badge" style={style.bg ? { background: style.bg, color: style.color, borderColor: 'transparent' } : {}}>
      {category}
    </span>
  );
}

/* ─── COMPONENT ──────────────────────────────────────────────────────────────── */
export default function TransactionTable({ transactions, role }) {
  injectTableStyles();

  const [searchTerm,      setSearchTerm]      = useState('');
  const [filterCategory,  setFilterCategory]  = useState('All');

  const categories = ['All', ...new Set(transactions.map(t => t.category))];

  const filtered = transactions.filter(txn => {
    const matchSearch   = txn.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'All' || txn.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalFiltered = filtered.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  return (
    <div className="tt-card">

      {/* ── Top bar ── */}
      <div className="tt-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="tt-title">Transactions</span>
          <span className="tt-count">{filtered.length} of {transactions.length}</span>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="tt-controls">
        <div className="tt-search-wrap">
          <span className="tt-search-icon">🔍</span>
          <input
            className="tt-input"
            type="text"
            placeholder="Search by description…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="tt-select-wrap">
          <select
            className="tt-select"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="tt-divider" />

      {/* ══════════════ DESKTOP TABLE ══════════════ */}
      <div className="tt-table-wrap">
        <table className="tt-table">
          <thead>
            <tr>
              <th className="tt-th">Date</th>
              <th className="tt-th">Description</th>
              <th className="tt-th">Category</th>
              <th className="tt-th tt-col-type">Type</th>
              <th className="tt-th" style={{ textAlign: 'right' }}>Amount</th>
              {role === 'admin' && <th className="tt-th">Action</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(txn => (
              <tr key={txn.id} className="tt-tr">
                <td className="tt-td">
                  <span className="tt-date">{txn.date}</span>
                </td>
                <td className="tt-td">
                  <span className="tt-desc">{txn.description}</span>
                </td>
                <td className="tt-td">
                  <CategoryBadge category={txn.category} />
                </td>
                <td className="tt-td tt-col-type">
                  <span className={`tt-type ${txn.type}`}>
                    {txn.type === 'income' ? '↑' : '↓'} {txn.type}
                  </span>
                </td>
                <td className="tt-td" style={{ textAlign: 'right' }}>
                  <span className={`tt-amount ${txn.type}`}>
                    {txn.type === 'income' ? '+' : '−'}${txn.amount.toFixed(2)}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="tt-td">
                    <button
                      className="tt-delete"
                      onClick={() => alert(`Delete txn ${txn.id} (Logic coming soon)`)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={role === 'admin' ? 6 : 5}>
                  <div className="tt-empty">
                    <div className="tt-empty-icon">🔎</div>
                    <div className="tt-empty-title">No results found</div>
                    <div>Try adjusting your search or filter</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ══════════════ MOBILE CARD LIST ══════════════ */}
      <div className="tt-mobile-list">
        {filtered.length > 0 ? filtered.map(txn => (
          <div key={txn.id} className="tt-mob-card">
            <div className="tt-mob-row1">
              <span className="tt-mob-desc">{txn.description}</span>
              <span className={`tt-mob-amount ${txn.type === 'income' ? 'tt-amount income' : 'tt-amount expense'}`}>
                {txn.type === 'income' ? '+' : '−'}${txn.amount.toFixed(2)}
              </span>
            </div>
            <div className="tt-mob-row2">
              <span className="tt-mob-date">{txn.date}</span>
              <CategoryBadge category={txn.category} />
              <span className={`tt-type ${txn.type}`}>
                {txn.type === 'income' ? '↑' : '↓'} {txn.type}
              </span>
              {role === 'admin' && (
                <button
                  className="tt-delete tt-mob-delete"
                  onClick={() => alert(`Delete txn ${txn.id} (Logic coming soon)`)}
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="tt-empty">
            <div className="tt-empty-icon">🔎</div>
            <div className="tt-empty-title">No results found</div>
            <div>Try adjusting your search or filter</div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {filtered.length > 0 && (
        <div className="tt-footer">
          <span>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} shown</span>
          <span style={{ fontWeight: 600, color: totalFiltered >= 0 ? 'var(--income)' : 'var(--expense)' }}>
            Net: {totalFiltered >= 0 ? '+' : '−'}${Math.abs(totalFiltered).toFixed(2)}
          </span>
        </div>
      )}

    </div>
  );
}