import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : { user: null, role: null };
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento inicial do estado
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authState.user) {
      localStorage.setItem("auth", JSON.stringify(authState));
    } else {
      localStorage.removeItem("auth");
    }
  }, [authState]);

  const setUser = (userData) => {
    setAuthState({
      user: userData,
      role: userData?.role === 'admin' ? 'admin' : 'cliente'
    });
  };

  const logout = () => {
    setAuthState({ user: null, role: null });
  };

  const contextValue = useMemo(() => ({
    user: authState.user,
    role: authState.role,
    loading,
    setUser,
    logout,
  }), [authState, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
