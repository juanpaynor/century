import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { certificates as seedCerts, menu, type Certificate, type MenuItem } from './hotel';

/**
 * In-memory prototype state. Nothing persists across reloads by design —
 * this stands in for the API layer so flows can be demoed end to end.
 */

export type CartLine = { item: MenuItem; qty: number };

export type Order = {
  id: string;
  lines: CartLine[];
  total: number;
  placedAt: string;
  status: 'Preparing' | 'On the way' | 'Delivered';
  note: string;
};

export type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  eliteApplied: boolean;
};

export type RequestLog = {
  id: string;
  label: string;
  icon: string;
  at: string;
  status: 'Received' | 'In progress' | 'Done';
};

type Ctx = {
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: MenuItem) => void;
  setQty: (itemId: string, qty: number) => void;
  clearCart: () => void;

  orders: Order[];
  placeOrder: (note: string) => Order;

  bookings: Booking[];
  addBooking: (b: Omit<Booking, 'id'>) => Booking;

  requests: RequestLog[];
  logRequest: (label: string, icon: string) => void;

  certificates: Certificate[];
  redeemCertificate: (id: string) => void;
};

const AppContext = createContext<Ctx | null>(null);

const now = () =>
  new Date().toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>(seedCerts);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const hit = prev.find((l) => l.item.id === item.id);
      if (hit) return prev.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { item, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((itemId: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.item.id !== itemId)
        : prev.map((l) => (l.item.id === itemId ? { ...l, qty } : l)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((n, l) => n + l.qty * l.item.price, 0),
    [cart],
  );

  const placeOrder = useCallback(
    (note: string) => {
      const order: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        lines: cart,
        total: cart.reduce((n, l) => n + l.qty * l.item.price, 0),
        placedAt: now(),
        status: 'Preparing',
        note,
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart],
  );

  const addBooking = useCallback((b: Omit<Booking, 'id'>) => {
    const booking: Booking = { ...b, id: `CPM-${Math.floor(1000000 + Math.random() * 8999999)}` };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  }, []);

  const logRequest = useCallback((label: string, icon: string) => {
    setRequests((prev) => [
      { id: `${Date.now()}`, label, icon, at: now(), status: 'Received' },
      ...prev,
    ]);
  }, []);

  const redeemCertificate = useCallback((id: string) => {
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, used: true } : c)));
  }, []);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartTotal,
      addToCart,
      setQty,
      clearCart,
      orders,
      placeOrder,
      bookings,
      addBooking,
      requests,
      logRequest,
      certificates,
      redeemCertificate,
    }),
    [
      cart,
      cartCount,
      cartTotal,
      addToCart,
      setQty,
      clearCart,
      orders,
      placeOrder,
      bookings,
      addBooking,
      requests,
      logRequest,
      certificates,
      redeemCertificate,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function findMenuItem(id: string) {
  return menu.find((m) => m.id === id);
}
