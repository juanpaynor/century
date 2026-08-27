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

/** Outlet photography pulled from centurypark.com.ph (960×600 each). */
export const outletPhotos = {
  cafe: [require('@/assets/outlets/cafe-1.jpg'), require('@/assets/outlets/cafe-2.jpg')],
  tsukiji: [require('@/assets/outlets/tsukiji-1.jpg'), require('@/assets/outlets/tsukiji-2.jpg')],
  deli: [require('@/assets/outlets/deli-1.jpg'), require('@/assets/outlets/deli-2.jpg')],
  atrium: [require('@/assets/outlets/atrium-1.jpg'), require('@/assets/outlets/atrium-2.jpg')],
  palm: [require('@/assets/outlets/palm-1.jpg'), require('@/assets/outlets/palm-2.jpg')],
} as const;

/** Real Century Park photography supplied by the client. */
export const photos = {
  /** Deluxe room at night — dark, warm, on-palette. Used as the hero. */
  room: require('@/assets/Room.jpg'),
  /** The tower and pool by day. Only 678×452, so keep it below full-bleed. */
  exterior: require('@/assets/centpark.jpeg'),
} as const;

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
  hero: photos.room,
  exterior: photos.exterior,
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

/**
 * Elite Card accommodation benefit: 35% off the best available rate.
 * This one IS from the client brief.
 */
export const ELITE_RATE_DISCOUNT = 0.35;

export const eliteRate = (bar: number) => Math.round(bar * (1 - ELITE_RATE_DISCOUNT));

/**
 * ⚠ RATES ARE INVENTED. The brief gave exactly one number — "Park Tower Suite
 * ₱3,700+" — which read literally would price the 73.5 sqm signature suite
 * below the 28 sqm Superior. Treated here as the hotel's "from" headline
 * rather than the suite's rate, and a coherent ladder built around it.
 * Replace all four with the real rate card before anyone sees this.
 */

export type Room = {
  id: string;
  name: string;
  sqm: number;
  rate: number;
  bed: string;
  occupancy: number;
  image: string | number;
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
    rate: 5700,
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
    rate: 7400,
    bed: 'King',
    occupancy: 3,
    image: photos.room,
    gallery: [img('1618773928121-c32242e63f39'), img('1582719478250-c89cae4dc85b')],
    blurb: 'Nearly ten square metres more room, with a proper seating corner.',
    amenities: ['Free Wi-Fi', 'Bathtub', 'Lounge chair', 'Nespresso', 'Safe', 'City view'],
    tag: 'Most booked',
  },
  {
    id: 'premier',
    name: 'Premier Room',
    sqm: 44,
    rate: 9200,
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
    rate: 14600,
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
  /** Short form for cards. */
  hours: string;
  /**
   * Service periods. `from`/`to` are minutes from midnight so the UI can
   * work out whether the outlet is open; `days` restricts to weekdays
   * (JS convention, Sun=0) when hours vary.
   */
  schedule: { label: string; time: string; from: number; to: number; days?: number[] }[];
  image: number;
  gallery: readonly number[];
  blurb: string;
  priceBand: '₱₱' | '₱₱₱';
  eliteDiscount: string;
  bookable: boolean;
  phone?: string;
  note?: string;
};

/**
 * Hours, descriptions and photography below are taken from
 * centurypark.com.ph. Elite discount bands come from the client brief.
 */

export const outlets: Outlet[] = [
  {
    id: 'cafe-in-the-park',
    name: 'Café in the Park',
    kind: 'Buffet & à la carte',
    hours: 'Daily · 6:00 AM – 10:00 PM',
    schedule: [
      { label: 'Buffet breakfast', time: '6:00 – 10:00 AM', from: 360, to: 600 },
      { label: 'Buffet lunch', time: '11:00 AM – 2:30 PM', from: 660, to: 870 },
      { label: 'Buffet dinner', time: '6:00 – 10:00 PM', from: 1080, to: 1320 },
    ],
    image: outletPhotos.cafe[0],
    gallery: outletPhotos.cafe,
    blurb:
      'Explore a wide selection of Filipino dishes and international cuisine through our breakfast, lunch, or dinner buffets. Not to miss are our equally enticing à la carte items.',
    priceBand: '₱₱',
    eliteDiscount: 'Up to 50% off',
    bookable: true,
  },
  {
    id: 'century-tsukiji',
    name: 'Century Tsukiji',
    kind: 'Japanese',
    hours: 'Daily · 11:00 AM – 9:00 PM',
    schedule: [
      { label: 'Lunch', time: '11:00 AM – 2:30 PM', from: 660, to: 870 },
      { label: 'Dinner', time: '5:00 – 9:00 PM', from: 1020, to: 1260 },
    ],
    image: outletPhotos.tsukiji[0],
    gallery: outletPhotos.tsukiji,
    blurb:
      'Savor the essence of Japan at Century Tsukiji, a renowned restaurant offering an authentic culinary journey through Japanese cuisine with a blend of buffet extravagance and exquisite à la carte options.',
    priceBand: '₱₱₱',
    eliteDiscount: 'Up to 50% off',
    bookable: true,
  },
  {
    id: 'deli-snack',
    name: 'Deli Snack',
    kind: 'Bakery & deli',
    hours: 'Daily · 7:00 AM – 7:00 PM',
    schedule: [
      { label: 'Deli Snack', time: '7:00 AM – 7:00 PM', from: 420, to: 1140 },
      { label: 'Deli Snack Lobby', time: '11:00 AM – 7:00 PM', from: 660, to: 1140 },
    ],
    image: outletPhotos.deli[0],
    gallery: outletPhotos.deli,
    blurb:
      'Take your pick among the wide selection of cold cuts plus an assortment of delectable breads, cakes, pastries and other desserts.',
    priceBand: '₱₱',
    eliteDiscount: 'Up to 50% off',
    bookable: false,
    phone: '8528-5855',
    note: '50% off selected breads and pastries, 30% off selected cakes, 6:00 – 7:00 PM daily.',
  },
  {
    id: 'atrium-lounge',
    name: 'Atrium Lounge',
    kind: 'Lounge & live music',
    hours: 'Daily · 9:00 AM – 12:00 MN',
    schedule: [{ label: 'Open daily', time: '9:00 AM – 12:00 MN', from: 540, to: 1440 }],
    image: outletPhotos.atrium[0],
    gallery: outletPhotos.atrium,
    blurb:
      'Treat yourself to some entertainment while enjoying refreshing cocktails. Have a satisfying meal or just enjoy the relaxing ambience.',
    priceBand: '₱₱',
    eliteDiscount: 'Elite rate',
    bookable: true,
    phone: '8528-5924',
  },
  {
    id: 'palm-grove',
    name: 'Palm Grove',
    kind: 'Poolside',
    hours: 'Sun–Thu · 11 AM – 7 PM · Fri–Sat to 11 PM',
    schedule: [
      { label: 'Sunday – Thursday', time: '11:00 AM – 7:00 PM', from: 660, to: 1140, days: [0, 1, 2, 3, 4] },
      { label: 'Friday – Saturday', time: '11:00 AM – 11:00 PM', from: 660, to: 1380, days: [5, 6] },
    ],
    image: outletPhotos.palm[0],
    gallery: outletPhotos.palm,
    blurb:
      'Have a leisurely chill-out while hanging out by the pool. Palm Grove offers various poolside snacks and refreshments for a truly restful time.',
    priceBand: '₱₱',
    eliteDiscount: 'Elite rate',
    bookable: true,
  },
];

/**
 * Points economy.
 *
 * Earn: 1 point per ₱10 spent on stays and dining.
 * Burn: rewards below are priced for a consistent ~7–8% return, which is
 * normal for hotel loyalty. ALL OF IT IS PROPOSED, not client-approved —
 * the earn rate and every price here is a commercial decision.
 */
export const POINTS_PER_PESO = 1 / 10;

export const pointsFor = (spend: number) => Math.round(spend * POINTS_PER_PESO);

export type Reward = {
  id: string;
  group: 'Stays' | 'Dining' | 'Wellbeing & travel';
  title: string;
  detail: string;
  points: number;
  /** Indicative peso value, used to show the member what it is worth. */
  value: number;
  icon: string;
};

export const rewards: Reward[] = [
  {
    id: 'r-night',
    group: 'Stays',
    title: 'Complimentary night',
    detail: 'Deluxe Room, excludes peak dates',
    points: 9000,
    value: 7400,
    icon: 'bed-outline',
  },
  {
    id: 'r-suite',
    group: 'Stays',
    title: 'Two nights, Park Tower Suite',
    detail: 'The signature suite, 73.5 sqm',
    points: 23000,
    value: 18980,
    icon: 'star-outline',
  },
  {
    id: 'r-upgrade',
    group: 'Stays',
    title: 'Room upgrade',
    detail: 'One category up, subject to availability',
    points: 3000,
    value: 1800,
    icon: 'arrow-up-circle-outline',
  },
  {
    id: 'r-checkout',
    group: 'Stays',
    title: 'Late checkout to 4 PM',
    detail: 'Confirmed the morning of departure',
    points: 1500,
    value: 1200,
    icon: 'time-outline',
  },
  {
    id: 'r-dine-1000',
    group: 'Dining',
    title: '₱1,000 dining credit',
    detail: 'Any outlet, single visit',
    points: 1400,
    value: 1000,
    icon: 'restaurant-outline',
  },
  {
    id: 'r-dine-2500',
    group: 'Dining',
    title: '₱2,500 dining credit',
    detail: 'Any outlet, single visit',
    points: 3200,
    value: 2500,
    icon: 'restaurant-outline',
  },
  {
    id: 'r-buffet',
    group: 'Dining',
    title: 'Buffet for two',
    detail: 'Café in the Park, lunch or dinner',
    points: 3800,
    value: 3000,
    icon: 'people-outline',
  },
  {
    id: 'r-spa',
    group: 'Wellbeing & travel',
    title: '60-minute massage',
    detail: 'Spa, by appointment',
    points: 3200,
    value: 2500,
    icon: 'flower-outline',
  },
  {
    id: 'r-transfer',
    group: 'Wellbeing & travel',
    title: 'Airport transfer',
    detail: 'One way, NAIA, sedan',
    points: 2000,
    value: 1500,
    icon: 'car-outline',
  },
];

export const rewardGroups = ['Stays', 'Dining', 'Wellbeing & travel'] as const;

/** Which service period an outlet is in right now, if any. */
export function openStatus(outlet: Outlet, now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  const day = now.getDay();
  const todays = outlet.schedule.filter((h) => !h.days || h.days.includes(day));

  const current = todays.find((h) => mins >= h.from && mins < h.to);
  if (current) return { open: true, current, label: `Open · until ${endLabel(current.time)}` };

  const next = todays.find((h) => mins < h.from);
  if (next) return { open: false, current: null, label: `Closed · opens ${startLabel(next.time)}` };

  return { open: false, current: null, label: 'Closed for today' };
}

/** "11:00 AM – 2:30 PM" -> "2:30 PM" */
function endLabel(time: string) {
  return time.split('–')[1]?.trim() ?? time;
}

/**
 * "11:00 AM – 2:30 PM" -> "11:00 AM"
 * "5:00 – 9:00 PM"     -> "5:00 PM"   (start inherits the range's meridiem)
 */
function startLabel(time: string) {
  const [rawStart, rawEnd] = time.split('–').map((t) => t.trim());
  if (!rawStart) return time;
  if (/(AM|PM|MN|NN)$/i.test(rawStart)) return rawStart;
  const meridiem = rawEnd?.match(/(AM|PM|MN|NN)$/i)?.[0];
  return meridiem ? `${rawStart} ${meridiem}` : rawStart;
}

/** Published room-service description. */
export const roomServiceBlurb =
  'Indulge in the convenience of personalized luxury with our hotel room service, where culinary excellence is delivered to your door, ensuring a seamless and delightful stay.';

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

/**
 * Elite Card is a flat paid membership — there are no tiers. Points sit on
 * top of it as spendable currency, per the client's request.
 */
export const member = {
  firstName: 'Rich',
  lastName: 'Santos',
  /** Fictional — placeholder for the demo persona. */
  email: 'r.santos@example.com',
  phone: '+63 917 000 0000',
  memberNo: '0 4 4 7 1',
  since: 2021,
  points: 18450,
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
  { id: 'p4', label: 'Complimentary night redeemed', sub: 'Reward', date: '02 Aug', points: -9000 },
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
    title: 'The Golden Year',
    sub: 'Fifty years on Ocampo Street · anniversary rates all year',
    image: photos.exterior,
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
