const prisma = require('../config/db');
const cache = require('../cache/InMemoryCache');

const getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      userId: req.user.role === 'ADMIN' ? undefined : req.user.id,
      ...(type && { type }),
      ...(category && { category }),
      ...((startDate || endDate) && {
        date: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      }),
      ...(search && {
        category: { contains: search, mode: 'insensitive' },
      }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { date: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, date } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type,
        category,
        date: date ? new Date(date) : new Date(),
        userId: req.user.id,
      },
    });

    // Invalidate analytics cache for this user
    cache.invalidatePattern(`analytics_${req.user.id}`);

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date } = req.body;

    // Check ownership
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Transaction not found' });
    if (req.user.role !== 'ADMIN' && existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        type,
        category,
        date: date ? new Date(date) : undefined,
      },
    });

    cache.invalidatePattern(`analytics_${req.user.id}`);

    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Transaction not found' });
    if (req.user.role !== 'ADMIN' && existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.transaction.delete({ where: { id } });

    cache.invalidatePattern(`analytics_${req.user.id}`);

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const cacheKey = 'categories_list';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const categories = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      distinct: ['category'],
      select: { category: true },
    });

    const list = categories.map(c => c.category);
    cache.set(cacheKey, list, 3600); // 1 hour

    res.json(list);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
};
