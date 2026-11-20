import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  loginUser, 
  registerUser, 
  requestOTP, 
  verifyOTP, 
  getMe, 
  clearAuthSession, 
  getStoredUser, 
  hasStoredToken 
} from '../services/authApi';
import { message } from 'antd';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('otp'); // 'otp' | 'login' | 'register'
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [activeModalsCount, setActiveModalsCount] = useState(0);

  const registerModalOpen = useCallback(() => {
    setActiveModalsCount((c) => c + 1);
  }, []);

  const registerModalClose = useCallback(() => {
    setActiveModalsCount((c) => Math.max(0, c - 1));
  }, []);

  const isAnyModalOpen = isAuthModalOpen || isSavedTripsOpen || activeModalsCount > 0;

  // Sync modal-open state to document.body for instant styling & navbar fade
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add('waypoint-modal-open');
    } else {
      document.body.classList.remove('waypoint-modal-open');
    }
    return () => {
      document.body.classList.remove('waypoint-modal-open');
    };
  }, [isAnyModalOpen]);

  // Hydrate & verify user session on startup
  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      if (!hasStoredToken()) {
        if (isMounted) setIsLoadingAuth(false);
        return;
      }

      try {
        const profile = await getMe();
        if (isMounted) {
          setUser(profile);
        }
      } catch {
        // Token was invalid or expired (apiClient automatically cleared localStorage)
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    }

    hydrateSession();

    // Listen for custom expired event dispatched by apiClient on 401
    const handleAuthExpired = () => {
      setUser(null);
      message.info('Your session has expired. Please sign in again.');
    };

    window.addEventListener('waypoint_auth_expired', handleAuthExpired);
    return () => {
      isMounted = false;
      window.removeEventListener('waypoint_auth_expired', handleAuthExpired);
    };
  }, []);

  const openAuthModal = useCallback((mode = 'otp') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const openSavedTrips = useCallback(() => {
    setIsSavedTripsOpen(true);
  }, []);

  const closeSavedTrips = useCallback(() => {
    setIsSavedTripsOpen(false);
  }, []);

  const handleLogin = async (identifier, password) => {
    const res = await loginUser({ identifier, password });
    setUser(res.user);
    closeAuthModal();
    message.success(`Welcome back, @${res.user.username}!`);
    return res.user;
  };

  const handleRegister = async (username, email, password) => {
    const res = await registerUser({ username, email, password });
    setUser(res.user);
    closeAuthModal();
    message.success(`Account created! Welcome to Waypoint, @${res.user.username}`);
    return res.user;
  };

  const handleRequestOTP = async (email) => {
    return requestOTP(email);
  };

  const handleVerifyOTP = async (email, code) => {
    const res = await verifyOTP({ email, code });
    setUser(res.user);
    closeAuthModal();
    if (res.isNewUser) {
      message.success(`Account created! Welcome, @${res.user.username}`);
    } else {
      message.success(`Signed in successfully as @${res.user.username}`);
    }
    return res.user;
  };

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    closeSavedTrips();
    message.success('Signed out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoadingAuth,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        isSavedTripsOpen,
        openSavedTrips,
        closeSavedTrips,
        isAnyModalOpen,
        registerModalOpen,
        registerModalClose,
        login: handleLogin,
        register: handleRegister,
        requestOTP: handleRequestOTP,
        verifyOTP: handleVerifyOTP,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
