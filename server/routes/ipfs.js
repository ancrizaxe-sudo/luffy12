const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('./auth');
const ipfsService = require('../services/ipfsService');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload JSON to IPFS
router.post('/upload-json', authenticateToken, async (req, res) => {
  try {
    const { jsonData, name } = req.body;
    
    if (!jsonData) {
      return res.status(400).json({
        success: false,
        error: 'JSON data is required'
      });
    }

    const result = await ipfsService.uploadJSON(jsonData, name || 'metadata');
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'JSON uploaded to IPFS successfully' : 'Failed to upload JSON to IPFS'
    });
  } catch (error) {
    console.error('Upload JSON error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload JSON to IPFS',
      details: error.message
    });
  }
});

// Upload file to IPFS
router.post('/upload-file', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'File is required'
      });
    }

    const result = await ipfsService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'File uploaded to IPFS successfully' : 'Failed to upload file to IPFS'
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file to IPFS',
      details: error.message
    });
  }
});

// Get file from IPFS
router.get('/get-file/:ipfsHash', async (req, res) => {
  try {
    const { ipfsHash } = req.params;
    
    if (!ipfsHash) {
      return res.status(400).json({
        success: false,
        error: 'IPFS hash is required'
      });
    }

    const result = await ipfsService.getFile(ipfsHash);
    
    res.json({
      success: result.success,
      data: result.data,
      message: result.success ? 'File retrieved from IPFS successfully' : 'Failed to retrieve file from IPFS'
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get file from IPFS',
      details: error.message
    });
  }
});

// Create collection metadata
router.post('/create-collection-metadata', authenticateToken, async (req, res) => {
  try {
    const { collectionData } = req.body;
    
    if (!collectionData) {
      return res.status(400).json({
        success: false,
        error: 'Collection data is required'
      });
    }

    const result = await ipfsService.createCollectionMetadata(collectionData);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Collection metadata created successfully' : 'Failed to create collection metadata'
    });
  } catch (error) {
    console.error('Create collection metadata error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create collection metadata',
      details: error.message
    });
  }
});

// Create quality test metadata
router.post('/create-quality-test-metadata', authenticateToken, async (req, res) => {
  try {
    const { testData } = req.body;
    
    if (!testData) {
      return res.status(400).json({
        success: false,
        error: 'Test data is required'
      });
    }

    const result = await ipfsService.createQualityTestMetadata(testData);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Quality test metadata created successfully' : 'Failed to create quality test metadata'
    });
  } catch (error) {
    console.error('Create quality test metadata error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create quality test metadata',
      details: error.message
    });
  }
});

// Create processing metadata
router.post('/create-processing-metadata', authenticateToken, async (req, res) => {
  try {
    const { processData } = req.body;
    
    if (!processData) {
      return res.status(400).json({
        success: false,
        error: 'Process data is required'
      });
    }

    const result = await ipfsService.createProcessingMetadata(processData);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Processing metadata created successfully' : 'Failed to create processing metadata'
    });
  } catch (error) {
    console.error('Create processing metadata error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create processing metadata',
      details: error.message
    });
  }
});

// Create manufacturing metadata
router.post('/create-manufacturing-metadata', authenticateToken, async (req, res) => {
  try {
    const { mfgData } = req.body;
    
    if (!mfgData) {
      return res.status(400).json({
        success: false,
        error: 'Manufacturing data is required'
      });
    }

    const result = await ipfsService.createManufacturingMetadata(mfgData);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Manufacturing metadata created successfully' : 'Failed to create manufacturing metadata'
    });
  } catch (error) {
    console.error('Create manufacturing metadata error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create manufacturing metadata',
      details: error.message
    });
  }
});

module.exports = router;