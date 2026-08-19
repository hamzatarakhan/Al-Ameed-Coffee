import React, { createContext, useContext, useState } from 'react';

// ponytail: no real backend/SMS provider yet, so this is a working demo auth
// flow (any 4-digit code matching DEMO_OTP passes) instead of a real one.
// Swap startAuth/verifyOtp's bodies for real API calls once the backend
// exists — every screen already calls through this hook, not fetch directly.
export const DEMO_OTP = '1234';

interface AuthValue {
  isAuthenticated: boolean;
  pendingPhone: string | null;
  isNewAccount: boolean;
  startAuth: (phone: string, isNewAccount?: boolean) => void;
  verifyOtp: (code: string) => boolean;
  signInWithApple: () => void;
  signOut: () => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [isNewAccount, setIsNewAccount] = useState(false);

  const startAuth = (phone: string, newAccount = false) => {
    setPendingPhone(phone);
    setIsNewAccount(newAccount);
  };

  const verifyOtp = (code: string) => {
    const ok = code === DEMO_OTP;
    if (ok) setIsAuthenticated(true);
    return ok;
  };

  // Apple's own sign-in sheet is the verification step — no separate OTP
  // needed once it resolves successfully.
  const signInWithApple = () => setIsAuthenticated(true);

  const signOut = () => {
    setIsAuthenticated(false);
    setPendingPhone(null);
  };

  const deleteAccount = () => {
    setIsAuthenticated(false);
    setPendingPhone(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, pendingPhone, isNewAccount, startAuth, verifyOtp, signInWithApple, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
