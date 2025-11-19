const express = require('express');
const auth = require('../middleware/auth');
const {
  createIncome,
  getIncome,
  getSingleIncome,
  updateIncome,
  deleteIncome,
  getMonthlySummary,
} = require('../controllers/incomeController');

const router = express.Router();

router.post('/', auth, createIncome);
router.get('/', auth, getIncome);
router.get('/summary/monthly', auth, getMonthlySummary);
router.get('/:id', auth, getSingleIncome);
router.put('/:id', auth, updateIncome);
router.delete('/:id', auth, deleteIncome);

module.exports = router;
