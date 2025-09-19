# 🌿 HerbionYX - Hyperledger Fabric-Based Ayurvedic Herb Traceability System

A comprehensive Hyperledger Fabric-based traceability system for Ayurvedic herbs with enterprise-grade blockchain technology and real QR code generation.

## 🚀 Features

### Core Functionality
- **Enterprise Blockchain**: Hyperledger Fabric with permissioned network
- **Demo Mode**: No backend required, works entirely in browser
- **Role-Based Access**: Collector, Tester, Processor, Manufacturer, Admin roles
- **QR-Based Workflow**: Each process starts with QR code scanning
- **Real QR Generation**: Actual QR codes with tracking links
- **Simulated IPFS**: Demo IPFS functionality for development
- **Glass Morphism UI**: Modern, beautiful interface design
- **140 Herb Species**: Complete Ayurvedic herb database

### Chaincode (Smart Contracts)
- **HerbionYXContract**: Complete supply chain event recording in Node.js
- **Role-Based Permissions**: Built-in access control
- **Event Tracking**: Collection, Quality Test, Processing, Manufacturing events

### Technology Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Blockchain**: Hyperledger Fabric 2.5
- **Chaincode**: Node.js
- **Database**: CouchDB (for rich queries)
- **Deployment**: Docker Compose
- **QR Codes**: Real QR code generation with tracking

## 🏗️ Architecture

```
Frontend (React + Vite)     →    Browser-based Demo
Chaincode (Node.js)         →    Hyperledger Fabric Network
Backend API                 →    Fabric Node.js SDK
Deployment                  →    Docker Compose
```

## 📋 Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Hyperledger Fabric binaries
- 8GB+ RAM recommended

## 🛠️ Quick Setup Guide

### 1. Install Prerequisites
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Hyperledger Fabric binaries
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.5.4 1.5.7

# Install project dependencies
npm install
cd server && npm install
```

### 2. Start Fabric Network
```bash
cd fabric-network/scripts
chmod +x *.sh
./network.sh up
./network.sh createChannel
./network.sh deployCC
```

### 3. Start Backend and Frontend
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
npm run dev
```

## 🎯 User Workflow

### 1. Landing Page
- Beautiful glass morphism design
- Credits to SENTINELS
- Enter button to access platform

### 2. Login System
Demo credentials available:
- **Collector**: collector@demo.com / demo123
- **Tester**: tester@demo.com / demo123
- **Processor**: processor@demo.com / demo123
- **Manufacturer**: manufacturer@demo.com / demo123
- **Admin**: admin@demo.com / demo123
- **Consumer**: consumer@demo.com / demo123

### 3. QR-Based Process Flow
The system supports multiple users with different roles:

#### Collection (Farmer/Collector)
1. Login as collector
2. Fill herb details (species, weight, location)
3. Upload herb image (optional)
4. Submit → Creates batch on Fabric network
5. **Real QR code generated** with tracking URL
#### Quality Testing
1. Login as tester
2. **Scan/paste QR code** from collection
3. Auto-fills batch and parent event IDs
4. Enter test results (moisture, purity, pesticide levels)
5. Submit → Records on Fabric network
6. **New QR code generated**
#### Processing
1. Login as processor
2. **Scan/paste QR code** from quality test
3. Select processing method and parameters
4. Submit → Records on Fabric network
5. **New QR code generated**
#### Manufacturing
1. Login as manufacturer
2. **Scan/paste QR code** from processing
3. Enter final product details
4. Submit → Records on Fabric network
5. **Final consumer QR code generated**
#### Consumer Verification
1. Login as consumer (or public access)
2. **Scan final product QR code**
3. View complete supply chain journey
4. Verify authenticity and quality

## 🔧 Technical Implementation

### Demo Mode Features
- **Browser-Only**: No backend server required
- **Mock Authentication**: Demo users with different roles
- **Simulated Fabric**: Real chaincode structure, demo transactions
- **Real QR Codes**: Actual QR code generation and scanning
- **Responsive UI**: Works on all device sizes

### UI/UX Features
- **Multiple User Roles**: Switch between different user types
- **Glass Morphism**: Modern, translucent design elements
- **Responsive**: Works on all device sizes
- **Real-time**: Live Fabric network interaction
- **Error Handling**: Comprehensive error messages

## 🌿 Supported Herbs (140 Species)

The system includes a comprehensive database of Ayurvedic herbs:

**Popular Herbs Include:**
- Ashwagandha (Withania somnifera)
- Brahmi (Bacopa monnieri)
- Tulsi (Ocimum tenuiflorum)
- Neem (Azadirachta indica)
- Amla (Emblica officinalis)

Complete list of Ayurvedic herbs including:
Talispatra, Chirmati, Katha, Vatsnabh, Atees, Vach, Adusa, Bael, Shirish, Ghritkumari, Smaller Galangal, Greater Galangal, Saptaparna, Silarasa, Akarkara, Kalmegh, Agar, Artemisia, Shatavari, Atropa, Neem, Brahmi, Daruhaldi, Pashanbheda, Punarnava, Patang, Senna, Sadabahar, Malkangani, Mandukparni, Safed Musli, Tejpatta, Dalchini, Kapoor, Arni, Aparajita, Patharchur, Hrivera, Guggul, Shankhpushpi, Mamira, Peela Chandan, Varun, Krishnasariva, Kali Musli, Tikhur, Nannari, Salampanja, Sarivan, Foxglove, Ratalu, Bhringraj, Vai, Vidang, Amla, Somlata, Hing, Kokum, Trayamana, Ginkgo, Kalihari, Mulethi, Gambhari, Gudmar, Kapurkachari, Anantmool, Seabuckthorn, Kutaj, Khurasani Ajwain, Pushkarmool, Giant Potato, Vriddhadaruka, Trivrit, Hapusha, Dhoop, Indian Crocus, Chandrasur, Jivanti, Litsea, Ghanera, Nagakeshar, Sahjan, Konch, Jatamansi, Tulsi, Ratanjot, Syonaka, Ginseng, Bhumi Amlaki, Kutki, Kababchini, Pippali, Isabgol, Rasna, Leadwort, Chitrak, Bankakri, Mahameda, Agnimanth, Moovila, Bakuchi, Beejasar, Raktachandan, Vidarikand, Sarpagandha, Archa, Manjishtha, Saptarangi, Chandan, Ashok, Kuth, Bala, Hriddhatri, Katheli, Makoy, Patala, Madhukari, Chirata, Lodh, Rohitak, Thuner, Sharapunkha, Arjuna, Bahera, Harad, Giloy, Barhanta, Patol, Jeevani, Damabooti, Prishnaparni, Tagar, Indian Valerian, Mandadhupa, Khas, Banafsha, Nirgundi, Ashwagandha, Dhataki, Timoo

## 🚀 Production Deployment

### Fabric Network Deployment
1. **Follow FABRIC_SETUP_GUIDE.md** for detailed instructions
2. **Deploy Fabric network** using Docker Compose
3. **Deploy chaincode** using Fabric CLI
4. **Configure connection profiles** in backend

### Frontend Deployment
1. **Build**: `npm run build`
2. **Deploy**: Upload `dist` folder to any static hosting
3. **Configure**: Update Fabric endpoints after deployment

## 🔐 Security Features

- **Role-based Access Control**: Chaincode enforced permissions  
- **Demo Authentication**: Secure demo user system
- **Fabric Immutability**: Permanent record keeping with consensus
- **QR Code Verification**: Cryptographic hash verification
- **Input Validation**: Comprehensive form validation
- **Permissioned Network**: Only authorized participants can join

## 🤝 Contributing

This is a demo system ready for production enhancement. To contribute:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For technical support:
- Review the `FABRIC_SETUP_GUIDE.md`
- Check chaincode deployment on Fabric network
- Test with demo credentials provided
- Verify QR code generation and scanning

## 📄 License

MIT License - Open source and free to use for educational and commercial purposes.

## 👥 Credits

**Built by SENTINELS Team**
- Revolutionary Hyperledger Fabric-based traceability
- Production-ready architecture
- Modern UI/UX design
- Comprehensive documentation

**🌱 Revolutionizing Ayurvedic Supply Chain with Hyperledger Fabric**

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install
cd server && npm install

# Start Fabric network
cd ../fabric-network/scripts
./network.sh up
./network.sh createChannel  
./network.sh deployCC

# Start backend (new terminal)
cd ../../server
npm run dev
```

# Start frontend (new terminal)  
cd ..
npm run dev

# Access at http://localhost:5173
**Demo Login**: Use the provided demo credentials to test different user roles!