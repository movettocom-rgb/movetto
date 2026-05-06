const express = require('express');
const router = express.Router();
const Carrier = require('../models/Carrier');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const carriers = await Carrier.find({ isActive: true }).select('-credentials');
    return res.json({ success: true, carriers });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/rates', authMiddleware, async (req, res) => {
  try {
    const { originPin, destPin, weight } = req.query;

    if (!originPin || !destPin || !weight) {
      return res.status(400).json({
        success: false,
        message: 'originPin, destPin and weight are required',
      });
    }

    const w = parseFloat(weight);

    const mockRates = [
      { carrier: 'Delhivery',  rate: Math.round(w * 45 + 60), eta: '2-3 days', onTimeRate: 96 },
      { carrier: 'Shiprocket', rate: Math.round(w * 42 + 55), eta: '3-4 days', onTimeRate: 91 },
      { carrier: 'Bluedart',   rate: Math.round(w * 65 + 80), eta: '1-2 days', onTimeRate: 98 },
      { carrier: 'XpressBees', rate: Math.round(w * 40 + 50), eta: '2-3 days', onTimeRate: 93 },
      { carrier: 'DTDC',       rate: Math.round(w * 35 + 45), eta: '3-5 days', onTimeRate: 85 },
    ].sort((a, b) => a.rate - b.rate);

    return res.json({
      success: true,
      query: { originPin, destPin, weight },
      rates: mockRates,
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/connect', authMiddleware, async (req, res) => {
  try {
    const { carrierSlug, apiKey, apiSecret, accountId } = req.body;

    if (!carrierSlug) {
      return res.status(400).json({ success: false, message: 'carrierSlug is required' });
    }

    const carrier = await Carrier.findOne({ slug: carrierSlug });
    if (!carrier) {
      return res.status(404).json({ success: false, message: 'Carrier not found' });
    }

    const businessId = req.user.business?._id || req.user.business;
    const existing = carrier.credentials.find(
      c => c.business.toString() === businessId.toString()
    );

    if (existing) {
      existing.apiKey      = apiKey;
      existing.apiSecret   = apiSecret;
      existing.accountId   = accountId;
      existing.isConnected = true;
    } else {
      carrier.credentials.push({
        business:    businessId,
        apiKey,
        apiSecret,
        accountId,
        isConnected: true,
      });
    }

    await carrier.save();

    return res.json({
      success: true,
      message: `${carrier.name} connected successfully`,
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;