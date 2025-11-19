const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      positive: true,
    },
    category: {
      type: String,
      enum: [
        'Food',
        'Travel',
        'Entertainment',
        'Shopping',
        'Utilities',
        'Health',
        'Education',
        'Other',
      ],
      required: [true, 'Category is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    sharedGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
