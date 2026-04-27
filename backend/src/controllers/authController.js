const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { generateToken } = require('../utils/tokenUtils');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(`[Auth] Attempting registration for: ${email}`);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    const token = generateToken(user);

    res.status(201).json({
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`[Auth] Attempting login for: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };
