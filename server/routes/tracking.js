const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const authMiddleware = require('../middleware/auth');

router.get('/:trackingId', authMiddleware, async (req, res) => {
  try {
    const businessId = req.user.business?._id || req.user.business;
    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: 'No business linked to this account',
      });
    }

    const shipment = await Shipment.findOne({
      trackingId: req.params.trackingId.toUpperCase(),
    }).select(
      'business trackingId status carrierName carrierAWB ' +
      'origin.city origin.pincode ' +
      'destination.city destination.pincode destination.receiverName ' +
      'timeline estimatedDelivery actualDelivery ' +
      'package.weight createdAt'
    );

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Tracking ID not found',
      });
    }

    if (shipment.business.toString() !== businessId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to see another business shipment',
      });
    }

    const data = shipment.toObject();
    delete data.business;

    return res.json({ success: true, shipment: data });

  } catch (err) {
    console.error('Tracking error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
