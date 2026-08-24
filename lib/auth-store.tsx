import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { normalizeJordanPhone } from './phone';

// signedOut -> needsProfile (first successful "OTP" only) -> signedIn.
// profiles.profile_completed (not "is name_ar set") is what gates the
// needsProfile step, so a user who taps "Skip for now" doesn't get
// bounced back to complete-profile on every future launch.
export type AuthStatus = 'signedOut' | 'needsProfile' | 'signedIn';

interface AuthValue {
  status: AuthStatus;
  pendingPhone: string | null;
  pendingName: string | null;
  startAuth: (phone: string, isNewAccount?: boolean, name?: string) => void;
  verifyOtp: (code: string) => Promise<boolean>;
  completeProfile: () => Promise<void>;
  signInWithApple: () => void;
  signOut: () => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

async function statusForSession(session: Session): Promise<AuthStatus> {
  const { data, error } = await supabase.from('profiles').select('profile_completed').eq('id', session.user.id).maybeSingle();
  if (error) console.error('[auth] profile lookup failed:', error);
  return data?.profile_completed ? 'signedIn' : 'needsProfile';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('signedOut');
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);

  // Restores a real returning session (Supabase persists it in
  // AsyncStorage) instead of always starting at the login screen —
  // the whole point of moving off local-only mock state.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) statusForSession(session).then(setStatus);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setStatus('signedOut');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const startAuth = (phone: string, _isNewAccount = false, name?: string) => {
    setPendingPhone(phone);
    setPendingName(name ?? null);
  };

  const verifyOtp = async (code: string) => {
    if (!/^\d{4}$/.test(code) || !pendingPhone) return false;

    // The synthetic-email-account approach (phone -> fixed email+password)
    // depended on Supabase's shared/free email service for signUp, which
    // turned out to hit that service's own low rate limit even with
    // "Confirm email" disabled — a live device test caught this before it
    // shipped further. Anonymous Auth sends no email/SMS at all, so there's
    // no quota to hit. Trade-off: identity is per-device, not per-phone —
    // signing out (or a fresh install) starts a new anonymous account with
    // no link back to the old one's data. Acceptable for now; revisit once
    // a paid SMS provider makes real phone auth worth wiring in.
    const { data: { session: existing } } = await supabase.auth.getSession();
    let session = existing;

    if (!session) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error || !data.session) {
        console.error('[auth] signInAnonymously failed:', error);
        return false;
      }
      session = data.session;
    }

    const canonicalPhone = `+962 ${normalizeJordanPhone(pendingPhone)}`;
    const { error: profileError } = await supabase.from('profiles').update({ phone: canonicalPhone }).eq('id', session.user.id);
    if (profileError) console.error('[auth] profile phone update failed:', profileError);

    setStatus(await statusForSession(session));
    return true;
  };

  const completeProfile = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) await supabase.from('profiles').update({ profile_completed: true }).eq('id', data.user.id);
    setStatus('signedIn');
  };

  // Real Sign in with Apple needs the Apple provider configured in the
  // Supabase dashboard (Services ID, Team ID, key) — a one-time setup
  // step separate from anything in this file. Until then this mirrors
  // the old mock behavior: Apple's own sheet resolving successfully is
  // treated as "signed in," with no backend session behind it yet.
  const signInWithApple = () => setStatus('signedIn');

  const signOut = () => {
    supabase.auth.signOut();
    setPendingPhone(null);
  };

  const deleteAccount = async () => {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (userId) {
      // Row-level security only lets the anon-key client delete rows it
      // owns, which covers everything except the auth.users row itself —
      // that needs the service-role key (never shipped in the app), so a
      // server-side function is the follow-up for full account deletion.
      await Promise.all([
        supabase.from('orders').delete().eq('user_id', userId),
        supabase.from('addresses').delete().eq('user_id', userId),
        supabase.from('redemptions').delete().eq('user_id', userId),
        supabase.from('notifications').delete().eq('user_id', userId),
      ]);
    }
    await supabase.auth.signOut();
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
