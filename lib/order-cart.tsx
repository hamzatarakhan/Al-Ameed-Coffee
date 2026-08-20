import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { branches, menuItems } from './mock-data';

export type PaymentMethod = 'cash' | 'card';
export type Fulfillment = 'pickup' | 'delivery';
export type AddressType = 'home' | 'work' | 'other';
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed';
export const ORDER_STATUS_STEPS: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];

export type Address = {
  id: string;
  type: AddressType;
  line: string;
  city: string;
  area: string;
  building: string;
  floor?: string;
};

// A resolved snapshot (names/labels already looked up, not just ids) so
// order history still displays correctly even if a branch or menu item's
// data changes later — and carries enough of the original selection
// (quantities/fulfillment/branch or address) to power "order again".
export type PlacedOrder = {
  id: string;
  itemsAr: string;
  itemsEn: string;
  itemCount: number;
  fulfillment: Fulfillment;
  locationAr: string;
  locationEn: string;
  total: number;
  date: string;
  quantities: Record<string, number>;
  paymentMethod: PaymentMethod;
  branchId: string | null;
  addressId: string | null;
  status: OrderStatus;
};

interface OrderCartValue {
  quantities: Record<string, number>;
  setQty: (id: string, qty: number) => void;
  totalCount: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  fulfillment: Fulfillment;
  setFulfillment: (f: Fulfillment) => void;
  branchId: string | null;
  setBranchId: (id: string | null) => void;
  addresses: Address[];
  addAddress: (a: Omit<Address, 'id'>) => void;
  addressId: string | null;
  setAddressId: (id: string | null) => void;
  pastOrders: PlacedOrder[];
  placeOrder: () => string;
  advanceOrderStatus: (orderId: string) => void;
  reorder: (order: PlacedOrder) => void;
  clear: () => void;
}

const OrderCartContext = createContext<OrderCartValue | null>(null);

export function OrderCartProvider({ children }: { children: React.ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [fulfillment, setFulfillment] = useState<Fulfillment>('pickup');
  const [branchId, setBranchId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [pastOrders, setPastOrders] = useState<PlacedOrder[]>([]);

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

  const addAddress = useCallback((a: Omit<Address, 'id'>) => {
    const id = `addr-${Date.now()}`;
    setAddresses((prev) => [...prev, { ...a, id }]);
    setAddressId(id);
  }, []);

  const resetSelection = useCallback(() => {
    setQuantities({});
    setBranchId(null);
    setAddressId(null);
    setPaymentMethod('cash');
    setFulfillment('pickup');
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

  const placeOrder = useCallback(() => {
    const id = `order-${Date.now()}`;
    setPastOrders((prev) => {
      const entries = Object.entries(quantities);
      const itemsAr = entries.map(([oid, qty]) => `${menuItems.find((m) => m.id === oid)?.nameAr ?? ''}${qty > 1 ? ` × ${qty}` : ''}`).join('، ');
      const itemsEn = entries.map(([oid, qty]) => `${menuItems.find((m) => m.id === oid)?.nameEn ?? ''}${qty > 1 ? ` × ${qty}` : ''}`).join(', ');
      const branch = branches.find((b) => b.id === branchId);
      const address = addresses.find((a) => a.id === addressId);
      const order: PlacedOrder = {
        id,
        itemsAr,
        itemsEn,
        itemCount: entries.reduce((sum, [, qty]) => sum + qty, 0),
        fulfillment,
        locationAr: fulfillment === 'pickup' ? (branch?.nameAr ?? '') : (address ? `${address.line}, ${address.building}` : ''),
        locationEn: fulfillment === 'pickup' ? (branch?.nameEn ?? '') : (address ? `${address.line}, ${address.building}` : ''),
        total: totalPrice,
        date: new Date().toISOString().slice(0, 10),
        quantities,
        paymentMethod,
        branchId,
        addressId,
        status: 'received',
      };
      return [order, ...prev];
    });
    resetSelection();
    return id;
  }, [quantities, totalPrice, fulfillment, branchId, addressId, addresses, paymentMethod, resetSelection]);

  const advanceOrderStatus = useCallback((orderId: string) => {
    setPastOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = ORDER_STATUS_STEPS[Math.min(ORDER_STATUS_STEPS.indexOf(o.status) + 1, ORDER_STATUS_STEPS.length - 1)];
        return { ...o, status: next };
      })
    );
  }, []);

  const reorder = useCallback((order: PlacedOrder) => {
    setQuantities(order.quantities);
    setFulfillment(order.fulfillment);
    setPaymentMethod(order.paymentMethod);
    setBranchId(order.branchId);
    setAddressId(order.addressId);
  }, []);

  return (
    <OrderCartContext.Provider
      value={{
        quantities,
        setQty,
        totalCount,
        totalPrice,
        paymentMethod,
        setPaymentMethod,
        fulfillment,
        setFulfillment,
        branchId,
        setBranchId,
        addresses,
        addAddress,
        addressId,
        setAddressId,
        pastOrders,
        placeOrder,
        advanceOrderStatus,
        reorder,
        clear: resetSelection,
      }}>
      {children}
    </OrderCartContext.Provider>
  );
}

export function useOrderCart() {
  const ctx = useContext(OrderCartContext);
  if (!ctx) throw new Error('useOrderCart must be used within OrderCartProvider');
  return ctx;
}
