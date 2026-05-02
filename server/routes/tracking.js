const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

router.get('/:trackingId', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingId: req.params.trackingId.toUpperCase(),
    }).select(
      'trackingId status carrierName carrierAWB ' +
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

    return res.json({ success: true, shipment });

  } catch (err) {
    console.error('Tracking error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;