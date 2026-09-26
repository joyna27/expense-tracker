const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getCategoryBreakdown,
  getMonthlyTrend,
  getSummary
} = require('../controllers/transactionController');

router.use(auth);

router.get('/analytics/category-breakdown', getCategoryBreakdown);
router.get('/analytics/monthly-trend', getMonthlyTrend);
router.get('/analytics/summary', getSummary);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
