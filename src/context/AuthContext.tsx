import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { email: string; uid: string; name?: string; mobile?: string } | null;
  login: (email: string, name?: string, mobile?: string) => void;
  logout: () => void;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; uid: string; name?: string; mobile?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('ffindia_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Migration for old sessions that only had email
      if (parsed.email && !parsed.uid) {
        parsed.uid = parsed.email;
        localStorage.setItem('ffindia_user', JSON.stringify(parsed));
      }
      setUser(parsed);
    }
  }, []);

  const login = (email: string, name?: string, mobile?: string) => {
    const userData = { email, uid: email, name, mobile };
    setUser(userData);
    localStorage.setItem('ffindia_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ffindia_user');
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuthModal, openAuthModal, closeAuthModal }}>
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
