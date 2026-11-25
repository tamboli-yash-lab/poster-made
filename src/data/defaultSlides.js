/**
 * Default 4-slide demo carousel loaded on first visit.
 */
export const DEFAULT_SLIDES = [
  {
    id: 'slide-1',
    layout: 'hero-cover',
    eyebrow: 'DESIGN SYSTEMS • 2026',
    headline: 'How Top Creators Design High-Retention Carousels',
    body: 'Four minimalist principles to turn complex ideas into crisp, save-worthy social slides.',
    image: null,
    showSlideNumber: true,
    showSwipeArrow: true,
  },
  {
    id: 'slide-2',
    layout: 'minimal-text',
    eyebrow: '01 / CLARITY FIRST',
    headline: 'One Slide, One Core Idea.',
    body: 'Readers swipe fast. Keep each frame focused on a single takeaway with generous whitespace so your message lands in under two seconds.',
    image: null,
    showSlideNumber: true,
    showSwipeArrow: true,
  },
  {
    id: 'slide-3',
    layout: 'quote-card',
    eyebrow: '02 / TYPOGRAPHY',
    headline: '“Whitespace is not empty space—it is the breathing room that gives your words authority.”',
    body: 'Pair a high-contrast display headline with calm, readable body copy and consistent margins.',
    image: null,
    showSlideNumber: true,
    showSwipeArrow: true,
  },
  {
    id: 'slide-4',
    layout: 'cta-outro',
    eyebrow: '03 / SAVE & SHARE',
    headline: 'Ready to craft your next carousel?',
    body: 'Bookmark this framework for your next LinkedIn or Instagram post, and follow for weekly design breakdowns.',
    image: null,
    showSlideNumber: true,
    showSwipeArrow: false,
  },
];

export const DEFAULT_PROJECT_STATE = {
  aspectRatioId: 'portrait-4-5',
  themeId: 'editorial-light',
  fontPairId: 'modern-sans',
  textAlign: 'left',
  fontScale: 'balanced',
  bgPattern: 'dot-grid',
  branding: {
    authorName: 'Get Your Poster Made',
    handle: '@getyourpostermade',
    avatar: null,
    showWatermark: true,
  },
  slides: DEFAULT_SLIDES,
};
