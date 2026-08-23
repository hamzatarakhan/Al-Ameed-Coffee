import { normalizeJordanPhone } from './phone';

// Free-tier stand-in for real phone verification: Supabase's own Phone
// Auth needs a paid SMS provider (Twilio etc.) wired in. Until that's
// worth paying for, each phone number maps to a fixed, never-shown
// email+password pair, so the OTP screen's already-fake 4-digit check
// still produces a real, persistent Supabase account behind it — see
// lib/auth-store.tsx.
//
// ponytail: not a real secret, not meant to be — the "OTP" step it backs
// doesn't cryptographically verify phone ownership either (same as
// before this existed). Upgrade path: swap this for
// supabase.auth.signInWithOtp({ phone }) once a paid SMS provider is
// configured in the Supabase dashboard; nothing else in the app needs
// to change since every screen calls through useAuth(), not this file.
export function phoneAuthCredentials(rawPhone: string) {
  const phone = normalizeJordanPhone(rawPhone);
  return {
    canonicalPhone: `+962 ${phone}`,
    email: `p${phone}@ameed.internal`,
    password: `ameed-${phone}-v1`,
  };
}
