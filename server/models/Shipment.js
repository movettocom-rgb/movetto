const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  trackingId: { type: String, unique: true },
  business:   { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  bookedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  carrier:    { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  carrierAWB:  String,
  carrierName: String,

  origin: {
    pincode:      { type: String, required: true },
    city:         String,
    state:        String,
    address:      String,
    contactName:  String,
    contactPhone: String,
  },

  destination: {
    pincode:       { type: String, required: true },
    city:          String,
    state:         String,
    address:       { type: String, required: true },
    receiverName:  { type: String, required: true },
    receiverPhone: { type: String, required: true },
  },

  package: {
    weight:        { type: Number, required: true },
    dimensions:    { l: Number, w: Number, h: Number },
    volumetric:    Number,
    chargedWeight: Number,
    category: {
      type:    String,
      enum:    ['general','pharma','textile','electronics','perishable'],
      default: 'general',
    },
    declaredValue: Number,
    cod: {
      enabled: { type: Boolean, default: false },
      amount:  Number,
    },
  },

  pricing: {
    quoted:     Number,
    actual:     Number,
    margin:     Number,
    currency:   { type: String, default: 'INR' },
    reconciled: { type: Boolean, default: false },
  },

  status: {
    type: String,
    enum: [
      'DRAFT','BOOKED','LABEL_GENERATED','PICKED_UP',
      'IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED',
      'DELIVERY_FAILED','RTO_INITIATED','RTO_DELIVERED','CANCELLED'
    ],
    default: 'DRAFT',
  },

  timeline: [{
    status:    String,
    location:  String,
    timestamp: { type: Date, default: Date.now },
    note:      String,
    rawCarrierData: mongoose.Schema.Types.Mixed,
  }],

  estimatedDelivery: Date,
  actualDelivery:    Date,
  labelUrl:          String,
  whatsappNotified:  { type: Boolean, default: false },
  internalNotes:     String,

}, { timestamps: true });

ShipmentSchema.pre('save', async function() {
  if (!this.trackingId) {
    const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.trackingId = `MV-${new Date().getFullYear()}-${rand}`;
  }
  if (this.package && this.package.dimensions) {
    const { l, w, h } = this.package.dimensions;
    if (l && w && h) {
      this.package.volumetric    = parseFloat(((l * w * h) / 5000).toFixed(2));
      this.package.chargedWeight = Math.max(this.package.weight, this.package.volumetric);
    }
  }
});

module.exports = mongoose.model('Shipment', ShipmentSchema);