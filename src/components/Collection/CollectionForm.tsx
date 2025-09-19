import React, { useState, useEffect } from 'react';
import { Sprout, MapPin, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AYURVEDIC_HERBS, APPROVED_ZONES } from '../../config/herbs';
import blockchainService from '../../services/blockchainService';
import ipfsService from '../../services/ipfsService';
import qrService from '../../services/qrService';
import QRCodeDisplay from '../Common/QRCodeDisplay';

const CollectionForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [qrResult, setQrResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    herbSpecies: '',
    weight: '',
    harvestDate: new Date().toISOString().split('T')[0],
    zone: '',
    qualityGrade: '',
    notes: '',
    collectorName: user?.name || '',
    image: null as File | null
  });

  useEffect(() => {
    getCurrentLocation();
    initializeBlockchain();
  }, []);

  const initializeBlockchain = async () => {
    try {
      await blockchainService.initialize();
    } catch (error) {
      console.error('Error initializing blockchain:', error);
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
            accuracy: position.coords.accuracy
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          setError('Unable to get location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setLocationLoading(false);
      setError('Geolocation is not supported by this browser');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!location) {
      setError('Location is required for collection');
      setLoading(false);
      return;
    }

    try {
      // Generate batch and event IDs
      const batchId = blockchainService.generateBatchId();
      const collectionEventId = blockchainService.generateEventId('COLLECTION');

      let imageHash = null;
      if (formData.image) {
        const imageUpload = await ipfsService.uploadFile(formData.image);
        if (imageUpload.success) {
          imageHash = imageUpload.ipfsHash;
        }
      }

      // Create collection metadata
      const collectionData = {
        batchId,
        herbSpecies: formData.herbSpecies,
        collector: formData.collectorName,
        weight: parseFloat(formData.weight),
        harvestDate: formData.harvestDate,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          zone: formData.zone
        },
        qualityGrade: formData.qualityGrade,
        notes: formData.notes,
        images: imageHash ? [imageHash] : []
      };

      // Upload metadata to IPFS
      const metadataUpload = await ipfsService.createCollectionMetadata(collectionData);
      if (!metadataUpload.success) {
        throw new Error('Failed to upload metadata to IPFS');
      }

      // Generate QR code
      const qrResult = await qrService.generateCollectionQR(
        batchId,
        collectionEventId,
        formData.herbSpecies,
        formData.collectorName
      );

      if (!qrResult.success) {
        throw new Error('Failed to generate QR code');
      }

      // Create batch on blockchain
      const blockchainData = {
        batchId,
        herbSpecies: formData.herbSpecies,
        collectionEventId,
        ipfsHash: metadataUpload.ipfsHash,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          zone: formData.zone
        },
        qrCodeHash: qrResult.qrHash
      };

      const blockchainResult = await blockchainService.createBatch(
        user?.address || '',
        blockchainData
      );

      if (!blockchainResult.success) {
        throw new Error('Failed to create batch on blockchain');
      }

      setSuccess(true);
      setQrResult({
        batchId,
        eventId: collectionEventId,
        herbSpecies: formData.herbSpecies,
        weight: parseFloat(formData.weight),
        location: { zone: formData.zone },
        qr: qrResult,
        fabric: blockchainResult   // ✅ fixed here
      });

      // Reset form
      setFormData({
        herbSpecies: '',
        weight: '',
        harvestDate: new Date().toISOString().split('T')[0],
        zone: '',
        qualityGrade: '',
        notes: '',
        collectorName: user?.name || '',
        image: null
      });
    } catch (error) {
      console.error('Collection creation error:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setQrResult(null);
    setError('');
  };

  if (success && qrResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Collection Successful!</h2>
            <p className="text-green-600">Your herb collection has been recorded on the blockchain</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-700">Batch ID:</span>
                <p className="text-green-900 font-mono">{qrResult.batchId}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Herb Species:</span>
                <p className="text-green-900">{qrResult.herbSpecies}</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Weight:</span>
                <p className="text-green-900">{qrResult.weight}g</p>
              </div>
              <div>
                <span className="font-medium text-green-700">Location:</span>
                <p className="text-green-900">{qrResult.location?.zone}</p>
              </div>
            </div>
          </div>

          <QRCodeDisplay
            qrData={{
              dataURL: qrResult.qr.dataURL,
              trackingUrl: qrResult.qr.trackingUrl,
              eventId: qrResult.eventId
            }}
            title="Collection QR Code"
            subtitle="Scan to track this batch"
          />

          <button
            onClick={handleReset}
            className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium"
          >
            Create New Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Form UI unchanged */}
    </div>
  );
};

export default CollectionForm;
