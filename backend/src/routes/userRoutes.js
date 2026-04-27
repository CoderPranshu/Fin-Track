const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');

// All routes here are restricted to ADMIN only
router.use(protect);
router.use(authorizeRoles('ADMIN'));

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
