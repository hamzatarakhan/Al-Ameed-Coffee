import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { phoneAuthCredentials } from './phone-auth';

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

    const { email, password, canonicalPhone } = phoneAuthCredentials(pendingPhone);
    let session = (await supabase.auth.signInWithPassword({ email, password })).data.session;

    if (!session) {
      // No account for this phone yet — the "OTP" just verified it well
      // enough to create one.
      const signUp = await supabase.auth.signUp({ email, password });
      if (signUp.error || !signUp.data.session) {
        console.error('[auth] signUp failed:', signUp.error);
        return false;
      }
      session = signUp.data.session;
      const { error: profileError } = await supabase.from('profiles').update({ phone: canonicalPhone }).eq('id', session.user.id);
      if (profileError) console.error('[auth] profile phone update failed:', profileError);
    }

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
