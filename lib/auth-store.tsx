import React, { createContext, useContext, useState } from 'react';

// ponytail: no real backend/SMS provider yet, so this is a working demo auth
// flow (any 4-digit code matching DEMO_OTP passes) instead of a real one.
// Swap startAuth/verifyOtp's bodies for real API calls once the backend
// exists — every screen already calls through this hook, not fetch directly.
export const DEMO_OTP = '1234';

// signedOut -> needsProfile (new accounts only, after OTP) -> signedIn.
// Returning accounts and Apple sign-in skip straight to signedIn.
export type AuthStatus = 'signedOut' | 'needsProfile' | 'signedIn';

interface AuthValue {
  status: AuthStatus;
  pendingPhone: string | null;
  pendingName: string | null;
  startAuth: (phone: string, isNewAccount?: boolean, name?: string) => void;
  verifyOtp: (code: string) => boolean;
  completeProfile: () => void;
  signInWithApple: () => void;
  signOut: () => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('signedOut');
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [isNewAccount, setIsNewAccount] = useState(false);

  const startAuth = (phone: string, newAccount = false, name?: string) => {
    setPendingPhone(phone);
    setPendingName(name ?? null);
    setIsNewAccount(newAccount);
  };

  const verifyOtp = (code: string) => {
    const ok = code === DEMO_OTP;
    if (ok) setStatus(isNewAccount ? 'needsProfile' : 'signedIn');
    return ok;
  };

  const completeProfile = () => setStatus('signedIn');

  // Apple's own sign-in sheet is the verification step — no separate OTP
  // needed once it resolves successfully.
  const signInWithApple = () => setStatus('signedIn');

  const signOut = () => {
    setStatus('signedOut');
    setPendingPhone(null);
  };

  const deleteAccount = () => {
    setStatus('signedOut');
    setPendingPhone(null);
  };

  return (
    <AuthContext.Provider value={{ status, pendingPhone, pendingName, startAuth, verifyOtp, completeProfile, signInWithApple, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
