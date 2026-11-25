/**
 * Export resolution tiers.
 * Toggle `isPro` or adjust `pixelRatio` to change tier availability.
 */
export const EXPORT_TIERS = [
  {
    id: 'standard-1x',
    label: 'Standard HD (1x)',
    badge: 'FREE',
    description: 'Native 1080px width',
    pixelRatio: 1,
    isPro: false,
  },
  {
    id: 'ultra-hd-2x',
    label: 'Ultra-HD / Retina (2x)',
    badge: 'PRO',
    description: '2160px crisp social export',
    pixelRatio: 2,
    isPro: true,
  },
  {
    id: 'print-4k-3x',
    label: 'Print 4K (3x)',
    badge: 'PRO',
    description: '3240px ultra-sharp export',
    pixelRatio: 3,
    isPro: true,
  },
];
