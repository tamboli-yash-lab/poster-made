/**
 * Curated color palettes, font pairs, scales, and background patterns.
 */
export const THEMES = [
  {
    id: 'editorial-light',
    name: 'Editorial Light',
    bg: '#FFFFFF',
    surface: '#F4F4F5',
    textPrimary: '#09090B',
    textSecondary: '#52525B',
    accent: '#4F46E5',
    isPro: false,
  },
  {
    id: 'obsidian-dark',
    name: 'Obsidian Dark',
    bg: '#09090B',
    surface: '#18181B',
    textPrimary: '#FAFAFA',
    textSecondary: '#A1A1AA',
    accent: '#818CF8',
    isPro: false,
  },
  {
    id: 'warm-sand',
    name: 'Warm Sand',
    bg: '#F7F3EC',
    surface: '#EDE6D9',
    textPrimary: '#1C1917',
    textSecondary: '#57534E',
    accent: '#B45309',
    isPro: false,
  },
  {
    id: 'midnight-indigo',
    name: 'Midnight Indigo',
    bg: '#0F172A',
    surface: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accent: '#38BDF8',
    isPro: true,
  },
  {
    id: 'emerald-studio',
    name: 'Emerald Studio',
    bg: '#062C22',
    surface: '#0B3D30',
    textPrimary: '#ECFDF5',
    textSecondary: '#A7F3D0',
    accent: '#34D399',
    isPro: true,
  },
  {
    id: 'swiss-red',
    name: 'Swiss Red',
    bg: '#DC2626',
    surface: '#B91C1C',
    textPrimary: '#FFFFFF',
    textSecondary: '#FEE2E2',
    accent: '#111827',
    isPro: true,
  },
];

export const FONT_PAIRS = [
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    description: 'Plus Jakarta Sans + Inter',
    headingFont: "'Plus Jakarta Sans', sans-serif",
    bodyFont: "'Inter', sans-serif",
  },
  {
    id: 'editorial-serif',
    name: 'Editorial Serif',
    description: 'Playfair Display + Inter',
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
  },
  {
    id: 'tech-grotesk',
    name: 'Tech Grotesk',
    description: 'Space Grotesk + Inter',
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Inter', sans-serif",
  },
];

export const FONT_SCALES = [
  { id: 'compact', label: 'Compact', multiplier: 0.88 },
  { id: 'balanced', label: 'Balanced', multiplier: 1 },
  { id: 'bold', label: 'Bold', multiplier: 1.14 },
];

export const BG_PATTERNS = [
  { id: 'none', label: 'None' },
  { id: 'dot-grid', label: 'Fine Dot Grid' },
  { id: 'mesh-glow', label: 'Soft Mesh Glow' },
];
