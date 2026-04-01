// src/components/AddTransactionForm.jsx
import React, { useState } from 'react';

const formStyles = `
  /* ── Card shell ── */
  .atf-card {
    background: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: var(--radius);
    padding: 26px 26px 22px;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
  }
  .atf-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), #e8c98e);
  }

  /* ── Header ── */
  .atf-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
  }
  .atf-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: var(--accent-soft);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .atf-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }
  .atf-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 1px; }

  /* ── Form grid ── */
  .atf-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 12px;
  }
  .atf-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 12px;
    align-items: end;
  }

  /* ── Field ── */
  .atf-field { display: flex; flex-direction: column; gap: 5px; }
  .atf-field.span-2 { grid-column: span 2; }

  .atf-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--text-muted);
  }

  .atf-input, .atf-select {
    padding: 10px 13px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--card-border);
    background: var(--bg);
    color: var(--text-main);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    transition: all 0.18s ease;
    outline: none;
    width: 100%;
    appearance: none; -webkit-appearance: none;
  }
  .atf-input::placeholder { color: var(--text-muted); }
  .atf-input:focus, .atf-select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
    background: var(--card-bg);
  }

  .atf-select-wrap { position: relative; }
  .atf-select-wrap::after {
    content: '▾';
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted); font-size: 12px;
    pointer-events: none;
  }

  /* ── Type toggle ── */
  .atf-type-toggle {
    display: flex;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--card-border);
    overflow: hidden;
    background: var(--bg);
    height: 42px;
  }
  .atf-type-btn {
    flex: 1; border: none; background: transparent;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    white-space: nowrap;
    padding: 0 8px;
  }
  .atf-type-btn.active-expense { background: var(--expense-soft); color: var(--expense); font-weight: 600; }
  .atf-type-btn.active-income  { background: var(--income-soft);  color: var(--income);  font-weight: 600; }

  /* ── Submit ── */
  .atf-submit {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 22px;
    border-radius: 99px; border: none;
    background: var(--accent); color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.18s ease;
    box-shadow: 0 2px 8px rgba(200,169,110,0.35);
    white-space: nowrap;
  }
  .atf-submit:hover {
    background: #b8945a;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(200,169,110,0.45);
  }
  .atf-submit:active { transform: translateY(0); }

  /* ── Footer ── */
  .atf-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
    margin-top: 4px;
    border-top: 1px solid var(--card-border);
  }

  /* ── Error ── */
  .atf-error {
    background: var(--expense-soft);
    border: 1.5px solid rgba(192,57,43,0.2);
    color: var(--expense);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }

  /* ════════════════════════
     RESPONSIVE — FORM
  ════════════════════════ */

  /* Tablet ≤ 768px: collapse to 2-col */
  @media (max-width: 768px) {
    .atf-card { padding: 20px 18px 18px; }

    .atf-grid {
      grid-template-columns: 1fr 1fr;
    }
    .atf-field.span-2 { grid-column: 1 / -1; }

    .atf-grid-2 {
      grid-template-columns: 1fr 1fr;
    }
    /* Submit button gets its own full row */
    .atf-grid-2 > .atf-submit-wrap {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
    }
    .atf-footer { padding-top: 12px; }
  }

  /* Mobile ≤ 480px: single column */
  @media (max-width: 480px) {
    .atf-card { padding: 16px 14px 14px; }
    .atf-header { gap: 10px; margin-bottom: 16px; }
    .atf-title  { font-size: 14px; }

    .atf-grid   { grid-template-columns: 1fr; gap: 10px; }
    .atf-field.span-2 { grid-column: auto; }

    .atf-grid-2 { grid-template-columns: 1fr; gap: 10px; }
    .atf-grid-2 > .atf-submit-wrap {
      grid-column: auto;
      display: flex;
      justify-content: stretch;
    }
    .atf-submit { width: 100%; justify-content: center; }

    .atf-input, .atf-select { font-size: 16px; /* prevents iOS zoom */ }
    .atf-type-toggle { height: 44px; }
    .atf-type-btn { font-size: 13px; }

    .atf-footer { display: none; } /* footer row hidden; submit is inline above */
  }
`;

function injectFormStyles() {
  if (!document.getElementById('atf-styles')) {
    const tag = document.createElement('style');
    tag.id = 'atf-styles';
    tag.textContent = formStyles;
    document.head.appendChild(tag);
  }
}

const CATEGORIES = ['Food', 'Housing', 'Utilities', 'Entertainment', 'Income'];

export default function AddTransactionForm({ onAdd }) {
  injectFormStyles();

  const [formData, setFormData] = useState({
    date: '', description: '', amount: '', category: 'Food', type: 'expense',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setType = (type) => {
    setError('');
    setFormData(f => ({ ...f, type }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.description || !formData.amount) {
      setError('Please fill out all fields before submitting.');
      return;
    }
    onAdd({
      id: Date.now(),
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
    });
    setFormData({ date: '', description: '', amount: '', category: 'Food', type: 'expense' });
    setError('');
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  return (
    <div className="atf-card">
      {/* Header */}
      <div className="atf-header">
        <div className="atf-icon">🔑</div>
        <div>
          <div className="atf-title">Add New Transaction</div>
          <div className="atf-subtitle">Admin access only</div>
        </div>
      </div>

      {error && (
        <div className="atf-error"><span>⚠️</span>{error}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* Row 1 – Date, Description (wide), Amount */}
        <div className="atf-grid">
          <div className="atf-field">
            <label className="atf-label">Date</label>
            <input className="atf-input" type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>

          <div className="atf-field span-2">
            <label className="atf-label">Description</label>
            <input
              className="atf-input" type="text" name="description"
              placeholder="e.g. Spotify, Rent, Freelance"
              value={formData.description} onChange={handleChange}
            />
          </div>

          <div className="atf-field">
            <label className="atf-label">Amount ($)</label>
            <input
              className="atf-input" type="number" name="amount"
              placeholder="0.00" value={formData.amount}
              onChange={handleChange} min="0" step="0.01"
            />
          </div>
        </div>

        {/* Row 2 – Category, Type toggle, Submit (desktop) */}
        <div className="atf-grid-2">
          <div className="atf-field">
            <label className="atf-label">Category</label>
            <div className="atf-select-wrap">
              <select className="atf-select" name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="atf-field">
            <label className="atf-label">Type</label>
            <div className="atf-type-toggle">
              <button type="button" className={`atf-type-btn ${formData.type === 'expense' ? 'active-expense' : ''}`} onClick={() => setType('expense')}>
                📉 Expense
              </button>
              <button type="button" className={`atf-type-btn ${formData.type === 'income' ? 'active-income' : ''}`} onClick={() => setType('income')}>
                📈 Income
              </button>
            </div>
          </div>

          {/* Mobile: submit inside grid row */}
          <div className="atf-submit-wrap">
            <button type="submit" className="atf-submit">+ Add</button>
          </div>
        </div>

        {/* Desktop footer submit (hidden on mobile via CSS) */}
        <div className="atf-footer">
          <button type="submit" className="atf-submit">+ Add Transaction</button>
        </div>

      </form>
    </div>
  );
}