import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const API_BASE = 'https://zen-stride-unmoved.ngrok-free.dev/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserInfo {
  id: number;
  username: string;
  major: string | null;
}

interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  isLoading: boolean;
  isGuest: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, major?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserInfo>) => void;
  enterGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isLoading: true,
  isGuest: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateUser: () => {},
  enterGuestMode: () => {},
});

export const useAuth = () => useContext(AuthContext);

// ─── Secure Token Storage (with web fallback) ───────────────────────────────

async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem('auth_token', token);
  } else {
    await SecureStore.setItemAsync('auth_token', token);
  }
}

async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem('auth_token');
  }
  return await SecureStore.getItemAsync('auth_token');
}

async function deleteToken() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('auth_token');
  } else {
    await SecureStore.deleteItemAsync('auth_token');
  }
}

async function saveUser(user: UserInfo) {
  const json = JSON.stringify(user);
  if (Platform.OS === 'web') {
    localStorage.setItem('auth_user', json);
  } else {
    await SecureStore.setItemAsync('auth_user', json);
  }
}

async function getUser(): Promise<UserInfo | null> {
  let json: string | null;
  if (Platform.OS === 'web') {
    json = localStorage.getItem('auth_user');
  } else {
    json = await SecureStore.getItemAsync('auth_user');
  }
  return json ? JSON.parse(json) : null;
}

async function deleteUser() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('auth_user');
  } else {
    await SecureStore.deleteItemAsync('auth_user');
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      const savedToken = await getToken();
      const savedUser = await getUser();
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      await saveToken(data.token);
      await saveUser(data.user);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const register = async (username: string, password: string, major?: string) => {
    try {
      const body: any = { username, password };
      if (major) body.major = major;
      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg = data.username?.[0] || data.password?.[0] || data.error || 'Registration failed';
        return { success: false, error: errMsg };
      }
      await saveToken(data.token);
      await saveUser(data.user);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const logout = async () => {
    await deleteToken();
    await deleteUser();
    setToken(null);
    setUser(null);
    setIsGuest(false);
  };

  const enterGuestMode = () => {
    setIsGuest(true);
  };

  const updateUser = (updates: Partial<UserInfo>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    if (user) {
      saveUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, isGuest, login, register, logout, updateUser, enterGuestMode }}>
      {children}
    </AuthContext.Provider>
  );
}
