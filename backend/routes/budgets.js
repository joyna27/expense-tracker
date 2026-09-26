const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { setBudget, getBudgetStatus } = require('../controllers/budgetController');

router.use(auth);
router.post('/', setBudget);
router.get('/status', getBudgetStatus);

module.exports = router;
