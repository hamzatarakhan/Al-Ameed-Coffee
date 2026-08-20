import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { menuItems } from './mock-data';

export type PaymentMethod = 'cash' | 'card';

interface OrderCartValue {
  quantities: Record<string, number>;
  setQty: (id: string, qty: number) => void;
  totalCount: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  branchId: string | null;
  setBranchId: (id: string | null) => void;
  clear: () => void;
}

const OrderCartContext = createContext<OrderCartValue | null>(null);

export function OrderCartProvider({ children }: { children: React.ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [branchId, setBranchId] = useState<string | null>(null);

  const setQty = useCallback((id: string, qty: number) => {
    setQuantities((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: qty };
    });
  }, []);

  const clear = useCallback(() => {
    setQuantities({});
    setBranchId(null);
    setPaymentMethod('cash');
  }, []);

  const { totalCount, totalPrice } = useMemo(() => {
    let count = 0;
    let price = 0;
    for (const [id, qty] of Object.entries(quantities)) {
      const item = menuItems.find((m) => m.id === id);
      if (!item) continue;
      count += qty;
      price += item.price * qty;
    }
    return { totalCount: count, totalPrice: price };
  }, [quantities]);

  return (
    <OrderCartContext.Provider
      value={{ quantities, setQty, totalCount, totalPrice, paymentMethod, setPaymentMethod, branchId, setBranchId, clear }}>
      {children}
    </OrderCartContext.Provider>
  );
}

export function useOrderCart() {
  const ctx = useContext(OrderCartContext);
  if (!ctx) throw new Error('useOrderCart must be used within OrderCartProvider');
  return ctx;
}
