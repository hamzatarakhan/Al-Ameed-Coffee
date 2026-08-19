import React, { createContext, useContext, useState } from 'react';

// ponytail: no real backend/SMS provider yet, so this is a working demo auth
// flow (any 4-digit code passes) instead of a real one. Swap
// startAuth/verifyOtp's bodies for real API calls once the backend exists —
// every screen already calls through this hook, not fetch directly.

// signedOut -> needsProfile (first successful OTP only) -> signedIn.
// There's no backend to say whether a phone number is already
// registered, so "new vs. returning" isn't a real signal here — the
// login/signup screens are functionally identical either way. What
// actually gates the profile-completion step is whether it's ever been
// finished before (profileCompleted), not which screen you tapped
// through. Apple sign-in skips straight to signedIn since its own
// sheet is the verification step.
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
  const [profileCompleted, setProfileCompleted] = useState(false);

  const startAuth = (phone: string, _isNewAccount = false, name?: string) => {
    setPendingPhone(phone);
    setPendingName(name ?? null);
  };

  const verifyOtp = (code: string) => {
    const ok = /^\d{4}$/.test(code);
    if (ok) setStatus(profileCompleted ? 'signedIn' : 'needsProfile');
    return ok;
  };

  const completeProfile = () => {
    setProfileCompleted(true);
    setStatus('signedIn');
  };

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
    setProfileCompleted(false);
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
