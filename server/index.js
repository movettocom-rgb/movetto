const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

try {
  const authRoute = require('./routes/auth');
  app.use('/api/v1/auth', authRoute);
  console.log('✓ auth route loaded');
} catch(e) { console.error('✗ auth FAILED:', e.message); }

try {
  const shipmentsRoute = require('./routes/shipments');
  app.use('/api/v1/shipments', shipmentsRoute);
  console.log('✓ shipments route loaded');
} catch(e) { console.error('✗ shipments FAILED:', e.message); }

try {
  const trackingRoute = require('./routes/tracking');
  app.use('/api/v1/track', trackingRoute);
  console.log('✓ tracking route loaded');
} catch(e) { console.error('✗ tracking FAILED:', e.message); }

try {
  const carriersRoute = require('./routes/carriers');
  app.use('/api/v1/carriers', carriersRoute);
  console.log('✓ carriers route loaded');
} catch(e) { console.error('✗ carriers FAILED:', e.message); }

try {
  const analyticsRoute = require('./routes/analytics');
  app.use('/api/v1/analytics', analyticsRoute);
  console.log('✓ analytics route loaded');
} catch(e) { console.error('✗ analytics FAILED:', e.message); }

app.get('/', (req, res) => {
  res.json({ status: 'Movetto API running' });
});
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Server is responding' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('✓ Server running on port 5000');
    });
  })
  .catch(err => console.error('MongoDB error:', err));