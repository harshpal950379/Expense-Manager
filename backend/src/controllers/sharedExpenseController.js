const SharedExpense = require('../models/SharedExpense');
const Group = require('../models/Group');

// @route   POST /api/shared-expenses
// @desc    Create shared expense
const createSharedExpense = async (req, res) => {
  try {
    const { groupId, amount, description, splitType, splits } = req.body;

    if (!groupId || !amount || !description) {
      return res.status(400).json({
        message: 'Group ID, amount, and description are required',
      });
    }

    // Verify group exists and user is member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some((m) => m.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not a group member' });
    }

    // Calculate splits
    let calculatedSplits = [];

    if (splitType === 'equal') {
      const splitAmount = amount / group.members.length;
      calculatedSplits = group.members.map((memberId) => ({
        userId: memberId,
        amountOwed: Math.round(splitAmount * 100) / 100,
      }));
    } else if (splitType === 'manual' && splits) {
      calculatedSplits = splits;
    }

    const sharedExpense = await SharedExpense.create({
      group: groupId,
      paidBy: req.userId,
      amount,
      description,
      splitType: splitType || 'equal',
      splits: calculatedSplits,
      date: new Date(),
    });

    await sharedExpense.populate('paidBy', 'name email');
    await sharedExpense.populate('splits.userId', 'name email');

    res.status(201).json({
      success: true,
      sharedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/shared-expenses/:groupId
// @desc    Get shared expenses for group
const getSharedExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some((m) => m.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not a group member' });
    }

    const sharedExpenses = await SharedExpense.find({ group: groupId })
      .populate('paidBy', 'name email')
      .populate('splits.userId', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: sharedExpenses.length,
      sharedExpenses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/shared-expenses/:id
// @desc    Update shared expense
const updateSharedExpense = async (req, res) => {
  try {
    let sharedExpense = await SharedExpense.findById(req.params.id);

    if (!sharedExpense) {
      return res.status(404).json({ message: 'Shared expense not found' });
    }

    // Only paidBy can update
    if (sharedExpense.paidBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the payer can edit' });
    }

    const { amount, description, splits } = req.body;

    sharedExpense = await SharedExpense.findByIdAndUpdate(
      req.params.id,
      {
        amount: amount || sharedExpense.amount,
        description: description || sharedExpense.description,
        splits: splits || sharedExpense.splits,
      },
      { new: true }
    )
      .populate('paidBy', 'name email')
      .populate('splits.userId', 'name email');

    res.status(200).json({ success: true, sharedExpense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/shared-expenses/:id
// @desc    Delete shared expense
const deleteSharedExpense = async (req, res) => {
  try {
    const sharedExpense = await SharedExpense.findById(req.params.id);

    if (!sharedExpense) {
      return res.status(404).json({ message: 'Shared expense not found' });
    }

    if (sharedExpense.paidBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the payer can delete' });
    }

    await SharedExpense.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Shared expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/groups/:groupId/balance
// @desc    Get balance sheet for group
const getBalanceSheet = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some((m) => m._id.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not a group member' });
    }

    const sharedExpenses = await SharedExpense.find({ group: groupId });

    // Calculate balance for each user
    const balances = {};
    group.members.forEach((member) => {
      balances[member._id.toString()] = {
        userId: member._id,
        name: member.name,
        email: member.email,
        totalOwed: 0,
        totalPaid: 0,
        balance: 0,
      };
    });

    sharedExpenses.forEach((expense) => {
      // User who paid
      balances[expense.paidBy.toString()].totalPaid += expense.amount;

      // Calculate who owes what
      expense.splits.forEach((split) => {
        balances[split.userId.toString()].totalOwed += split.amountOwed;
      });
    });

    // Calculate net balance
    Object.keys(balances).forEach((userId) => {
      balances[userId].balance = balances[userId].totalPaid - balances[userId].totalOwed;
    });

    // Generate settle-up suggestions
    const settlements = [];
    const balanceArray = Object.values(balances);

    for (let i = 0; i < balanceArray.length; i++) {
      for (let j = i + 1; j < balanceArray.length; j++) {
        const user1 = balanceArray[i];
        const user2 = balanceArray[j];

        if (user1.balance > 0 && user2.balance < 0) {
          const amount = Math.min(user1.balance, Math.abs(user2.balance));
          settlements.push({
            from: user2.name,
            to: user1.name,
            amount: Math.round(amount * 100) / 100,
          });
          user1.balance -= amount;
          user2.balance += amount;
        } else if (user1.balance < 0 && user2.balance > 0) {
          const amount = Math.min(user2.balance, Math.abs(user1.balance));
          settlements.push({
            from: user1.name,
            to: user2.name,
            amount: Math.round(amount * 100) / 100,
          });
          user1.balance += amount;
          user2.balance -= amount;
        }
      }
    }

    res.status(200).json({
      success: true,
      balances: Object.values(balances),
      settlements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSharedExpense,
  getSharedExpenses,
  updateSharedExpense,
  deleteSharedExpense,
  getBalanceSheet,
};
