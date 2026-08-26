import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const safeParseJson = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (err) {
      throw new Error(`Invalid JSON response from server (Status ${response.status})`);
    }
  }
  throw new Error(`API endpoint unavailable or returned non-JSON response (Status ${response.status})`);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authentication state on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await safeParseJson(response);
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Session restore check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async ({ email, password, captchaToken }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, captchaToken }),
    });

    const data = await safeParseJson(response);
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    setUser(data.user);
    return data;
  };

  const register = async ({ fullName, email, password, confirmPassword, captchaToken }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, confirmPassword, captchaToken }),
    });

    const data = await safeParseJson(response);
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('[AuthContext] Logout request error:', err);
    } finally {
      setUser(null);
    }
  };

  const forgotPassword = async ({ email, captchaToken }) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, captchaToken }),
    });

    const data = await safeParseJson(response);
    if (!response.ok) {
      throw new Error(data.message || 'Forgot password request failed');
    }
    return data;
  };

  const resetPassword = async ({ token, password, confirmPassword, captchaToken }) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword, captchaToken }),
    });

    const data = await safeParseJson(response);
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Password reset failed');
    }
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
