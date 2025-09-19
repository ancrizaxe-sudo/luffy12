import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  address: string;
  name: string;
  organization: string;
  role: number;
  phone?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsConsumer: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Demo mode - simulate login without backend
    const demoUsers = {
      'collector@demo.com': {
        address: 'collector_address',
        name: 'John Collector',
        organization: 'Himalayan Herbs Co.',
        role: 1,
        email: 'collector@demo.com'
      },
      'tester@demo.com': {
        address: 'tester_address',
        name: 'Sarah Tester',
        organization: 'Quality Labs Inc.',
        role: 2,
        email: 'tester@demo.com'
      },
      'processor@demo.com': {
        address: 'processor_address',
        name: 'Mike Processor',
        organization: 'Herbal Processing Ltd.',
        role: 3,
        email: 'processor@demo.com'
      },
      'manufacturer@demo.com': {
        address: 'manufacturer_address',
        name: 'Lisa Manufacturer',
        organization: 'Ayurvedic Products Inc.',
        role: 4,
        email: 'manufacturer@demo.com'
      }
    };

    if (password !== 'demo123') {
      throw new Error('Invalid password');
    }

    const user = demoUsers[email as keyof typeof demoUsers];
    if (!user) {
      throw new Error('User not found');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('token', 'demo-token');
    setUser(user);
  };

  const loginAsConsumer = () => {
    const consumerUser = {
      address: 'consumer_address',
      name: 'Consumer User',
      organization: 'General Public',
      role: 6,
      email: 'consumer@demo.com'
    };
    
    localStorage.setItem('token', 'consumer-token');
    setUser(consumerUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    loginAsConsumer,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};