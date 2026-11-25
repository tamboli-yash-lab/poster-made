import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import SlideRenderer from './SlideRenderer';

/**
 * Centered, responsive, zoomable preview stage for the active slide.
 * Uses ResizeObserver + CSS transform scale so the 1080px artboard never breaks layout.
 */
export default function CanvasStage({
  slide,
  slideIndex,
  totalSlides,
  theme,
  aspectRatio,
  fontPair,
  textAlign,
  fontScaleMultiplier,
  bgPattern,
  branding,
  onPrevSlide,
  onNextSlide,
}) {
  const containerRef = useRef(null);
  const [fitScale, setFitScale] = useState(0.4);
  const [zoomMultiplier, setZoomMultiplier] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const rect = el.getBoundingClientRect();
      // Leave generous breathing room around the artboard
      const availW = Math.max(rect.width - 96, 180);
      const availH = Math.max(rect.height - 64, 180);
      const scaleW = availW / aspectRatio.width;
      const scaleH = availH / aspectRatio.height;
      const nextScale = Math.min(scaleW, scaleH, 0.85);
      setFitScale(Math.max(nextScale, 0.15));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [aspectRatio.width, aspectRatio.height]);

  const effectiveScale = fitScale * zoomMultiplier;
  const scaledWidth = Math.round(aspectRatio.width * effectiveScale);
  const scaledHeight = Math.round(aspectRatio.height * effectiveScale);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative bg-[#F8FAFC]">
      {/* Subtle Top-Right Zoom Controls */}
      <div className="absolute top-3 right-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-1">
        <button
          type="button"
          onClick={() => setZoomMultiplier((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
          title="Zoom out"
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setZoomMultiplier(1)}
          title="Fit to screen"
          className="px-2 py-1 rounded-lg text-[11px] font-medium text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer tabular-nums"
        >
          {Math.round(effectiveScale * 100)}%
        </button>
        <button
          type="button"
          onClick={() => setZoomMultiplier((z) => Math.min(1.5, +(z + 0.15).toFixed(2)))}
          title="Zoom in"
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        {zoomMultiplier !== 1 && (
          <button
            type="button"
            onClick={() => setZoomMultiplier(1)}
            title="Reset zoom"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Centered Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 flex items-center justify-center p-4 sm:p-8 overflow-auto studio-scroll relative"
      >
        {/* Previous Slide Button */}
        <button
          type="button"
          onClick={onPrevSlide}
          disabled={slideIndex === 0}
          aria-label="Previous slide"
          className="hidden sm:flex absolute left-4 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 items-center justify-center text-[#0F172A] hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scaled Artboard Wrapper */}
        <div
          className="relative shrink-0 transition-[width,height] duration-200 ease-out rounded-xl overflow-hidden border border-slate-200/90 bg-white"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
          }}
        >
          <div
            style={{
              width: `${aspectRatio.width}px`,
              height: `${aspectRatio.height}px`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
            }}
          >
            <SlideRenderer
              slide={slide}
              slideIndex={slideIndex}
              totalSlides={totalSlides}
              theme={theme}
              aspectRatio={aspectRatio}
              fontPair={fontPair}
              textAlign={textAlign}
              fontScaleMultiplier={fontScaleMultiplier}
              bgPattern={bgPattern}
              branding={branding}
            />
          </div>
        </div>

        {/* Next Slide Button */}
        <button
          type="button"
          onClick={onNextSlide}
          disabled={slideIndex >= totalSlides - 1}
          aria-label="Next slide"
          className="hidden sm:flex absolute right-4 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 items-center justify-center text-[#0F172A] hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Slide Counter Pill (Mobile-friendly nav) */}
      <div className="pb-2 flex items-center justify-center gap-3 sm:hidden">
        <button
          type="button"
          onClick={onPrevSlide}
          disabled={slideIndex === 0}
          className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium text-[#64748B] tabular-nums">
          Slide {slideIndex + 1} of {totalSlides}
        </span>
        <button
          type="button"
          onClick={onNextSlide}
          disabled={slideIndex >= totalSlides - 1}
          className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
