const mongoose = require('mongoose');

const RouteIntelSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  carrier:  { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier', required: true },

  originPincode: String,
  destPincode:   String,

  stats: {
    totalShipments:     { type: Number, default: 0 },
    onTimeCount:        { type: Number, default: 0 },
    onTimeRate:         Number,   // computed
    avgDeliveryDays:    Number,
    avgRate:            Number,   // ₹
    lowestRate:         Number,
    lastShipmentDate:   Date,
  },

  recommendation: {
    isBestForRoute:  { type: Boolean, default: false },
    isCheapest:      { type: Boolean, default: false },
    isFastest:       { type: Boolean, default: false },
    score:           Number, // 0–100, computed by AI job
  },

}, { timestamps: true });

// Compound index for fast lookups
RouteIntelSchema.index({ business: 1, carrier: 1, originPincode: 1, destPincode: 1 });

module.exports = mongoose.model('RouteIntel', RouteIntelSchema);