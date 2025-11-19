const Income = require('../models/Income');

// @route   POST /api/income
// @desc    Create income
const createIncome = async (req, res) => {
  try {
    const { amount, source, date, note, tags } = req.body;

    if (!amount || !source) {
      return res.status(400).json({ message: 'Amount and source are required' });
    }

    const income = await Income.create({
      user: req.userId,
      amount,
      source,
      date: date || new Date(),
      note: note || '',
      tags: tags || [],
    });

    await income.populate('user', 'name email');

    res.status(201).json({
      success: true,
      income,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/income
// @desc    Get all income for user with filters
const getIncome = async (req, res) => {
  try {
    const { source, startDate, endDate, minAmount, maxAmount } = req.query;

    let filter = { user: req.userId };

    if (source && source !== 'All') {
      filter.source = source;
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

    const incomes = await Income.find(filter)
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: incomes.length,
      incomes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/income/:id
// @desc    Get single income
const getSingleIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id).populate('user', 'name email');

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (income.user._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, income });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/income/:id
// @desc    Update income
const updateIncome = async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (income.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { amount, source, date, note, tags } = req.body;

    income = await Income.findByIdAndUpdate(
      req.params.id,
      {
        amount: amount || income.amount,
        source: source || income.source,
        date: date || income.date,
        note: note !== undefined ? note : income.note,
        tags: tags || income.tags,
      },
      { new: true }
    ).populate('user', 'name email');

    res.status(200).json({ success: true, income });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/income/:id
// @desc    Delete income
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (income.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Income.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/income/summary/monthly
// @desc    Get monthly income summary
const getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 1);

    const incomes = await Income.find({
      user: req.userId,
      date: { $gte: startDate, $lt: endDate },
    });

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    // Source-wise breakdown
    const sourceWise = {};
    incomes.forEach((inc) => {
      if (!sourceWise[inc.source]) {
        sourceWise[inc.source] = 0;
      }
      sourceWise[inc.source] += inc.amount;
    });

    res.status(200).json({
      success: true,
      month: currentMonth + 1,
      year: currentYear,
      totalIncome,
      sourceWise,
      incomes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIncome,
  getIncome,
  getSingleIncome,
  updateIncome,
  deleteIncome,
  getMonthlySummary,
};
