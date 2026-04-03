const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, error } = require('../utils/response');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, language } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return error(res, 'Email already registered.', 409);

    const user = await User.create({ name, email, password, role, language });
    const token = signToken(user._id);

    return success(res, { token, user: user.toPublic() }, 'Registration successful', 201);
  } catch (err) {
    console.error(err);
    return error(res, 'Registration failed.', 500);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password are required.', 400);

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return error(res, 'Invalid email or password.', 401);
    }

    const token = signToken(user._id);
    return success(res, { token, user: user.toPublic() }, 'Login successful');
  } catch (err) {
    console.error(err);
    return error(res, 'Login failed.', 500);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  return success(res, { user: req.user }, 'Profile fetched');
};

// PATCH /api/auth/me
const updateMe = async (req, res) => {
  try {
    const allowed = ['name', 'language', 'grade', 'subjects', 'studyHoursPerDay', 'avatar'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return success(res, { user }, 'Profile updated');
  } catch (err) {
    console.error(err);
    return error(res, 'Update failed.', 500);
  }
};

module.exports = { register, login, getMe, updateMe };
