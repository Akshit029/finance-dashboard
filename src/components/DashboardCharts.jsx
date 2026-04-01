// src/components/DashboardCharts.jsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardCharts({ transactions }) {
  // --- 1. PREPARE DATA FOR CATEGORY PIE CHART (Expenses Only) ---
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Group expenses by category using reduce
  const categoryDataMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  // Convert the object back into an array for Recharts
  const pieData = Object.keys(categoryDataMap).map(key => ({
    name: key,
    value: categoryDataMap[key]
  }));

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];

  // --- 2. PREPARE DATA FOR TIME-BASED BAR CHART (Income vs Expense per day) ---
  // Group by Date
  const dateDataMap = transactions.reduce((acc, curr) => {
    if (!acc[curr.date]) {
      acc[curr.date] = { date: curr.date, income: 0, expense: 0 };
    }
    if (curr.type === 'income') acc[curr.date].income += curr.amount;
    if (curr.type === 'expense') acc[curr.date].expense += curr.amount;
    return acc;
  }, {});

  // Convert to array and sort by date chronologically
  const barData = Object.values(dateDataMap).sort((a, b) => new Date(a.date) - new Date(b.date));

  const styles = {
    container: { display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' },
    chartCard: { flex: '1 1 400px', backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '350px' },
    title: { marginBottom: '20px', fontSize: '16px', color: '#444' }
  };

  return (
    <div style={styles.container}>
      
      {/* CATEGORICAL VISUALIZATION (Requirement 1b) */}
      <div style={styles.chartCard}>
        <h3 style={styles.title}>Spending by Category</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* TIME-BASED VISUALIZATION (Requirement 1a) */}
      <div style={styles.chartCard}>
        <h3 style={styles.title}>Cashflow Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            <Bar dataKey="income" fill="#16a34a" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#dc2626" name="Expense" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}