const mongoose = require('mongoose');

const CarrierSchema = new mongoose.Schema({
  name:  { type: String, required: true }, // "Delhivery"
  slug:  { type: String, required: true, unique: true }, // "delhivery"
  logo:  String,
  isActive: { type: Boolean, default: true },

  // Credentials per business
  credentials: [{
    business:  { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    apiKey:    String,
    apiSecret: String,
    accountId: String,
    isConnected: { type: Boolean, default: false },
  }],

  // Performance stats per business
  stats: [{
    business:    { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    onTimeRate:  Number, // percentage
    avgDeliveryDays: Number,
    totalShipments:  Number,
    lastUpdated: Date,
  }],

  // Base rate config
  baseRates: {
    withinCity:   Number, // ₹
    withinState:  Number,
    metro:        Number,
    restOfIndia:  Number,
    perKgExtra:   Number,
  },

  supportedCategories: [String],
  maxWeight: Number, // kg
  codAvailable: { type: Boolean, default: true },

}, { timestamps: true });

module.exports = mongoose.model('Carrier', CarrierSchema);