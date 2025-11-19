const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
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
    source: {
      type: String,
      required: [true, 'Income source is required'],
      enum: [
        'Salary',
        'Freelance',
        'Investment',
        'Bonus',
        'Gift',
        'Other',
      ],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
