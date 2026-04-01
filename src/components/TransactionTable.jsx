// src/components/TransactionTable.jsx
import React, { useState } from 'react';

export default function TransactionTable({ transactions, role }) {
  // Local state for our filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Extract unique categories for the dropdown dynamically
  const categories = ['All', ...new Set(transactions.map(t => t.category))];

  // Derived state: Filter the transactions before mapping them
  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || txn.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // --- UPDATED STYLES FOR DARK MODE ---
  const styles = {
    container: { backgroundColor: 'var(--card-bg)', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    controlsHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', flex: 1, fontSize: '16px', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' },
    select: { padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '16px', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { borderBottom: '2px solid var(--border-color)', padding: '12px', color: 'var(--text-muted)', fontWeight: 'bold' },
    td: { borderBottom: '1px solid var(--border-color)', padding: '12px', color: 'var(--text-main)' },
    deleteBtn: { padding: '6px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <h3 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Recent Transactions</h3>

      {/* FILTER CONTROLS */}
      <div style={styles.controlsHeader}>
        <input 
          type="text" 
          placeholder="Search transactions..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* THE TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Amount</th>
            {/* Conditional Header for Admin Role */}
            {role === 'admin' && <th style={styles.th}>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((txn) => (
              <tr key={txn.id}>
                <td style={styles.td}>{txn.date}</td>
                <td style={styles.td}>{txn.description}</td>
                <td style={styles.td}>
                  {/* FIX 1: Category Badges now use CSS variables */}
                  <span style={{ 
                    backgroundColor: 'var(--bg-color)', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '14px' 
                  }}>
                    {txn.category}
                  </span>
                </td>
                {/* FIX 2: Expense amounts use var(--text-main) instead of #111 */}
                <td style={{ ...styles.td, color: txn.type === 'income' ? '#16a34a' : 'var(--text-main)', fontWeight: 'bold' }}>
                  {txn.type === 'income' ? '+' : '-'}${txn.amount.toFixed(2)}
                </td>
                {/* Conditional Action Button for Admin Role */}
                {role === 'admin' && (
                  <td style={styles.td}>
                    <button style={styles.deleteBtn} onClick={() => alert(`Delete txn ${txn.id} (Logic coming soon)`)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              {/* FIX 3: Empty search text uses var(--text-muted) instead of #666 */}
              <td colSpan={role === 'admin' ? 5 : 4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}