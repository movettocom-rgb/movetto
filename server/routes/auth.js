const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Business = require('../models/Business');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const authMiddleware = require('../middleware/auth');

const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');
const CLIENT_URL = trimTrailingSlash(process.env.CLIENT_URL) || 'http://localhost:5173';
const SERVER_URL = trimTrailingSlash(process.env.SERVER_URL) || `http://localhost:${process.env.PORT || 5000}`;
const GOOGLE_AUTH_CONFIGURED = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const authRedirect = (params) => {
  const query = new URLSearchParams(params).toString();
  return `${CLIENT_URL}/auth${query ? `?${query}` : ''}`;
};

/* ─── Google OAuth (only if credentials exist) ─── */
if (GOOGLE_AUTH_CONFIGURED) {
  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  `${SERVER_URL}/api/v1/auth/google/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      if (!email) {
        return done(new Error('Google account did not return an email'), null);
      }

      let user = await User.findOne({
        $or: [{ googleId: profile.id }, { email }],
      });

      if (!user) {
        user = await User.create({
          name:         profile.displayName || email.split('@')[0],
          email,
          googleId:     profile.id,
          authProvider: 'google',
          isVerified:   true,
        });
      } else if (!user.googleId) {
        user.googleId   = profile.id;
        user.isVerified = true;
        await user.save();
      }

      return done(null, user);
    } catch (err) { return done(err, null); }
  }));

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try { done(null, await User.findById(id)); } catch (err) { done(err, null); }
  });
}

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });
};

/* ─── POST /auth/register ─── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, businessName, city, pincode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Step 1: create user — pre-save hook hashes password ONCE
    const user = await User.create({
      name,
      email:    email.toLowerCase(),
      phone:    phone || '',
      password,
      role:     'owner',
    });

    // Step 2: create business with real user._id as owner
    const business = await Business.create({
      name:    businessName || `${name}'s Business`,
      owner:   user._id,
      address: { city: city || '', pincode: pincode || '' },
    });

    // Step 3: generate tokens
    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Step 4: link business + save refreshToken via findByIdAndUpdate
    // (bypasses pre-save hook — no password re-hash)
    await User.findByIdAndUpdate(user._id, { business: business._id, refreshToken });

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      accessToken,
      user: {
        _id:      user._id,
        name:     user.name,
        email:    user.email,
        phone:    user.phone,
        role:     user.role,
        business: { _id: business._id, name: business.name, subscription: business.subscription },
      },
    });

  } catch (err) {
    console.error('Register error:', err.message, err.stack);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── POST /auth/login ─── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('business');

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken });
    setRefreshCookie(res, refreshToken);

    return res.json({
      success: true,
      accessToken,
      user: {
        _id:      user._id,
        name:     user.name,
        email:    user.email,
        phone:    user.phone,
        role:     user.role,
        business: user.business,
      },
    });

  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── POST /auth/logout ─── */
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res.clearCookie('refreshToken');
    return res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── GET /auth/me ─── */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('business');
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── POST /auth/refresh ─── */
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = verifyRefreshToken(token);
    const user    = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const accessToken     = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });
    setRefreshCookie(res, newRefreshToken);

    return res.json({ success: true, accessToken });

  } catch (err) {
    return res.status(401).json({ success: false, message: 'Refresh token invalid or expired' });
  }
});

/* ─── GET /auth/google ─── */
router.get('/google', (req, res, next) => {
  if (!GOOGLE_AUTH_CONFIGURED) {
    return res.redirect(authRedirect({ error: 'google_not_configured' }));
  }

  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account',
  })(req, res, next);
});

/* ─── GET /auth/google/callback ─── */
router.get('/google/callback',
  (req, res, next) => {
    if (!GOOGLE_AUTH_CONFIGURED) {
      return res.redirect(authRedirect({ error: 'google_not_configured' }));
    }

    return passport.authenticate('google', {
      session: false,
      failureRedirect: authRedirect({ error: 'google_failed' }),
    })(req, res, next);
  },
  async (req, res) => {
    try {
      let user = req.user;
      if (!user.business) {
        const business = await Business.create({ name: `${user.name}'s Business`, owner: user._id });
        user = await User.findByIdAndUpdate(
          user._id,
          { business: business._id },
          { new: true }
        ).populate('business');
      } else {
        user = await User.findById(user._id).populate('business');
      }

      const accessToken  = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      await User.findByIdAndUpdate(user._id, { refreshToken });
      setRefreshCookie(res, refreshToken);

      const userData = JSON.stringify({
        _id:      user._id,
        name:     user.name,
        email:    user.email,
        phone:    user.phone,
        role:     user.role,
        business: user.business,
      });

      return res.redirect(authRedirect({ token: accessToken, user: userData }));
    } catch (err) {
      console.error('Google callback error:', err.message);
      return res.redirect(authRedirect({ error: 'server_error' }));
    }
  }
);

// PUT /auth/profile — update name and phone
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), phone: phone?.trim() },
      { new: true }
    ).populate('business');
    return res.json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /auth/password — change password
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be 8+ characters' });
    }
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
