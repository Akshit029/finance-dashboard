// src/components/AddTransactionForm.jsx
import React, { useState } from 'react';

export default function AddTransactionForm({ onAdd }) {
  // Local state for the form inputs
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    category: 'Food', // Default value
    type: 'expense'   // Default value
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation to ensure fields aren't empty
    if (!formData.date || !formData.description || !formData.amount) {
      alert("Please fill out all fields.");
      return;
    }

    // Create the new transaction object
    const newTransaction = {
      id: Date.now(), // Generate a simple unique ID
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type
    };

    // Pass it to the parent component
    onAdd(newTransaction);

    // Reset the form
    setFormData({ date: '', description: '', amount: '', category: 'Food', type: 'expense' });
  };

  const styles = {
    container: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' },
    formGroup: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1, minWidth: '150px' },
    button: { padding: '10px 20px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <h4 style={{ margin: '0 0 15px 0', color: '#334155' }}>🔒 Admin Panel: Add New Transaction</h4>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <input type="date" name="date" value={formData.date} onChange={handleChange} style={styles.input} required />
          <input type="text" name="description" placeholder="Description (e.g. Spotify)" value={formData.description} onChange={handleChange} style={styles.input} required />
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} style={styles.input} min="0" step="0.01" required />
        </div>
        <div style={styles.formGroup}>
          <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
            <option value="Food">Food</option>
            <option value="Housing">Housing</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Income">Income</option>
          </select>
          <select name="type" value={formData.type} onChange={handleChange} style={styles.input}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" style={styles.button}>+ Add Transaction</button>
        </div>
      </form>
    </div>
  );
}