const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Business = require('../models/Business');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const authMiddleware = require('../middleware/auth');

// ─── REGISTER ────────────────────────────────────────────
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be 8+ characters'),
  body('businessName').trim().notEmpty().withMessage('Business name is required'),
], async (req, res) => {
  try {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone, businessName, city, pincode, businessType, monthlyVolume, gstin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Step 1 — Create user first (no business yet)
const user = await User.create({
  name,
  email,
  password,
  phone,
});

// Step 2 — Create business with owner already set
const business = await Business.create({
  name: businessName,
  owner: user._id,   // ← owner exists now
  address: { city, pincode },
  businessType,
  monthlyVolume,
  gstin,
});

// Step 3 — Link business back to user
user.business = business._id;
await user.save({ validateBeforeSave: false });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in http-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        business: {
          id: business._id,
          name: business.name,
          plan: business.subscription.plan,
        },
      },
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── LOGIN ────────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password').populate('business');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        business: {
          id: user.business._id,
          name: user.business.name,
          plan: user.business.subscription.plan,
        },
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── REFRESH TOKEN ────────────────────────────────────────
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user._id);
    return res.json({ success: true, accessToken });

  } catch (err) {
    return res.status(401).json({ success: false, message: 'Refresh token expired' });
  }
});

// ─── LOGOUT ───────────────────────────────────────────────
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });
    res.clearCookie('refreshToken');
    return res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET CURRENT USER ─────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).populate('business');
  return res.json({ success: true, user });
});

module.exports = router;