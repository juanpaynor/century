/**
 * PROTOTYPE DATA — no backend.
 *
 * Facts sourced from the client brief (address, room categories, F&B outlets,
 * Elite Card terms) are real. Nightly rates beyond the Park Tower Suite
 * (₱3,700+), point balances, folio lines and dates are INVENTED for the demo
 * and must be replaced before anything goes in front of a guest.
 */

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const hotel = {
  name: 'Century Park Hotel',
  city: 'Manila',
  address: '599 P. Ocampo St., Malate, Manila',
  established: 1976,
  floors: 19,
  rooms: 478,
  star: 4,
  operator: 'Maranaw Hotels and Resort Corp. (LT Group)',
  blurb:
    'A Malate landmark since 1976. Nineteen floors around a garden atrium, minutes from Roxas Boulevard and the bay.',
  hero: img('1566073771259-6a8506099945', 1400),
  phone: '+63 2 8528 8888',
  nearby: [
    { name: 'Roxas Boulevard', detail: '5 min drive' },
    { name: 'Malate Church', detail: '7 min walk' },
    { name: 'WTC Metro Manila', detail: '6 min drive' },
    { name: 'Star City', detail: '8 min drive' },
    { name: 'NAIA Terminals', detail: '~8 km' },
  ],
} as const;

/* ─────────────────────────  Rooms  ───────────────────────── */

export type Room = {
  id: string;
  name: string;
  sqm: number;
  rate: number;
  bed: string;
  occupancy: number;
  image: string;
  gallery: string[];
  blurb: string;
  amenities: string[];
  tag?: string;
};

export const rooms: Room[] = [
  {
    id: 'superior',
    name: 'Superior Room',
    sqm: 28,
    rate: 4200,
    bed: 'King or Twin',
    occupancy: 2,
    image: img('1611892440504-42a792e24d32'),
    gallery: [img('1611892440504-42a792e24d32'), img('1590490360182-c33d57733427')],
    blurb: 'The efficient city room — everything you need for a short Manila stay.',
    amenities: ['Free Wi-Fi', 'Rain shower', 'Work desk', 'Smart TV', 'Safe'],
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    sqm: 37.5,
    rate: 5400,
    bed: 'King',
    occupancy: 3,
    image: img('1618773928121-c32242e63f39'),
    gallery: [img('1618773928121-c32242e63f39'), img('1582719478250-c89cae4dc85b')],
    blurb: 'Nearly ten square metres more room, with a proper seating corner.',
    amenities: ['Free Wi-Fi', 'Bathtub', 'Lounge chair', 'Nespresso', 'Safe', 'City view'],
    tag: 'Most booked',
  },
  {
    id: 'premier',
    name: 'Premier Room',
    sqm: 44,
    rate: 6800,
    bed: 'King',
    occupancy: 3,
    image: img('1582719478250-c89cae4dc85b'),
    gallery: [img('1582719478250-c89cae4dc85b'), img('1631049307264-da0ec9d70304')],
    blurb: 'Upper-floor room with atrium or bay outlook and lounge access.',
    amenities: ['Atrium Lounge access', 'Bathtub', 'Nespresso', 'Bay view', 'Late checkout'],
  },
  {
    id: 'park-tower-suite',
    name: 'Park Tower Suite',
    sqm: 73.5,
    rate: 3700,
    bed: 'King + sofa bed',
    occupancy: 4,
    image: img('1631049307264-da0ec9d70304'),
    gallery: [img('1631049307264-da0ec9d70304'), img('1445019980597-93fa8acb246c')],
    blurb:
      'Seventy-three square metres across a separate living room and bedroom. The signature suite.',
    amenities: [
      'Separate living room',
      'Atrium Lounge access',
      'Butler service',
      'Bathtub',
      'Nespresso',
      'Complimentary pressing',
    ],
    tag: 'Signature',
  },
];

/* ─────────────────────  Dining outlets  ───────────────────── */

export type Outlet = {
  id: string;
  name: string;
  kind: string;
  hours: string;
  image: string;
  blurb: string;
  priceBand: '₱₱' | '₱₱₱';
  eliteDiscount: string;
  bookable: boolean;
};

export const outlets: Outlet[] = [
  {
    id: 'cafe-in-the-park',
    name: 'Café in the Park',
    kind: 'International buffet',
    hours: '6:00 AM – 10:00 PM',
    image: img('1414235077428-338989a2e8c0'),
    blurb:
      'The hotel’s all-day buffet, opening onto the garden atrium. Breakfast through late dinner.',
    priceBand: '₱₱',
    eliteDiscount: 'Up to 50% off',
    bookable: true,
  },
  {
    id: 'century-tsukiji',
    name: 'Century Tsukiji',
    kind: 'Japanese',
    hours: '11:30 AM – 2:30 PM · 6:00 – 10:00 PM',
    image: img('1579027989536-b7b1f875659b'),
    blurb: 'Sushi counter, teppan and tatami rooms — a Manila fixture for Japanese dining.',
    priceBand: '₱₱₱',
    eliteDiscount: 'Up to 50% off',
    bookable: true,
  },
  {
    id: 'deli-snack',
    name: 'Deli Snack',
    kind: 'Bakery & deli',
    hours: '7:00 AM – 9:00 PM',
    image: img('1517248135467-4c7edcad34c4'),
    blurb: 'Pastries, sandwiches and cakes to take up to the room or out the door.',
    priceBand: '₱₱',
    eliteDiscount: 'Up to 50% off',
    bookable: false,
  },
  {
    id: 'atrium-lounge',
    name: 'Atrium Lounge',
    kind: 'Lounge & afternoon tea',
    hours: '10:00 AM – 11:00 PM',
    image: img('1552566626-52f8b828add9'),
    blurb: 'Coffee, cocktails and afternoon tea under the atrium skylight.',
    priceBand: '₱₱',
    eliteDiscount: 'Elite rate',
    bookable: true,
  },
  {
    id: 'palm-grove',
    name: 'Palm Grove',
    kind: 'Poolside bar',
    hours: '4:00 PM – 12:00 AM',
    image: img('1470337458703-46ad1756a187'),
    blurb: 'Poolside drinks and grill, open late.',
    priceBand: '₱₱',
    eliteDiscount: 'Elite rate',
    bookable: true,
  },
];

/* ────────────────────  Room service menu  ─────────────────── */

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  desc: string;
  category: string;
  outlet: string;
  image?: string;
  popular?: boolean;
};

export const menu: MenuItem[] = [
  {
    id: 'ms-1',
    name: 'Century Club Sandwich',
    price: 680,
    desc: 'Triple-decker, chicken, egg and bacon, hand-cut fries.',
    category: 'All Day',
    outlet: 'Deli Snack',
    image: img('1567620905732-2d1ec7ab7445', 500),
    popular: true,
  },
  {
    id: 'ms-2',
    name: 'Bangus Belly Sinigang',
    price: 720,
    desc: 'Milkfish belly in tamarind broth, steamed rice.',
    category: 'Filipino',
    outlet: 'Café in the Park',
    image: img('1543353071-873f17a7a088', 500),
    popular: true,
  },
  {
    id: 'ms-3',
    name: 'Chicken Adobo Rice Bowl',
    price: 590,
    desc: 'Slow-braised in soy, vinegar and garlic, egg on top.',
    category: 'Filipino',
    outlet: 'Café in the Park',
    image: img('1546069901-ba9599a7e63c', 500),
  },
  {
    id: 'ms-4',
    name: 'Tsukiji Sashimi Set',
    price: 1450,
    desc: 'Nine pieces, chef’s selection, wasabi and shoyu.',
    category: 'Japanese',
    outlet: 'Century Tsukiji',
    image: img('1579027989536-b7b1f875659b', 500),
    popular: true,
  },
  {
    id: 'ms-5',
    name: 'Salmon Teriyaki Donburi',
    price: 980,
    desc: 'Grilled salmon, teriyaki glaze, Japanese rice.',
    category: 'Japanese',
    outlet: 'Century Tsukiji',
    image: img('1553621042-f6e147245754', 500),
  },
  {
    id: 'ms-6',
    name: 'Breakfast in the Park',
    price: 850,
    desc: 'Eggs your way, longganisa, garlic rice, fruit, coffee.',
    category: 'Breakfast',
    outlet: 'Café in the Park',
    image: img('1533089860892-a7c6f0a88666', 500),
  },
  {
    id: 'ms-7',
    name: 'Ube Cheesecake',
    price: 320,
    desc: 'Deli Snack’s house cake, purple yam and cream cheese.',
    category: 'Sweets',
    outlet: 'Deli Snack',
    image: img('1551882547-ff40c63fe5fa', 500),
  },
  {
    id: 'ms-8',
    name: 'Calamansi Iced Tea',
    price: 220,
    desc: 'Brewed black tea, local calamansi, served by the glass.',
    category: 'Drinks',
    outlet: 'Atrium Lounge',
  },
  {
    id: 'ms-9',
    name: 'San Miguel Pale Pilsen',
    price: 190,
    desc: 'Chilled, 330ml.',
    category: 'Drinks',
    outlet: 'Palm Grove',
  },
];

export const menuCategories = [
  'Popular',
  'Breakfast',
  'Filipino',
  'Japanese',
  'All Day',
  'Sweets',
  'Drinks',
];

/* ──────────────────────  Elite Card  ─────────────────────── */

export type EliteTier = 'Classic' | 'Gold' | 'Platinum';

export const eliteProgram = {
  name: 'Elite Card',
  annualFee: 7900,
  tagline: 'The Century Park membership, now in your pocket.',
  /** Real published benefits from the physical card. */
  benefits: [
    {
      icon: 'restaurant-outline',
      title: 'Dining 20–50% off',
      detail:
        'At Café in the Park, Century Tsukiji and Deli Snack. Discount scales with your group size.',
    },
    {
      icon: 'bed-outline',
      title: '35% off best available rate',
      detail: 'Applied automatically at booking for the cardholder.',
    },
    {
      icon: 'arrow-up-circle-outline',
      title: 'Room upgrade certificates',
      detail: 'Subject to availability on arrival.',
    },
    {
      icon: 'gift-outline',
      title: 'Complimentary stay certificates',
      detail: 'Issued annually with membership.',
    },
    {
      icon: 'swap-horizontal-outline',
      title: 'Transferable membership',
      detail: 'The card may be passed to another named holder.',
    },
  ],
  /** Real published tiering: dining discount is by group size, not tier. */
  diningTable: [
    { party: '1–2 guests', off: '50%' },
    { party: '3–4 guests', off: '35%' },
    { party: '5–6 guests', off: '25%' },
    { party: '7+ guests', off: '20%' },
  ],
};

export type Certificate = {
  id: string;
  kind: 'upgrade' | 'stay' | 'dining';
  title: string;
  detail: string;
  expires: string;
  used: boolean;
};

export const member = {
  firstName: 'Rich',
  lastName: 'Santos',
  memberNo: 'CP-ELITE-0 4471',
  tier: 'Gold' as EliteTier,
  since: 2021,
  points: 18450,
  pointsToNext: 6550,
  nextTier: 'Platinum' as EliteTier,
  renews: '31 Dec 2026',
  ytdSpend: 214300,
  ytdNights: 22,
  ytdSaved: 68900,
};

export const certificates: Certificate[] = [
  {
    id: 'c1',
    kind: 'upgrade',
    title: 'Room Upgrade Certificate',
    detail: 'One category up, subject to availability',
    expires: '31 Dec 2026',
    used: false,
  },
  {
    id: 'c2',
    kind: 'stay',
    title: 'Complimentary Night',
    detail: 'Deluxe Room, one night, excludes peak dates',
    expires: '31 Dec 2026',
    used: false,
  },
  {
    id: 'c3',
    kind: 'dining',
    title: 'Buffet for Two',
    detail: 'Café in the Park, dinner buffet',
    expires: '30 Sep 2026',
    used: true,
  },
];

export type PointsEntry = {
  id: string;
  label: string;
  sub: string;
  date: string;
  points: number;
};

export const pointsHistory: PointsEntry[] = [
  { id: 'p1', label: 'Century Tsukiji', sub: 'Dining · ₱4,280', date: '24 Aug', points: 428 },
  { id: 'p2', label: 'Deluxe Room · 2 nights', sub: 'Stay · ₱10,800', date: '22 Aug', points: 1080 },
  { id: 'p3', label: 'Room service', sub: 'Dining · ₱1,240', date: '22 Aug', points: 124 },
  { id: 'p4', label: 'Complimentary Night redeemed', sub: 'Certificate', date: '02 Aug', points: -5000 },
  { id: 'p5', label: 'Café in the Park', sub: 'Dining · ₱3,150', date: '28 Jul', points: 315 },
];

/* ───────────────────────  Current stay  ──────────────────── */

export const stay = {
  active: true,
  room: '1412',
  roomType: 'Deluxe Room',
  checkIn: 'Tue 25 Aug',
  checkOut: 'Fri 28 Aug',
  nights: 3,
  guests: 2,
  confirmation: 'CPM-8842190',
  keyReady: true,
  folio: [
    { id: 'f1', label: 'Deluxe Room · 3 nights', amount: 16200 },
    { id: 'f2', label: 'Century Tsukiji · 24 Aug', amount: 4280 },
    { id: 'f3', label: 'Room service · 22 Aug', amount: 1240 },
    { id: 'f4', label: 'Elite Card discount (35%)', amount: -5670 },
  ],
};

export type ServiceRequest = {
  id: string;
  label: string;
  icon: string;
  eta: string;
};

export const serviceRequests: ServiceRequest[] = [
  { id: 'sr1', label: 'Housekeeping', icon: 'sparkles-outline', eta: '~20 min' },
  { id: 'sr2', label: 'Extra towels', icon: 'water-outline', eta: '~15 min' },
  { id: 'sr3', label: 'Maintenance', icon: 'construct-outline', eta: '~30 min' },
  { id: 'sr4', label: 'Laundry pickup', icon: 'shirt-outline', eta: '~25 min' },
  { id: 'sr5', label: 'Airport transfer', icon: 'car-outline', eta: 'Book ahead' },
  { id: 'sr6', label: 'Late checkout', icon: 'time-outline', eta: 'On request' },
];

/* ─────────────────────────  Promos  ──────────────────────── */

export const promos = [
  {
    id: 'pr1',
    title: 'Elite Card Renewal Week',
    sub: 'Renew before 30 Sep and get a bonus upgrade certificate',
    image: img('1414235077428-338989a2e8c0', 900),
    accent: '#B08D4F',
  },
  {
    id: 'pr2',
    title: 'Tsukiji Omakase Nights',
    sub: 'Thursdays · chef’s counter, ten courses',
    image: img('1579027989536-b7b1f875659b', 900),
    accent: '#0F3D2E',
  },
  {
    id: 'pr3',
    title: 'Stay 3, Pay 2',
    sub: 'Deluxe and Premier rooms through November',
    image: img('1618773928121-c32242e63f39', 900),
    accent: '#1B5E46',
  },
];

export const amenities = [
  { id: 'a1', name: 'Outdoor Pool', icon: 'water-outline', detail: '6:00 AM – 9:00 PM · 5F' },
  { id: 'a2', name: 'Fitness Center', icon: 'barbell-outline', detail: '24 hours · 5F' },
  { id: 'a3', name: 'Spa & Massage', icon: 'flower-outline', detail: '10:00 AM – 10:00 PM' },
  { id: 'a4', name: 'Function Rooms', icon: 'business-outline', detail: '19 venues · up to 1,200 pax' },
  { id: 'a5', name: 'Business Center', icon: 'briefcase-outline', detail: '7:00 AM – 9:00 PM' },
  { id: 'a6', name: 'Parking', icon: 'car-outline', detail: 'Complimentary for guests' },
];
