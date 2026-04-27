const prisma = require('../config/db');

// Admin only: Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Admin only: Update a user's role
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'USER', 'READ_ONLY'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Admin only: Delete a user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
