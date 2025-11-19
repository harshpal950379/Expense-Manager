const Expense = require('../models/Expense');
const autoCategorizeExpense = require('../utils/autoCategori');

// @route   POST /api/expenses
// @desc    Create expense
const createExpense = async (req, res) => {
  try {
    const { amount, category, date, note, tags, isShared, sharedGroup } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ message: 'Amount and category are required' });
    }

    // Auto-categorize if needed
    let finalCategory = category;
    if (category === 'Auto') {
      finalCategory = autoCategorizeExpense(note, '');
    }

    const expense = await Expense.create({
      user: req.userId,
      amount,
      category: finalCategory,
      date: date || new Date(),
      note: note || '',
      tags: tags || [],
      isShared: isShared || false,
      sharedGroup: sharedGroup || null,
    });

    await expense.populate('user', 'name email');

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/expenses
// @desc    Get all expenses for user with filters
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, minAmount, maxAmount, tags } = req.query;

    let filter = { user: req.userId };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    const expenses = await Expense.find(filter)
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/expenses/:id
// @desc    Get single expense
const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('user', 'name email');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/expenses/:id
// @desc    Update expense
const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { amount, category, date, note, tags } = req.body;

    // Auto-categorize if needed
    let finalCategory = category || expense.category;
    if (category === 'Auto') {
      finalCategory = autoCategorizeExpense(note || expense.note, '');
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        amount: amount || expense.amount,
        category: finalCategory,
        date: date || expense.date,
        note: note !== undefined ? note : expense.note,
        tags: tags || expense.tags,
      },
      { new: true }
    ).populate('user', 'name email');

    res.status(200).json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/expenses/summary/monthly
// @desc    Get monthly expense summary
const getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 1);

    const expenses = await Expense.find({
      user: req.userId,
      date: { $gte: startDate, $lt: endDate },
    });

    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Category-wise breakdown
    const categoryWise = {};
    expenses.forEach((exp) => {
      if (!categoryWise[exp.category]) {
        categoryWise[exp.category] = 0;
      }
      categoryWise[exp.category] += exp.amount;
    });

    res.status(200).json({
      success: true,
      month: currentMonth + 1,
      year: currentYear,
      totalExpense,
      categoryWise,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
};
