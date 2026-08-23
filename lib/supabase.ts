import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY — copy .env.example to .env.local and fill in your project values.');
}

// expo-router's static web export pre-renders every route in Node (no
// `window`/localStorage there at all) — AsyncStorage's web implementation
// reaches for `window` unconditionally in the client's constructor and
// crashes that build step. A no-op storage stub in that one context is
// safe: nothing during static rendering ever needs a persisted session,
// and real AsyncStorage still runs everywhere the app actually executes
// (native app + real browser).
const noopStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};
const isStaticExport = typeof window === 'undefined' && Platform.OS === 'web';

// The anon key is safe to ship in the client bundle by design — Supabase
// enforces access with Postgres row-level security (see supabase/schema.sql),
// not by keeping this key secret.
export const supabase = createClient(url, anonKey, {
  auth: {
    storage: isStaticExport ? noopStorage : AsyncStorage,
    autoRefreshToken: !isStaticExport,
    persistSession: !isStaticExport,
    // No browser URL to parse a session out of on native.
    detectSessionInUrl: false,
  },
});
