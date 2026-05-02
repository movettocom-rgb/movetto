const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const authMiddleware = require('../middleware/auth');

// ─── GET /analytics/summary — Dashboard KPIs ─────────────
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const businessId = req.user.business;

    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    if (period === '7d')  startDate.setDate(now.getDate() - 7);
    if (period === '30d') startDate.setDate(now.getDate() - 30);
    if (period === '3m')  startDate.setMonth(now.getMonth() - 3);
    if (period === '1y')  startDate.setFullYear(now.getFullYear() - 1);

    const filter = {
      business:  businessId,
      createdAt: { $gte: startDate },
    };

    // Run all queries in parallel
    const [
      totalShipments,
      deliveredShipments,
      rtoShipments,
      spendData,
      carrierBreakdown,
      statusBreakdown,
      recentShipments,
    ] = await Promise.all([

      // Total count
      Shipment.countDocuments(filter),

      // Delivered count
      Shipment.countDocuments({ ...filter, status: 'DELIVERED' }),

      // RTO count
      Shipment.countDocuments({
        ...filter,
        status: { $in: ['RTO_INITIATED', 'RTO_DELIVERED'] }
      }),

      // Total spend
      Shipment.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$pricing.quoted' } } },
      ]),

      // Spend per carrier
      Shipment.aggregate([
        { $match: filter },
        { $group: {
          _id:   '$carrierName',
          spend: { $sum: '$pricing.quoted' },
          count: { $sum: 1 },
        }},
        { $sort: { spend: -1 } },
      ]),

      // Shipments by status
      Shipment.aggregate([
        { $match: { business: businessId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Last 10 shipments
      Shipment.find(filter)
        .sort({ createdAt: -1 })
        .limit(10)
        .select('trackingId status carrierName pricing.quoted origin.city destination.city createdAt'),
    ]);

    const totalSpend    = spendData[0]?.total || 0;
    const onTimeRate    = totalShipments > 0
      ? ((deliveredShipments / totalShipments) * 100).toFixed(1)
      : 0;

    return res.json({
      success: true,
      period,
      summary: {
        totalShipments,
        deliveredShipments,
        rtoShipments,
        totalSpend,
        onTimeRate: parseFloat(onTimeRate),
      },
      carrierBreakdown,
      statusBreakdown,
      recentShipments,
    });

  } catch (err) {
    console.error('Analytics error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /analytics/carriers — Per carrier performance ────
router.get('/carriers', authMiddleware, async (req, res) => {
  try {
    const businessId = req.user.business;

    const carrierStats = await Shipment.aggregate([
      { $match: { business: businessId } },
      { $group: {
        _id:              '$carrierName',
        totalShipments:   { $sum: 1 },
        delivered:        { $sum: { $cond: [{ $eq: ['$status','DELIVERED'] }, 1, 0] } },
        rto:              { $sum: { $cond: [{ $in: ['$status',['RTO_INITIATED','RTO_DELIVERED']] }, 1, 0] } },
        totalSpend:       { $sum: '$pricing.quoted' },
        avgRate:          { $avg: '$pricing.quoted' },
      }},
      { $addFields: {
        onTimeRate: {
          $cond: [
            { $gt: ['$totalShipments', 0] },
            { $multiply: [{ $divide: ['$delivered', '$totalShipments'] }, 100] },
            0
          ]
        }
      }},
      { $sort: { totalShipments: -1 } },
    ]);

    return res.json({ success: true, carrierStats });

  } catch (err) {
    console.error('Carrier analytics error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;