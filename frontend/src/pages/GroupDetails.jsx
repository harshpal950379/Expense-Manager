import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupAPI, sharedExpenseAPI } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [group, setGroup] = useState(null);
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    splitType: 'equal',
  });

  useEffect(() => {
    fetchGroupDetails();
  }, [id, token]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const [groupRes, balanceRes] = await Promise.all([
        groupAPI.getOne(id, token),
        sharedExpenseAPI.getBalanceSheet(id, token),
      ]);
      setGroup(groupRes.data.group);
      setSharedExpenses(groupRes.data.sharedExpenses);
      setBalanceSheet(balanceRes.data);
    } catch (error) {
      console.error('Error fetching group details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await sharedExpenseAPI.create(
        {
          groupId: id,
          ...formData,
          amount: parseFloat(formData.amount),
        },
        token
      );
      setFormData({ amount: '', description: '', splitType: 'equal' });
      setShowExpenseForm(false);
      fetchGroupDetails();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberId) return;
    try {
      await groupAPI.addMember(id, newMemberId, token);
      setNewMemberId('');
      setShowAddMember(false);
      fetchGroupDetails();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member?')) {
      try {
        await groupAPI.removeMember(id, memberId, token);
        fetchGroupDetails();
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await sharedExpenseAPI.delete(expenseId, token);
        fetchGroupDetails();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!group) {
    return <div className="text-center py-8">Group not found</div>;
  }

  const isCreator = group.createdBy._id === user?.id;
  const totalGroupExpense = sharedExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Prepare chart data for payer-wise expenses
  const payerData = sharedExpenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.paidBy.name);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.paidBy.name, value: expense.amount });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white p-8 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <p className="text-blue-100">{group.description}</p>
          </div>
          <button
            onClick={() => navigate('/groups')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">👥 Members</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{group.members.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-1">💰 Total Spent</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(totalGroupExpense)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">📊 Expenses</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{sharedExpenses.length}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-1">💵 Per Person</p>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{formatCurrency(group.members.length > 0 ? totalGroupExpense / group.members.length : 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        {payerData.length > 0 && (
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💸 Expenses by Payer</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={payerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Members Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">👥 Members</h2>
            {isCreator && (
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                + Add
              </button>
            )}
          </div>

          {showAddMember && isCreator && (
            <form onSubmit={handleAddMember} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="text"
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                placeholder="User ID"
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white mb-2 text-sm"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700"
              >
                Add Member
              </button>
            </form>
          )}

          <div className="space-y-2">
            {group.members.map((member) => (
              <div key={member._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{member.email}</p>
                  {member._id === group.createdBy._id && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">Creator</p>
                  )}
                </div>
                {isCreator && member._id !== group.createdBy._id && (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Balance Sheet Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Balance Sheet</h2>

          {balanceSheet?.settlements && balanceSheet.settlements.length > 0 ? (
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Settlements Needed:</h3>
              {balanceSheet.settlements.map((settlement, idx) => (
                <div key={idx} className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <p className="text-orange-700 dark:text-orange-300">
                    <strong>{settlement.from}</strong> owes <strong>{settlement.to}</strong>{' '}
                    <strong>{formatCurrency(settlement.amount)}</strong>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-6">
              <p className="text-green-700 dark:text-green-300">All settled up! 🎉</p>
            </div>
          )}

          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Individual Balance:</h3>
          <div className="space-y-2">
            {balanceSheet?.balances.map((balance) => (
              <div key={balance.userId} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{balance.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Paid: {formatCurrency(balance.totalPaid)} | Owes: {formatCurrency(balance.totalOwed)}
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${
                      balance.balance >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {balance.balance >= 0 ? '+' : ''}{formatCurrency(balance.balance)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shared Expenses Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shared Expenses</h2>
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {showExpenseForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        {showExpenseForm && (
          <form onSubmit={handleAddExpense} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Split Type</label>
                <select
                  value={formData.splitType}
                  onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
                >
                  <option value="equal">Equal Split</option>
                  <option value="manual">Manual Split</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
                placeholder="e.g., Dinner"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Shared Expense
            </button>
          </form>
        )}

        <div className="space-y-3">
          {sharedExpenses.length > 0 ? (
            sharedExpenses.map((expense) => (
              <div key={expense._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Paid by {expense.paidBy.name} on {formatDate(expense.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(expense.amount)}
                    </p>
                    {expense.paidBy._id === user?.id && (
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 mt-2"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Split: {expense.splitType}</p>
                  <div className="mt-2 space-y-1">
                    {expense.splits.map((split) => (
                      <p key={split.userId._id}>
                        • {split.userId.name}: {formatCurrency(split.amountOwed)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-600 dark:text-gray-400">
              No shared expenses yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
