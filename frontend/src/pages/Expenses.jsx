import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { expenseAPI } from '../utils/api';
import { formatCurrency, formatDate, exportToCSV } from '../utils/helpers';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

export default function Expenses() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({
    category: 'All',
    startDate: '',
    endDate: '',
  });
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: '',
    tags: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, [token, filter]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.category !== 'All') params.category = filter.category;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;

      const response = await expenseAPI.getAll(params, token);
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingId) {
        await expenseAPI.update(editingId, data, token);
      } else {
        await expenseAPI.create(data, token);
      }

      setFormData({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: '',
        tags: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await expenseAPI.delete(id, token);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split('T')[0],
      note: expense.note,
      tags: expense.tags.join(', '),
    });
    setEditingId(expense._id);
    setShowForm(true);
  };

  const handleExport = () => {
    const data = expenses.map((e) => ({
      Date: formatDate(e.date),
      Category: e.category,
      Amount: e.amount,
      Note: e.note,
      Tags: e.tags.join(', '),
    }));
    exportToCSV(data, 'expenses.csv');
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate category-wise data
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  if (loading && expenses.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400">Total: {formatCurrency(totalExpense)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex gap-4 flex-wrap">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option>All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Entertainment</option>
          <option>Shopping</option>
          <option>Utilities</option>
          <option>Health</option>
          <option>Education</option>
          <option>Other</option>
        </select>
        <input
          type="date"
          value={filter.startDate}
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <input
          type="date"
          value={filter.endDate}
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        {categoryData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📈 Statistics</h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
              <p className="text-red-600 dark:text-red-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-blue-600 dark:text-blue-400 text-sm">Average per Expense</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(expenses.length > 0 ? totalExpense / expenses.length : 0)}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <p className="text-green-600 dark:text-green-400 text-sm">Number of Expenses</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option>Food</option>
                  <option>Travel</option>
                  <option>Entertainment</option>
                  <option>Shopping</option>
                  <option>Utilities</option>
                  <option>Health</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="food, lunch"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Note</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Add notes..."
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingId ? 'Update Expense' : 'Add Expense'}
            </button>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="grid gap-4">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{expense.category}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{expense.note}</p>
                <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">-{formatCurrency(expense.amount)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No expenses found
          </div>
        )}
      </div>
    </div>
  );
}
