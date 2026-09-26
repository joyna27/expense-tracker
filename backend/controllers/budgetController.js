const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

exports.setBudget = async (req, res) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId, category, month, year },
      { monthlyLimit },
      { upsert: true, new: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBudgetStatus = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const budgets = await Budget.find({ userId: req.userId, month, year });

    const spending = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          type: 'expense',
          date: { $gte: new Date(year, month - 1, 1), $lte: new Date(year, month, 0, 23, 59, 59) }
        }
      },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } }
    ]);

    const status = budgets.map(b => {
      const spentEntry = spending.find(s => s._id === b.category);
      const spent = spentEntry ? spentEntry.spent : 0;
      const percentUsed = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;
      return {
        category: b.category,
        limit: b.monthlyLimit,
        spent,
        percentUsed,
        status: percentUsed >= 100 ? 'over' : percentUsed >= 80 ? 'warning' : 'ok'
      };
    });

    res.json(status);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
