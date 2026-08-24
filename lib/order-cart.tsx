import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth-store';
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
  placeOrder: () => Promise<string>;
  advanceOrderStatus: (orderId: string) => void;
  reorder: (order: PlacedOrder) => void;
  clear: () => void;
}

const OrderCartContext = createContext<OrderCartValue | null>(null);

function addressFromRow(row: Record<string, unknown>): Address {
  return {
    id: row.id as string,
    type: row.type as AddressType,
    line: row.line as string,
    city: row.city as string,
    area: row.area as string,
    building: row.building as string,
    floor: (row.floor as string) ?? undefined,
  };
}

function orderFromRow(row: Record<string, unknown>): PlacedOrder {
  return {
    id: row.id as string,
    itemsAr: row.items_ar as string,
    itemsEn: row.items_en as string,
    itemCount: row.item_count as number,
    fulfillment: row.fulfillment as Fulfillment,
    locationAr: row.location_ar as string,
    locationEn: row.location_en as string,
    total: Number(row.total),
    date: (row.created_at as string).slice(0, 10),
    quantities: row.quantities as Record<string, number>,
    paymentMethod: row.payment_method as PaymentMethod,
    branchId: (row.branch_id as string) ?? null,
    addressId: (row.address_id as string) ?? null,
    status: row.status as OrderStatus,
  };
}

export function OrderCartProvider({ children }: { children: React.ReactNode }) {
  const { status: authStatus } = useAuth();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [fulfillment, setFulfillment] = useState<Fulfillment>('pickup');
  const [branchId, setBranchId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [pastOrders, setPastOrders] = useState<PlacedOrder[]>([]);

  // Saved addresses and order history both belong to the signed-in user —
  // reloads whenever auth status changes, same pattern as profile-store.tsx
  // and points-store.tsx.
  useEffect(() => {
    if (authStatus !== 'signedIn') {
      setAddresses([]);
      setPastOrders([]);
      return;
    }
    (async () => {
      const [addrRes, orderRes] = await Promise.all([
        supabase.from('addresses').select('*').order('created_at', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ]);
      if (addrRes.error) console.error('[orders] addresses fetch failed:', addrRes.error);
      if (orderRes.error) console.error('[orders] orders fetch failed:', orderRes.error);
      setAddresses((addrRes.data ?? []).map(addressFromRow));
      setPastOrders((orderRes.data ?? []).map(orderFromRow));
    })();
  }, [authStatus]);

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

  const addAddress = useCallback(async (a: Omit<Address, 'id'>) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data, error } = await supabase
      .from('addresses')
      .insert({ user_id: userData.user.id, type: a.type, line: a.line, city: a.city, area: a.area, building: a.building, floor: a.floor ?? null })
      .select()
      .single();
    if (error || !data) {
      console.error('[orders] addAddress failed:', error);
      return;
    }
    const address = addressFromRow(data);
    setAddresses((prev) => [...prev, address]);
    setAddressId(address.id);
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

  const placeOrder = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return '';

    const entries = Object.entries(quantities);
    const itemsAr = entries.map(([oid, qty]) => `${menuItems.find((m) => m.id === oid)?.nameAr ?? ''}${qty > 1 ? ` × ${qty}` : ''}`).join('، ');
    const itemsEn = entries.map(([oid, qty]) => `${menuItems.find((m) => m.id === oid)?.nameEn ?? ''}${qty > 1 ? ` × ${qty}` : ''}`).join(', ');
    const branch = branches.find((b) => b.id === branchId);
    const address = addresses.find((a) => a.id === addressId);
    const locationAr = fulfillment === 'pickup' ? (branch?.nameAr ?? '') : address ? `${address.line}, ${address.building}` : '';
    const locationEn = fulfillment === 'pickup' ? (branch?.nameEn ?? '') : address ? `${address.line}, ${address.building}` : '';

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userData.user.id,
        items_ar: itemsAr,
        items_en: itemsEn,
        item_count: entries.reduce((sum, [, qty]) => sum + qty, 0),
        quantities,
        total: totalPrice,
        payment_method: paymentMethod,
        fulfillment,
        branch_id: fulfillment === 'pickup' ? branchId : null,
        address_id: fulfillment === 'delivery' ? addressId : null,
        location_ar: locationAr,
        location_en: locationEn,
      })
      .select()
      .single();

    resetSelection();

    if (error || !data) {
      console.error('[orders] placeOrder failed:', error);
      return '';
    }
    const order = orderFromRow(data);
    setPastOrders((prev) => [order, ...prev]);
    return order.id;
  }, [quantities, totalPrice, fulfillment, branchId, addressId, addresses, paymentMethod, resetSelection]);

  const advanceOrderStatus = useCallback(
    (orderId: string) => {
      const current = pastOrders.find((o) => o.id === orderId);
      if (!current || current.status === 'completed') return;
      const next = ORDER_STATUS_STEPS[Math.min(ORDER_STATUS_STEPS.indexOf(current.status) + 1, ORDER_STATUS_STEPS.length - 1)];
      setPastOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: next } : o)));
      supabase
        .from('orders')
        .update({ status: next })
        .eq('id', orderId)
        .then(({ error }) => {
          if (error) console.error('[orders] advanceOrderStatus failed:', error);
        });
    },
    [pastOrders]
  );

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
