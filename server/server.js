const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const fabricService = require('./services/fabricService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const { router: authRoutes } = require('./routes/auth');
const collectionRoutes = require('./routes/collection');
const trackingRoutes = require('./routes/tracking');
const blockchainRoutes = require('./routes/blockchain');
const ipfsRoutes = require('./routes/ipfs');

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later'
  }
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'https://herbionyx.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'HerbionYX API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/ipfs', ipfsRoutes);

// Quality testing routes
app.use('/api/quality', require('./routes/quality'));

// Processing routes
app.use('/api/processing', require('./routes/processing'));

// Manufacturing routes
app.use('/api/manufacturing', require('./routes/manufacturing'));

// Admin routes
app.use('/api/admin', require('./routes/admin'));

// SMS webhook endpoint
app.post('/webhook/sms', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    // Handle incoming SMS webhooks from Fast2SMS
    const smsData = JSON.parse(req.body.toString());
    
    // Process SMS and create blockchain transactions
    // This would integrate with SMS service to handle offline collections
    
    res.json({
      success: true,
      message: 'SMS processed successfully'
    });
  } catch (error) {
    console.error('SMS webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process SMS webhook'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Request entity too large'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🌿 HerbionYX API Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize Fabric connection
  fabricService.connect().then(success => {
    if (success) {
      console.log('🔗 Connected to Hyperledger Fabric network');
    } else {
      console.log('⚠️  Failed to connect to Hyperledger Fabric network - running in demo mode');
      console.log('💡 To enable full blockchain functionality, start the Fabric network:');
      console.log('   cd fabric-network/scripts && ./network.sh up');
    }
  }).catch(error => {
    console.log('⚠️  Fabric network unavailable - running in demo mode');
    console.log('💡 To enable full blockchain functionality, start the Fabric network:');
    console.log('   cd fabric-network/scripts && ./network.sh up');
  });
});

module.exports = app;