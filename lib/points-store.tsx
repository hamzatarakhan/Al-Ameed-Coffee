import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  transactions as initialTransactions,
  redemptions as initialRedemptions,
  userPoints as initialUserPoints,
  type Transaction,
  type Redemption,
  type Reward,
} from './mock-data';

export const CHECKIN_POINTS = 10;

interface PointsValue {
  userPoints: number;
  transactions: Transaction[];
  redemptions: Redemption[];
  redeem: (reward: Reward, qty: number) => void;
  checkin: () => void;
}

const PointsContext = createContext<PointsValue | null>(null);

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const [userPoints, setUserPoints] = useState(initialUserPoints);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [redemptions, setRedemptions] = useState<Redemption[]>(initialRedemptions);

  const redeem = useCallback((reward: Reward, qty: number) => {
    const cost = reward.cost * qty;
    const date = new Date().toISOString().slice(0, 10);
    setUserPoints((p) => p - cost);
    setTransactions((prev) => [
      { id: `tx-redeem-${Date.now()}`, labelAr: `استبدال: ${reward.nameAr}`, labelEn: `Redeemed: ${reward.nameEn}`, points: -cost, date },
      ...prev,
    ]);
    setRedemptions((prev) => [
      { id: `redeem-${Date.now()}`, nameAr: reward.nameAr, nameEn: reward.nameEn, emoji: reward.emoji, ref: `RD-${Math.floor(10000 + Math.random() * 90000)}`, date },
      ...prev,
    ]);
  }, []);

  const checkin = useCallback(() => {
    const date = new Date().toISOString().slice(0, 10);
    setUserPoints((p) => p + CHECKIN_POINTS);
    setTransactions((prev) => [
      { id: `tx-checkin-${Date.now()}`, labelAr: 'تسجيل حضور', labelEn: 'Check-in', points: CHECKIN_POINTS, date },
      ...prev,
    ]);
  }, []);

  return <PointsContext.Provider value={{ userPoints, transactions, redemptions, redeem, checkin }}>{children}</PointsContext.Provider>;
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePoints must be used within PointsProvider');
  return ctx;
}
