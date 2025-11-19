const mongoose = require('mongoose');

const sharedExpenseSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      positive: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    splitType: {
      type: String,
      enum: ['equal', 'manual'],
      default: 'equal',
    },
    splits: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        amountOwed: {
          type: Number,
          required: true,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SharedExpense', sharedExpenseSchema);
