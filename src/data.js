// src/data.js

export const initialTransactions = [
  // ── April Income ──
  { id: 1,  date: '2026-04-01', description: 'Tech Corp Salary',      amount: 4000, category: 'Income',        type: 'income'  },
  { id: 6,  date: '2026-04-12', description: 'Freelance Design',       amount: 500,  category: 'Income',        type: 'income'  },

  // ── April Expenses ──
  { id: 2,  date: '2026-04-02', description: 'Whole Foods',            amount: 150,  category: 'Food',          type: 'expense' },
  { id: 3,  date: '2026-04-05', description: 'Downtown Apartment Rent',amount: 1200, category: 'Housing',       type: 'expense' },
  { id: 4,  date: '2026-04-08', description: 'Comcast Internet',       amount: 60,   category: 'Utilities',     type: 'expense' },
  { id: 5,  date: '2026-04-10', description: 'AMC Theatres',           amount: 30,   category: 'Entertainment', type: 'expense' },
  { id: 7,  date: '2026-04-14', description: 'Spotify Premium',        amount: 11,   category: 'Entertainment', type: 'expense' },
  { id: 8,  date: '2026-04-15', description: 'Electric Bill',          amount: 85,   category: 'Utilities',     type: 'expense' },
  { id: 9,  date: '2026-04-18', description: 'Chipotle',               amount: 18,   category: 'Food',          type: 'expense' },
  { id: 10, date: '2026-04-22', description: 'Netflix',                amount: 15,   category: 'Entertainment', type: 'expense' },
  { id: 11, date: '2026-04-25', description: 'Trader Joe\'s',          amount: 95,   category: 'Food',          type: 'expense' },
  { id: 12, date: '2026-04-28', description: 'Water & Gas Bill',       amount: 45,   category: 'Utilities',     type: 'expense' },
];

// ── Category metadata (used for consistent badge colors across the app) ──
export const CATEGORY_META = {
  Income:        { emoji: '💰', color: '#2d7a4f', bg: 'rgba(45,122,79,0.1)'   },
  Food:          { emoji: '🍔', color: '#f97316', bg: 'rgba(249,115,22,0.1)'  },
  Housing:       { emoji: '🏠', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
  Utilities:     { emoji: '⚡', color: '#ca8a04', bg: 'rgba(234,179,8,0.12)'  },
  Entertainment: { emoji: '🎬', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_META);