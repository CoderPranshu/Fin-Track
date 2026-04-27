const express = require('express');
const { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction, 
  getCategories 
} = require('../controllers/transactionController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/', getTransactions);
router.get('/categories', getCategories);
router.post('/', authorizeRoles(['ADMIN', 'USER']), createTransaction);
router.put('/:id', authorizeRoles(['ADMIN', 'USER']), updateTransaction);
router.delete('/:id', authorizeRoles(['ADMIN', 'USER']), deleteTransaction);

module.exports = router;
