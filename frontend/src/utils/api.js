import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to make requests with auth token
const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

// Expense APIs
export const expenseAPI = {
  create: (data, token) =>
    axios.post(`${API_URL}/expenses`, data, { headers: getHeaders(token) }),
  getAll: (params, token) =>
    axios.get(`${API_URL}/expenses`, {
      params,
      headers: getHeaders(token),
    }),
  getOne: (id, token) =>
    axios.get(`${API_URL}/expenses/${id}`, { headers: getHeaders(token) }),
  update: (id, data, token) =>
    axios.put(`${API_URL}/expenses/${id}`, data, { headers: getHeaders(token) }),
  delete: (id, token) =>
    axios.delete(`${API_URL}/expenses/${id}`, { headers: getHeaders(token) }),
  getMonthlySummary: (params, token) =>
    axios.get(`${API_URL}/expenses/summary/monthly`, {
      params,
      headers: getHeaders(token),
    }),
};

// Income APIs
export const incomeAPI = {
  create: (data, token) =>
    axios.post(`${API_URL}/income`, data, { headers: getHeaders(token) }),
  getAll: (params, token) =>
    axios.get(`${API_URL}/income`, {
      params,
      headers: getHeaders(token),
    }),
  getOne: (id, token) =>
    axios.get(`${API_URL}/income/${id}`, { headers: getHeaders(token) }),
  update: (id, data, token) =>
    axios.put(`${API_URL}/income/${id}`, data, { headers: getHeaders(token) }),
  delete: (id, token) =>
    axios.delete(`${API_URL}/income/${id}`, { headers: getHeaders(token) }),
  getMonthlySummary: (params, token) =>
    axios.get(`${API_URL}/income/summary/monthly`, {
      params,
      headers: getHeaders(token),
    }),
};

// Group APIs
export const groupAPI = {
  create: (data, token) =>
    axios.post(`${API_URL}/groups`, data, { headers: getHeaders(token) }),
  getAll: (token) =>
    axios.get(`${API_URL}/groups`, { headers: getHeaders(token) }),
  getOne: (id, token) =>
    axios.get(`${API_URL}/groups/${id}`, { headers: getHeaders(token) }),
  update: (id, data, token) =>
    axios.put(`${API_URL}/groups/${id}`, data, { headers: getHeaders(token) }),
  addMember: (id, memberId, token) =>
    axios.post(
      `${API_URL}/groups/${id}/members`,
      { memberId },
      { headers: getHeaders(token) }
    ),
  removeMember: (id, memberId, token) =>
    axios.delete(`${API_URL}/groups/${id}/members/${memberId}`, {
      headers: getHeaders(token),
    }),
  delete: (id, token) =>
    axios.delete(`${API_URL}/groups/${id}`, { headers: getHeaders(token) }),
};

// Shared Expense APIs
export const sharedExpenseAPI = {
  create: (data, token) =>
    axios.post(`${API_URL}/shared-expenses`, data, { headers: getHeaders(token) }),
  getByGroup: (groupId, token) =>
    axios.get(`${API_URL}/shared-expenses/${groupId}`, { headers: getHeaders(token) }),
  update: (id, data, token) =>
    axios.put(`${API_URL}/shared-expenses/${id}`, data, { headers: getHeaders(token) }),
  delete: (id, token) =>
    axios.delete(`${API_URL}/shared-expenses/${id}`, { headers: getHeaders(token) }),
  getBalanceSheet: (groupId, token) =>
    axios.get(`${API_URL}/shared-expenses/balance/${groupId}`, {
      headers: getHeaders(token),
    }),
};
