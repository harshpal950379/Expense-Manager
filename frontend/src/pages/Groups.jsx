import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupAPI } from '../utils/api';
import { formatCurrency } from '../utils/helpers';

export default function Groups() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchGroups();
  }, [token]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getAll(token);
      setGroups(response.data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await groupAPI.create(formData, token);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will delete all shared expenses in this group.')) {
      try {
        await groupAPI.delete(id, token);
        fetchGroups();
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Groups</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage shared expenses with friends</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {showForm ? '✕ Cancel' : '+ Create Group'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">👥 Total Groups</p>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{groups.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-2">👫 Total Members</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300">
            {groups.reduce((sum, g) => sum + (g.members?.length || 0), 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">📊 Avg Members/Group</p>
          <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
            {groups.length > 0 ? (groups.reduce((sum, g) => sum + (g.members?.length || 0), 0) / groups.length).toFixed(1) : 0}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Group Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Trip to Goa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Add group description..."
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Group
            </button>
          </form>
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group._id}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer border border-gray-200 dark:border-gray-700"
              onClick={() => navigate(`/groups/${group._id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{group.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{group.description}</p>
                </div>
                <span className="text-2xl">👥</span>
              </div>

              <div className="mb-4 py-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  👫 {group.members.length} Member{group.members.length !== 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.members.slice(0, 3).map((member) => (
                    <div key={member._id} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-700">
                      {member.name}
                    </div>
                  ))}
                  {group.members.length > 3 && (
                    <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                      +{group.members.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/groups/${group._id}`);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(group._id);
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-600 dark:text-gray-400">
            No groups yet. Create one to start splitting expenses!
          </div>
        )}
      </div>
    </div>
  );
}
