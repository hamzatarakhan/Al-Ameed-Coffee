import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth-store';
import type { Transaction, Redemption, Reward } from './mock-data';

export const CHECKIN_POINTS = 10;

interface PointsValue {
  userPoints: number;
  transactions: Transaction[];
  redemptions: Redemption[];
  redeem: (reward: Reward, qty: number) => void;
  checkin: () => void;
  // ponytail: temporary demo-only button (see app/my-points.tsx) — remove
  // this and its button once real earning flows are trusted end to end.
  addTestPoints: () => void;
}

const PointsContext = createContext<PointsValue | null>(null);

function txFromRow(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as string,
    labelAr: row.label_ar as string,
    labelEn: row.label_en as string,
    points: row.points as number,
    date: (row.created_at as string).slice(0, 10),
  };
}

function redemptionFromRow(row: Record<string, unknown>): Redemption {
  return {
    id: row.id as string,
    nameAr: row.name_ar as string,
    nameEn: row.name_en as string,
    emoji: row.emoji as string,
    ref: row.ref as string,
    date: (row.created_at as string).slice(0, 10),
  };
}

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const [userPoints, setUserPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  const refresh = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    // Filtered explicitly, not just trusting RLS through the view — a
    // plain Postgres view runs as its owner (bypassing the underlying
    // table's RLS) unless created with security_invoker, so without this
    // filter the query returned every user's balance row instead of just
    // this one. supabase/schema.sql now creates the view with
    // security_invoker too, but this filter is correct either way.
    const [balanceRes, txRes, redemptionRes] = await Promise.all([
      supabase.from('user_points_balance').select('balance').eq('user_id', userId).maybeSingle(),
      supabase.from('points_transactions').select('*').order('created_at', { ascending: false }),
      supabase.from('redemptions').select('*').order('created_at', { ascending: false }),
    ]);
    if (balanceRes.error) console.error('[points] balance fetch failed:', balanceRes.error);
    if (txRes.error) console.error('[points] transactions fetch failed:', txRes.error);
    if (redemptionRes.error) console.error('[points] redemptions fetch failed:', redemptionRes.error);
    setUserPoints((balanceRes.data?.balance as number) ?? 0);
    setTransactions((txRes.data ?? []).map(txFromRow));
    setRedemptions((redemptionRes.data ?? []).map(redemptionFromRow));
  }, []);

  // Reloads whenever auth status changes, same as profile-store.tsx — covers
  // both "just signed in" and "app relaunched with an existing session".
  useEffect(() => {
    if (status !== 'signedIn') {
      setUserPoints(0);
      setTransactions([]);
      setRedemptions([]);
      return;
    }
    refresh();
  }, [status, refresh]);

  // The redeem_reward RPC only spends one reward's cost per call (see
  // supabase/schema.sql) — qty > 1 just calls it that many times. Each call
  // re-checks the balance server-side, so this can't overspend even if a
  // later call in the loop fails.
  const redeem = useCallback(
    async (reward: Reward, qty: number) => {
      for (let i = 0; i < qty; i++) {
        const { error } = await supabase.rpc('redeem_reward', { p_reward_id: reward.id });
        if (error) {
          console.error('[points] redeem_reward failed:', error);
          break;
        }
      }
      refresh();
    },
    [refresh]
  );

  const checkin = useCallback(async () => {
    const { error } = await supabase.rpc('checkin', { p_label_ar: 'تسجيل حضور', p_label_en: 'Check-in', p_points: CHECKIN_POINTS });
    if (error) console.error('[points] checkin failed:', error);
    refresh();
  }, [refresh]);

  const addTestPoints = useCallback(async () => {
    const { error } = await supabase.rpc('checkin', { p_label_ar: 'نقاط تجريبية', p_label_en: 'Test points', p_points: 100 });
    if (error) console.error('[points] addTestPoints failed:', error);
    refresh();
  }, [refresh]);

  return (
    <PointsContext.Provider value={{ userPoints, transactions, redemptions, redeem, checkin, addTestPoints }}>{children}</PointsContext.Provider>
  );
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePoints must be used within PointsProvider');
  return ctx;
}
