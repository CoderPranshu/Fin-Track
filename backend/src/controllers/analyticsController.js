const prisma = require('../config/db');
const cache = require('../cache/InMemoryCache');

const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cacheKey = `analytics_${userId}_dashboard`;
    
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    // Get current month start
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total Income vs Expense for current month
    const monthlyStats = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        date: { gte: startOfMonth }
      },
      _sum: { amount: true }
    });

    // Category-wise breakdown (All-time for better overview)
    const categoryBreakdown = await prisma.transaction.groupBy({
      by: ['category', 'type'],
      where: {
        userId
      },
      _sum: { amount: true }
    });

    // Monthly trends (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: sixMonthsAgo }
      },
      orderBy: { date: 'asc' }
    });

    // Process trends
    const trends = {};
    transactions.forEach(t => {
      const month = t.date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!trends[month]) {
        trends[month] = { month, income: 0, expense: 0 };
      }
      if (t.type === 'INCOME') {
        trends[month].income += t.amount;
      } else {
        trends[month].expense += t.amount;
      }
    });

    const result = {
      monthlyStats: monthlyStats.reduce((acc, curr) => {
        acc[curr.type.toLowerCase()] = curr._sum.amount || 0;
        return acc;
      }, { income: 0, expense: 0 }),
      categoryBreakdown: categoryBreakdown.map(c => ({
        category: c.category,
        type: c.type,
        amount: c._sum.amount
      })),
      trends: Object.values(trends)
    };

    cache.set(cacheKey, result, 900); // 15 minutes

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardData };
