import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAdminMeApi,
  getAdminToken,
  loginAdminApi,
  logoutAdminApi,
} from '../api/adminApi';

interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AdminUser) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(getAdminToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAdminToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const adminData = await getAdminMeApi();
        setUser(adminData);
        setToken(storedToken);
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const data = await loginAdminApi(username, password);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await logoutAdminApi();
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUser: (u: AdminUser) => setUser(u),
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

