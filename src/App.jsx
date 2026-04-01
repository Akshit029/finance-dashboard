// src/App.jsx
import TransactionTable from './components/TransactionTable';
import DashboardCharts from './components/DashboardCharts';
import AddTransactionForm from './components/AddTransactionForm';

import React, { useState } from 'react';
import { initialTransactions } from './data';

function App() {
// --- STATE MANAGEMENT ---
const [transactions, setTransactions] = useState(initialTransactions);
const [role, setRole] = useState('viewer');

// Add this function:
const handleAddTransaction = (newTxn) => {
  // Put the new transaction at the beginning of the array
  setTransactions([newTxn, ...transactions]); 
};

  // --- DERIVED STATE (Math for Summary Cards) ---
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  // --- INSIGHTS MATH (Requirement 4) ---
const highestExpense = transactions
  .filter(t => t.type === 'expense')
  .reduce((max, current) => (current.amount > max.amount ? current : max), { amount: 0, category: 'None' });

  // --- INLINE STYLES (Keeps setup simple without needing Tailwind yet) ---
  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    cardGrid: { display: 'flex', gap: '20px', marginBottom: '30px' },
    card: { flex: 1, backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    button: { padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }
  };

  // --- RENDER ---
  return (
    <div style={styles.container}>
      
      {/* 1. HEADER & ROLE TOGGLE */}
      <header style={styles.header}>
        <h2>Finance Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Role: <strong>{role.toUpperCase()}</strong></span>
          <button 
            style={styles.button}
            onClick={() => setRole(role === 'viewer' ? 'admin' : 'viewer')}
          >
            Switch to {role === 'viewer' ? 'Admin' : 'Viewer'}
          </button>
        </div>
      </header>

      {/* 2. SUMMARY CARDS */}
      <section style={styles.cardGrid}>
        <div style={styles.card}>
          <p style={{ color: '#666', marginBottom: '8px' }}>Total Balance</p>
          <h3 style={{ fontSize: '28px', color: totalBalance >= 0 ? '#111' : '#dc2626' }}>
            ${totalBalance.toFixed(2)}
          </h3>
        </div>
        
        <div style={styles.card}>
          <p style={{ color: '#666', marginBottom: '8px' }}>Total Income</p>
          <h3 style={{ fontSize: '28px', color: '#16a34a' }}>
            +${totalIncome.toFixed(2)}
          </h3>
        </div>

        <div style={styles.card}>
          <p style={{ color: '#666', marginBottom: '8px' }}>Total Expenses</p>
          <h3 style={{ fontSize: '28px', color: '#dc2626' }}>
            -${totalExpenses.toFixed(2)}
          </h3>
        </div>
      </section>

      {/* ADMIN CONTROLS: Only show if role is admin */}
  {role === 'admin' && (
    <AddTransactionForm onAdd={handleAddTransaction} />
  )}

  {/* 3. TRANSACTION TABLE */}
  <TransactionTable transactions={transactions} role={role} />

      {/* 4. INSIGHTS SECTION */}
   <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px', borderLeft: '4px solid #0284c7' }}>
     <strong>💡 Insight:</strong> Your highest spending category so far is <strong>{highestExpense.category}</strong> (${highestExpense.amount}).
   </div>

   {/* 5. VISUALIZATIONS */}
   <DashboardCharts transactions={transactions} />

    </div>
  );
}

export default App;