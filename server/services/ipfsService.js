const axios = require('axios');
const FormData = require('form-data');
const { API_KEYS } = require('../config/constants');

class IPFSService {
  constructor() {
    this.pinataApiUrl = 'https://api.pinata.cloud';
    this.pinataApiKey = API_KEYS.PINATA_API;
    this.pinataSecretKey = API_KEYS.PINATA_SECRET;
  }

  async uploadJSON(jsonData, name) {
    try {
      const url = `${this.pinataApiUrl}/pinning/pinJSONToIPFS`;
      
      const data = {
        pinataContent: jsonData,
        pinataMetadata: {
          name: name || 'herb-metadata'
        }
      };

      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        }
      });

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  async uploadFile(fileBuffer, fileName, mimeType) {
    try {
      const url = `${this.pinataApiUrl}/pinning/pinFileToIPFS`;
      
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: fileName,
        contentType: mimeType
      });

      formData.append('pinataMetadata', JSON.stringify({
        name: fileName
      }));

      const response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading file to IPFS:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  async getFile(ipfsHash) {
    try {
      const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      const response = await axios.get(url);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error.message);
      return { success: false, error: error.message };
    }
  }

  async createCollectionMetadata(collectionData) {
    const metadata = {
      type: 'collection',
      timestamp: new Date().toISOString(),
      batchId: collectionData.batchId,
      herbSpecies: collectionData.herbSpecies,
      collector: collectionData.collector,
      weight: collectionData.weight,
      harvestDate: collectionData.harvestDate,
      location: {
        latitude: collectionData.location.latitude,
        longitude: collectionData.location.longitude,
        zone: collectionData.location.zone,
        address: collectionData.location.address || ''
      },
      qualityGrade: collectionData.qualityGrade || '',
      notes: collectionData.notes || '',
      images: collectionData.images || []
    };

    return await this.uploadJSON(metadata, `collection-${collectionData.batchId}`);
  }

  async createQualityTestMetadata(testData) {
    const metadata = {
      type: 'quality_test',
      timestamp: new Date().toISOString(),
      batchId: testData.batchId,
      eventId: testData.eventId,
      parentEventId: testData.parentEventId,
      tester: testData.tester,
      testResults: {
        moistureContent: testData.moistureContent,
        purity: testData.purity,
        pesticideLevel: testData.pesticideLevel,
        heavyMetals: testData.heavyMetals || {},
        microbiological: testData.microbiological || {},
        activeCompounds: testData.activeCompounds || {}
      },
      testMethod: testData.testMethod || '',
      testDate: testData.testDate,
      certification: testData.certification || '',
      notes: testData.notes || '',
      images: testData.images || []
    };

    return await this.uploadJSON(metadata, `quality-test-${testData.eventId}`);
  }

  async createProcessingMetadata(processData) {
    const metadata = {
      type: 'processing',
      timestamp: new Date().toISOString(),
      batchId: processData.batchId,
      eventId: processData.eventId,
      parentEventId: processData.parentEventId,
      processor: processData.processor,
      processingDetails: {
        method: processData.method,
        temperature: processData.temperature,
        duration: processData.duration,
        yield: processData.yield,
        equipment: processData.equipment || '',
        parameters: processData.parameters || {}
      },
      processDate: processData.processDate,
      outputProduct: processData.outputProduct || '',
      qualityMetrics: processData.qualityMetrics || {},
      notes: processData.notes || '',
      images: processData.images || []
    };

    return await this.uploadJSON(metadata, `processing-${processData.eventId}`);
  }

  async createManufacturingMetadata(mfgData) {
    const metadata = {
      type: 'manufacturing',
      timestamp: new Date().toISOString(),
      batchId: mfgData.batchId,
      eventId: mfgData.eventId,
      parentEventId: mfgData.parentEventId,
      manufacturer: mfgData.manufacturer,
      product: {
        name: mfgData.productName,
        type: mfgData.productType,
        form: mfgData.productForm, // powder, capsule, extract, etc.
        quantity: mfgData.quantity,
        unit: mfgData.unit,
        batchSize: mfgData.batchSize,
        expiryDate: mfgData.expiryDate
      },
      packaging: {
        material: mfgData.packaging?.material || '',
        size: mfgData.packaging?.size || '',
        labels: mfgData.packaging?.labels || []
      },
      qualityControl: {
        tests: mfgData.qualityTests || [],
        certifications: mfgData.certifications || [],
        standards: mfgData.standards || []
      },
      manufacturingDate: mfgData.manufacturingDate,
      notes: mfgData.notes || '',
      images: mfgData.images || []
    };

    return await this.uploadJSON(metadata, `manufacturing-${mfgData.eventId}`);
  }
}

module.exports = new IPFSService();