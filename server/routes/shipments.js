const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const Business = require('../models/Business');
const authMiddleware = require('../middleware/auth');

// POST /shipments — Book new shipment
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Step 1 - Request received');
    console.log('User:', req.user._id);
    console.log('Business:', req.user.business);

    const {
      originPincode, originCity, originState,
      originAddress, originContactName, originContactPhone,
      destPincode, destCity, destState,
      destAddress, receiverName, receiverPhone,
      weight, length, width, height,
      category, declaredValue,
      codEnabled, codAmount,
      carrierName, quotedPrice,
      internalNotes,
    } = req.body;

    console.log('Step 2 - Body destructured');

    if (!originPincode || !destPincode || !receiverName || !receiverPhone || !destAddress || !weight) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    console.log('Step 3 - Validation passed');

    const shipment = new Shipment({
      business:    req.user.business,
      bookedBy:    req.user._id,
      carrierName: carrierName || 'Delhivery',
      origin: {
        pincode:      originPincode,
        city:         originCity     || '',
        state:        originState    || '',
        address:      originAddress  || '',
        contactName:  originContactName  || '',
        contactPhone: originContactPhone || '',
      },
      destination: {
        pincode:       destPincode,
        city:          destCity  || '',
        state:         destState || '',
        address:       destAddress,
        receiverName:  receiverName,
        receiverPhone: receiverPhone,
      },
      package: {
        weight:        parseFloat(weight),
        dimensions:    { l: length||0, w: width||0, h: height||0 },
        category:      category || 'general',
        declaredValue: declaredValue || 0,
        cod: {
          enabled: codEnabled || false,
          amount:  codAmount  || 0,
        },
      },
      pricing: {
        quoted: quotedPrice || 0,
      },
      status: 'BOOKED',
      timeline: [{
        status:    'BOOKED',
        location:  originCity || originPincode,
        timestamp: new Date(),
        note:      'Shipment booked on Movetto',
      }],
      internalNotes: internalNotes || '',
    });

    console.log('Step 4 - Shipment object built');

    await shipment.save();

    console.log('Step 5 - Saved to DB:', shipment.trackingId);

    await Business.findByIdAndUpdate(req.user.business, {
      $inc: { shipmentCount: 1 }
    });

    console.log('Step 6 - Business count updated');

    return res.status(201).json({
      success: true,
      message: 'Shipment booked successfully',
      shipment,
    });

  } catch (err) {
    console.error('Book shipment error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /shipments — List all shipments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, carrier, page = 1, limit = 20, startDate, endDate } = req.query;

    const filter = { business: req.user.business };
    if (status)  filter.status = status.toUpperCase();
    if (carrier) filter.carrierName = new RegExp(carrier, 'i');
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate)   filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [shipments, total] = await Promise.all([
      Shipment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-timeline -rawCarrierData'),
      Shipment.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page:    parseInt(page),
      pages:   Math.ceil(total / parseInt(limit)),
      shipments,
    });

  } catch (err) {
    console.error('List shipments error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /shipments/:id — Single shipment detail
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      _id:      req.params.id,
      business: req.user.business,
    }).populate('bookedBy', 'name email');

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    return res.json({ success: true, shipment });

  } catch (err) {
    console.error('Get shipment error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /shipments/:id/cancel — Cancel shipment
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      _id:      req.params.id,
      business: req.user.business,
    });

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const nonCancellable = ['DELIVERED', 'RTO_DELIVERED', 'CANCELLED'];
    if (nonCancellable.includes(shipment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a shipment with status: ${shipment.status}`,
      });
    }

    shipment.status = 'CANCELLED';
    shipment.timeline.push({
      status:    'CANCELLED',
      timestamp: new Date(),
      note:      req.body.reason || 'Cancelled by business',
    });

    await shipment.save();

    return res.json({
      success: true,
      message: 'Shipment cancelled',
      shipment,
    });

  } catch (err) {
    console.error('Cancel shipment error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;