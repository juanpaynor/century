import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { addDays, nightsBetween, startOfDay } from '@/constants/dates';
import {
  certificates as seedCerts,
  member,
  menu,
  pointsHistory as seedHistory,
  type Certificate,
  type MenuItem,
  type PointsEntry,
  type Reward,
} from './hotel';

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

/** Live search criteria shared by the rooms list, detail and review screens. */
export type Search = {
  checkIn: Date;
  checkOut: Date;
  guests: number;
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
  points: number;
  pointsHistory: PointsEntry[];
  /** Returns false when the balance is short. */
  redeemReward: (reward: Reward) => boolean;

  search: Search;
  nights: number;
  setSearch: (next: Partial<Search>) => void;

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
  const [search, setSearchState] = useState<Search>(() => {
    const checkIn = addDays(new Date(), 1);
    return { checkIn, checkOut: addDays(checkIn, 2), guests: 2 };
  });

  const setSearch = useCallback((next: Partial<Search>) => {
    setSearchState((prev) => {
      const merged = { ...prev, ...next };
      // check-out must always follow check-in
      if (startOfDay(merged.checkOut) <= startOfDay(merged.checkIn)) {
        merged.checkOut = addDays(merged.checkIn, 1);
      }
      merged.guests = Math.min(6, Math.max(1, merged.guests));
      return merged;
    });
  }, []);

  const nights = useMemo(
    () => nightsBetween(search.checkIn, search.checkOut),
    [search.checkIn, search.checkOut],
  );

  const [points, setPoints] = useState(member.points);
  const [pointsHistory, setPointsHistory] = useState<PointsEntry[]>(seedHistory);

  const redeemReward = useCallback(
    (reward: Reward) => {
      let ok = false;
      setPoints((bal) => {
        if (bal < reward.points) return bal;
        ok = true;
        return bal - reward.points;
      });
      if (ok) {
        setPointsHistory((prev) => [
          {
            id: `r-${Date.now()}`,
            label: `${reward.title} redeemed`,
            sub: 'Reward',
            date: new Date().toLocaleDateString('en-PH', { day: 'numeric', month: 'short' }),
            points: -reward.points,
          },
          ...prev,
        ]);
      }
      return ok;
    },
    [],
  );

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
      points,
      pointsHistory,
      redeemReward,
      search,
      nights,
      setSearch,
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
      points,
      pointsHistory,
      redeemReward,
      search,
      nights,
      setSearch,
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
