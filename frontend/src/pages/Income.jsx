import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { incomeAPI } from '../utils/api';
import { formatCurrency, formatDate, exportToCSV } from '../utils/helpers';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

export default function Income() {
  const { token } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({
    source: 'All',
    startDate: '',
    endDate: '',
  });
  const [formData, setFormData] = useState({
    amount: '',
    source: 'Salary',
    date: new Date().toISOString().split('T')[0],
    note: '',
    tags: '',
  });

  useEffect(() => {
    fetchIncomes();
  }, [token, filter]);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.source !== 'All') params.source = filter.source;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;

      const response = await incomeAPI.getAll(params, token);
      setIncomes(response.data.incomes);
    } catch (error) {
      console.error('Error fetching income:', error);
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
        await incomeAPI.update(editingId, data, token);
      } else {
        await incomeAPI.create(data, token);
      }

      setFormData({
        amount: '',
        source: 'Salary',
        date: new Date().toISOString().split('T')[0],
        note: '',
        tags: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchIncomes();
    } catch (error) {
      console.error('Error saving income:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await incomeAPI.delete(id, token);
        fetchIncomes();
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  const handleEdit = (income) => {
    setFormData({
      amount: income.amount,
      source: income.source,
      date: income.date.split('T')[0],
      note: income.note,
      tags: income.tags.join(', '),
    });
    setEditingId(income._id);
    setShowForm(true);
  };

  const handleExport = () => {
    const data = incomes.map((i) => ({
      Date: formatDate(i.date),
      Source: i.source,
      Amount: i.amount,
      Note: i.note,
      Tags: i.tags.join(', '),
    }));
    exportToCSV(data, 'income.csv');
  };

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  // Calculate source-wise data
  const sourceData = incomes.reduce((acc, income) => {
    const existing = acc.find(item => item.name === income.source);
    if (existing) {
      existing.value += income.amount;
    } else {
      acc.push({ name: income.source, value: income.amount });
    }
    return acc;
  }, []);

  if (loading && incomes.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Income</h1>
          <p className="text-gray-600 dark:text-gray-400">Total: {formatCurrency(totalIncome)}</p>
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
            {showForm ? 'Cancel' : 'Add Income'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex gap-4 flex-wrap">
        <select
          value={filter.source}
          onChange={(e) => setFilter({ ...filter, source: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option>All</option>
          <option>Salary</option>
          <option>Freelance</option>
          <option>Investment</option>
          <option>Bonus</option>
          <option>Gift</option>
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
        {/* Source Chart */}
        {sourceData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 Income by Source</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📈 Statistics</h2>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <p className="text-green-600 dark:text-green-400 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-blue-600 dark:text-blue-400 text-sm">Average per Income</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(incomes.length > 0 ? totalIncome / incomes.length : 0)}</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <p className="text-purple-600 dark:text-purple-400 text-sm">Number of Income Entries</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{incomes.length}</p>
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
                <label className="block text-sm font-medium mb-2">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option>Salary</option>
                  <option>Freelance</option>
                  <option>Investment</option>
                  <option>Bonus</option>
                  <option>Gift</option>
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
                  placeholder="salary, monthly"
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
              {editingId ? 'Update Income' : 'Add Income'}
            </button>
          </form>
        </div>
      )}

      {/* Income List */}
      <div className="grid gap-4">
        {incomes.length > 0 ? (
          incomes.map((income) => (
            <div key={income._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{income.source}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{income.note}</p>
                <p className="text-xs text-gray-500">{formatDate(income.date)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">+{formatCurrency(income.amount)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(income)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(income._id)}
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
            No income records found
          </div>
        )}
      </div>
    </div>
  );
}
