const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  }],
  address: {
    city:    String,
    state:   String,
    pincode: String,
    full:    String,
  },
  gstin:        { type: String, trim: true },
  businessType: {
    type: String,
    enum: ['textile','electronics','pharma','fmcg','auto','other'],
    default: 'other',
  },
  monthlyVolume: {
    type: String,
    enum: ['<50','50-200','200-1000','1000-5000','5000+'],
  },
  whatsappNumber: { type: String },
  subscription: {
    plan:      { type: String, enum: ['starter','growth','enterprise'], default: 'starter' },
    status:    { type: String, enum: ['active','trial','expired'], default: 'trial' },
    trialEnds: { type: Date, default: () => new Date(+new Date() + 14*24*60*60*1000) },
    razorpaySubscriptionId: String,
  },
  shipmentCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Business', BusinessSchema);