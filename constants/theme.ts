/**
 * Century Park Hotel Manila — design tokens.
 *
 * Brand colours supplied by the client: maroon #6E1423, gold #C9A227.
 * Everything else is derived from those two so the palette stays coherent.
 */

export const colors = {
  /* ── Brand ── */
  maroon: '#6E1423',
  maroonDeep: '#4A0C17',
  maroonMid: '#8A1C2C',
  /** Brighter red from the circular logo mark. */
  logoRed: '#D81E2C',
  maroonSoft: '#F6EAEC',

  gold: '#C9A227',
  goldLight: '#E4C766',
  goldPale: '#F2E4B8',
  goldSoft: '#FAF3E0',

  /* ── Ground ── */
  bg: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F3EEE6',

  /* ── Ink ── */
  ink: '#1A1214',
  inkMuted: '#6B5C5F',
  inkFaint: '#9C8F91',
  onDark: '#FFFFFF',
  onDarkMuted: 'rgba(255,255,255,0.72)',
  onDarkFaint: 'rgba(255,255,255,0.48)',

  /* ── Lines ── */
  line: '#E9E1D6',
  lineStrong: '#D8CDBE',
  lineOnDark: 'rgba(255,255,255,0.16)',

  /* ── Status ── */
  success: '#2E7D5B',
  warning: '#B4762A',
  danger: '#B3392F',

  /* ── Dark ground (homepage) ── */
  page: '#3F0A14',
  pageDeep: '#2C0710',
  raised: 'rgba(255,255,255,0.055)',
  raisedStrong: 'rgba(255,255,255,0.09)',
  hairline: 'rgba(228,199,102,0.22)',
  hairlineSoft: 'rgba(255,255,255,0.10)',
} as const;

/** Gradient ramps — the Elite Card and hero surfaces lean on these. */
export const gradients = {
  card: ['#8A1C2C', '#6E1423', '#4A0C17'] as const,
  gold: ['#E4C766', '#C9A227', '#A8861D'] as const,
  scrim: ['transparent', 'rgba(26,18,20,0.86)'] as const,
  maroonWash: ['#6E1423', '#4A0C17'] as const,
  /**
   * Hero scrim. Tuned for the supplied Deluxe room shot: barely tinted over
   * the window and lamp at the top, fully solid by 80% so the white masthead
   * never has to sit on the bright duvet.
   */
  heroScrim: ['rgba(44,7,16,0.10)', 'rgba(44,7,16,0.48)', '#3F0A14'] as const,
  pageWash: ['#3F0A14', '#2C0710'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  card: 18,
  pill: 999,
} as const;

export const type = {
  display: { fontSize: 30, lineHeight: 36, letterSpacing: -0.6, fontWeight: '700' as const },
  title: { fontSize: 22, lineHeight: 28, letterSpacing: -0.3, fontWeight: '700' as const },
  section: { fontSize: 17, lineHeight: 22, letterSpacing: -0.2, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, lineHeight: 21, fontWeight: '600' as const },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  caption: { fontSize: 11, lineHeight: 14, letterSpacing: 0.8, fontWeight: '700' as const },
  /** Wide-tracked gold lettering, as on the physical Elite Card. */
  eliteWordmark: { fontSize: 26, letterSpacing: 8, fontWeight: '400' as const },
} as const;

export const shadow = {
  card: {
    shadowColor: '#2B1418',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  lifted: {
    shadowColor: '#2B1418',
    shadowOpacity: 0.16,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 12 },
    elevation: 9,
  },
} as const;

/** The hotel opened in 1976 — 2026 is the golden anniversary. */
export const anniversary = {
  year: 2026,
  founded: 1976,
  years: 50,
  label: '50th Anniversary',
} as const;

/** ₱ formatting used across rates, folio, and dining totals. */
export function peso(amount: number, opts: { decimals?: boolean } = {}) {
  const { decimals = false } = opts;
  const n = Math.abs(amount).toLocaleString('en-PH', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
  return `${amount < 0 ? '−' : ''}₱${n}`;
}
