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
  login: (address: string, password: string) => Promise<void>;
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

  const login = async (address: string, password: string) => {
    // Demo mode - simulate login without backend
    const demoUsers = {
      'collector@demo.com': {
        address: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
        name: 'John Collector',
        organization: 'Himalayan Herbs Co.',
        role: 1,
        email: 'collector@demo.com'
      },
      'tester@demo.com': {
        address: '0xf17f52151ebef6c7334fad080c5704d77216b732',
        name: 'Sarah Tester',
        organization: 'Quality Labs Inc.',
        role: 2,
        email: 'tester@demo.com'
      },
      'processor@demo.com': {
        address: '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
        name: 'Mike Processor',
        organization: 'Herbal Processing Ltd.',
        role: 3,
        email: 'processor@demo.com'
      },
      'manufacturer@demo.com': {
        address: '0x821aea9a577a9b44299b9c15c88cf3087f3b5544',
        name: 'Lisa Manufacturer',
        organization: 'Ayurvedic Products Inc.',
        role: 4,
        email: 'manufacturer@demo.com'
      },
      'admin@demo.com': {
        address: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
        name: 'Admin User',
        organization: 'HerbionYX Platform',
        role: 5,
        email: 'admin@demo.com'
      },
      'consumer@demo.com': {
        address: '0x0000000000000000000000000000000000000000',
        name: 'Consumer User',
        organization: 'General Public',
        role: 6,
        email: 'consumer@demo.com'
      }
    };

    if (password !== 'demo123') {
      throw new Error('Invalid password');
    }

    const user = demoUsers[address as keyof typeof demoUsers];
    if (!user) {
      throw new Error('User not found');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('token', 'demo-token');
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
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