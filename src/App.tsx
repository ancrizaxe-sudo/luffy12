import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LandingPage from './components/Landing/LandingPage';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import CollectionForm from './components/Collection/CollectionForm';
import QualityTestForm from './components/Quality/QualityTestForm';
import ProcessingForm from './components/Processing/ProcessingForm';
import ManufacturingForm from './components/Manufacturing/ManufacturingForm';
import BatchTracker from './components/Tracking/BatchTracker';
import ConsumerView from './components/Consumer/ConsumerView';
import Dashboard from './components/Dashboard/Dashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('collection');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'collection':
        return <CollectionForm />;
      case 'quality':
        return <QualityTestForm />;
      case 'processing':
        return <ProcessingForm />;
      case 'manufacturing':
        return <ManufacturingForm />;
      case 'tracking':
        return <BatchTracker />;
      case 'consumer':
        return <ConsumerView />;
      case 'dashboard':
        return <Dashboard />;
      case 'qr-scanner':
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-green-600">QR Scanner coming soon...</p>
          </div>
        );
      default:
        return <CollectionForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header onMenuToggle={handleMenuToggle} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-6 overflow-auto">
          {/* Backdrop for mobile sidebar */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;