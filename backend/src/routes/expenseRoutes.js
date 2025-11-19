const express = require('express');
const auth = require('../middleware/auth');
const {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
} = require('../controllers/expenseController');

const router = express.Router();

router.post('/', auth, createExpense);
router.get('/', auth, getExpenses);
router.get('/summary/monthly', auth, getMonthlySummary);
router.get('/:id', auth, getExpense);
router.put('/:id', auth, updateExpense);
router.delete('/:id', auth, deleteExpense);

module.exports = router;
