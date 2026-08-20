import React, { createContext, useCallback, useContext, useState } from 'react';

interface OrderSheetValue {
  open: boolean;
  openSheet: () => void;
  closeSheet: () => void;
}

const OrderSheetContext = createContext<OrderSheetValue | null>(null);

export function OrderSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSheet = useCallback(() => setOpen(true), []);
  const closeSheet = useCallback(() => setOpen(false), []);
  return <OrderSheetContext.Provider value={{ open, openSheet, closeSheet }}>{children}</OrderSheetContext.Provider>;
}

export function useOrderSheet() {
  const ctx = useContext(OrderSheetContext);
  if (!ctx) throw new Error('useOrderSheet must be used within OrderSheetProvider');
  return ctx;
}
