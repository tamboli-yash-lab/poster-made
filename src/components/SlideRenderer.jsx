import React from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

/**
 * Pure rendering component for a single 1080px-wide slide artboard.
 * Designed to be scaled via CSS transform in previews and captured 1:1 by html-to-image.
 */
export default function SlideRenderer({
  slide,
  slideIndex = 0,
  totalSlides = 1,
  theme,
  aspectRatio,
  fontPair,
  textAlign = 'left',
  fontScaleMultiplier = 1,
  bgPattern = 'none',
  branding,
}) {
  const { width, height } = aspectRatio;
  const isCentered = textAlign === 'center';
  const padX = 88;
  const padY = height >= 1900 ? 120 : 88;

  const formattedIndex = String(slideIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalSlides).padStart(2, '0');

  // Scaled typography sizes (px) relative to 1080px canvas
  const s = (basePx) => Math.round(basePx * fontScaleMultiplier);

  const isHero = slide.layout === 'hero-cover';
  const isQuote = slide.layout === 'quote-card';
  const isNumbered = slide.layout === 'numbered-list';
  const isOutro = slide.layout === 'cta-outro';

  // Background pattern overlay style
  const renderPattern = () => {
    if (bgPattern === 'dot-grid') {
      return (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.16,
            backgroundImage: `radial-gradient(${theme.textSecondary} 1.5px, transparent 1.5px)`,
            backgroundSize: '28px 28px',
          }}
        />
      );
    }

    if (bgPattern === 'mesh-glow') {
      return (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at 85% 15%, ${theme.accent}24 0%, transparent 48%), radial-gradient(circle at 12% 88%, ${theme.accent}18 0%, transparent 45%)`,
          }}
        />
      );
    }

    return null;
  };

  const hasAuthor = Boolean(branding?.authorName?.trim() || branding?.handle?.trim() || branding?.avatar);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: theme.bg,
        color: theme.textPrimary,
        fontFamily: fontPair.bodyFont,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: `${padY}px ${padX}px`,
        boxSizing: 'border-box',
      }}
    >
      {renderPattern()}

      {/* Top Header Bar: Author Identity + Slide Counter */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          minHeight: '56px',
        }}
      >
        {hasAuthor ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {branding.avatar ? (
              <img
                src={branding.avatar}
                alt={branding.authorName || 'Author'}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '9999px',
                  objectFit: 'cover',
                  border: `2px solid ${theme.surface}`,
                }}
              />
            ) : (
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '9999px',
                  backgroundColor: theme.surface,
                  color: theme.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '22px',
                  fontFamily: fontPair.headingFont,
                }}
              >
                {(branding.authorName || branding.handle || 'P').charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {branding.authorName && (
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: theme.textPrimary,
                    lineHeight: 1.2,
                  }}
                >
                  {branding.authorName}
                </span>
              )}
              {branding.handle && (
                <span
                  style={{
                    fontSize: '19px',
                    fontWeight: 500,
                    color: theme.textSecondary,
                    lineHeight: 1.2,
                  }}
                >
                  {branding.handle}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div />
        )}

        {slide.showSlideNumber && (
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: theme.textSecondary,
              backgroundColor: theme.surface,
              padding: '10px 20px',
              borderRadius: '9999px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formattedIndex} / {formattedTotal}
          </div>
        )}
      </div>

      {/* Center Content Stage */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isCentered ? 'center' : 'flex-start',
          textAlign: isCentered ? 'center' : 'left',
          gap: isHero ? '32px' : '26px',
          padding: '36px 0',
        }}
      >
        {/* Numbered-list visual badge */}
        {isNumbered && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              backgroundColor: theme.surface,
              color: theme.accent,
              fontFamily: fontPair.headingFont,
              fontWeight: 700,
              fontSize: `${s(38)}px`,
              letterSpacing: '-0.02em',
            }}
          >
            {formattedIndex}
          </div>
        )}

        {/* Quote icon */}
        {isQuote && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '68px',
              height: '68px',
              borderRadius: '18px',
              backgroundColor: theme.surface,
              color: theme.accent,
            }}
          >
            <Quote size={34} strokeWidth={2.2} />
          </div>
        )}

        {/* Eyebrow / Tag */}
        {slide.eyebrow && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: isHero ? '10px 22px' : '0',
              borderRadius: isHero ? '9999px' : '0',
              backgroundColor: isHero ? theme.surface : 'transparent',
              color: theme.accent,
              fontSize: `${s(21)}px`,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {slide.eyebrow}
          </div>
        )}

        {/* Headline */}
        {slide.headline && (
          <h1
            style={{
              margin: 0,
              fontFamily: fontPair.headingFont,
              fontWeight: isQuote ? 600 : 700,
              fontStyle: isQuote && fontPair.id === 'editorial-serif' ? 'italic' : 'normal',
              fontSize: `${s(isHero ? 76 : isQuote ? 54 : 62)}px`,
              lineHeight: isHero ? 1.08 : 1.15,
              letterSpacing: '-0.025em',
              color: theme.textPrimary,
              maxWidth: '900px',
              wordBreak: 'break-word',
            }}
          >
            {slide.headline}
          </h1>
        )}

        {/* Optional Accent Divider for Hero & Outro */}
        {(isHero || isOutro) && (
          <div
            style={{
              width: '72px',
              height: '6px',
              borderRadius: '9999px',
              backgroundColor: theme.accent,
            }}
          />
        )}

        {/* Body Text */}
        {slide.body && (
          <p
            style={{
              margin: 0,
              fontFamily: fontPair.bodyFont,
              fontSize: `${s(isHero ? 32 : 30)}px`,
              lineHeight: 1.5,
              fontWeight: 400,
              color: theme.textSecondary,
              maxWidth: '840px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {slide.body}
          </p>
        )}

        {/* Optional Slide Image */}
        {slide.image && (
          <div
            style={{
              width: '100%',
              marginTop: '12px',
              borderRadius: '28px',
              overflow: 'hidden',
              backgroundColor: theme.surface,
              border: `1px solid ${theme.surface}`,
              maxHeight: height >= 1900 ? '560px' : height >= 1350 ? '380px' : '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={slide.image}
              alt="Slide visual"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )}

        {/* CTA Outro Pill */}
        {isOutro && (
          <div
            style={{
              marginTop: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 34px',
              borderRadius: '9999px',
              backgroundColor: theme.accent,
              color: '#FFFFFF',
              fontSize: `${s(24)}px`,
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            <span>Save &amp; Follow for More</span>
            <ArrowRight size={24} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Bottom Footer: Watermark + Swipe Indicator */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          minHeight: '48px',
        }}
      >
        {branding?.showWatermark ? (
          <span
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: theme.textSecondary,
              opacity: 0.72,
              letterSpacing: '0.01em',
            }}
          >
            {BRAND_CONFIG.defaultWatermark}
          </span>
        ) : (
          <div />
        )}

        {slide.showSwipeArrow && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 22px',
              borderRadius: '9999px',
              backgroundColor: theme.surface,
              color: theme.textPrimary,
              fontSize: '19px',
              fontWeight: 600,
            }}
          >
            <span>Swipe</span>
            <ArrowRight size={20} strokeWidth={2.4} style={{ color: theme.accent }} />
          </div>
        )}
      </div>
    </div>
  );
}
