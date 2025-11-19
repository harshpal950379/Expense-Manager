import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { expenseAPI, incomeAPI } from '../utils/api';
import { formatCurrency, getMonthName } from '../utils/helpers';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

export default function Dashboard() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryWise: {},
    sourceWise: {},
    recentExpenses: [],
    recentIncomes: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const [expenseRes, incomeRes, allExpenses, allIncomes] = await Promise.all([
        expenseAPI.getMonthlySummary({ month: currentMonth + 1, year: currentYear }, token),
        incomeAPI.getMonthlySummary({ month: currentMonth + 1, year: currentYear }, token),
        expenseAPI.getAll({}, token),
        incomeAPI.getAll({}, token),
      ]);

      const totalExpense = expenseRes.data.totalExpense || 0;
      const totalIncome = incomeRes.data.totalIncome || 0;

      // Prepare chart data for category-wise expenses
      const categoryData = Object.entries(expenseRes.data.categoryWise || {}).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      // Prepare chart data for source-wise income
      const sourceData = Object.entries(incomeRes.data.sourceWise || {}).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      setData({
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        categoryWise: categoryData,
        sourceWise: sourceData,
        recentExpenses: allExpenses.data.expenses?.slice(0, 5) || [],
        recentIncomes: allIncomes.data.incomes?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white p-8 rounded-lg flex-1 mr-4">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-blue-100">{getMonthName(new Date().getMonth())} {new Date().getFullYear()}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">💰 Total Income</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(data.totalIncome)}</p>
          <p className="text-xs text-gray-500 mt-2">This Month</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">💸 Total Expenses</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(data.totalExpense)}</p>
          <p className="text-xs text-gray-500 mt-2">This Month</p>
        </div>

        <div className={`p-6 rounded-lg shadow border-l-4 ${data.balance >= 0 ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-500' : 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-500'}`}>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">📊 Balance</p>
          <p className={`text-3xl font-bold ${data.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
            {formatCurrency(data.balance)}
          </p>
          <p className="text-xs text-gray-500 mt-2">{data.balance >= 0 ? 'Positive' : 'Negative'}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        {data.categoryWise.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📈 Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryWise}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.categoryWise.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Source Bar Chart */}
        {data.sourceWise.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 Income by Source</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.sourceWise}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">💡 Average Daily Expense</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(data.totalExpense / 30)}</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
          <p className="text-green-700 dark:text-green-300 text-sm mb-2">✅ Savings Rate</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {data.totalIncome > 0 ? ((data.balance / data.totalIncome) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
          <p className="text-purple-700 dark:text-purple-300 text-sm mb-2">🎯 Expense Ratio</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {data.totalIncome > 0 ? ((data.totalExpense / data.totalIncome) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🏷️ Recent Expenses</h2>
          <div className="space-y-2">
            {data.recentExpenses.length > 0 ? (
              data.recentExpenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/30">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{expense.category}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{expense.note}</p>
                  </div>
                  <p className="text-red-600 dark:text-red-400 font-bold">-{formatCurrency(expense.amount)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No expenses yet</p>
            )}
          </div>
        </div>

        {/* Recent Income */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💵 Recent Income</h2>
          <div className="space-y-2">
            {data.recentIncomes.length > 0 ? (
              data.recentIncomes.map((income) => (
                <div key={income._id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded border border-green-100 dark:border-green-900/30">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{income.source}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{income.note}</p>
                  </div>
                  <p className="text-green-600 dark:text-green-400 font-bold">+{formatCurrency(income.amount)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No income yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
