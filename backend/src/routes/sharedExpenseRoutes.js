const express = require('express');
const auth = require('../middleware/auth');
const {
  createSharedExpense,
  getSharedExpenses,
  updateSharedExpense,
  deleteSharedExpense,
  getBalanceSheet,
} = require('../controllers/sharedExpenseController');

const router = express.Router();

router.post('/', auth, createSharedExpense);
router.get('/:groupId', auth, getSharedExpenses);
router.put('/:id', auth, updateSharedExpense);
router.delete('/:id', auth, deleteSharedExpense);
router.get('/balance/:groupId', auth, getBalanceSheet);

module.exports = router;
