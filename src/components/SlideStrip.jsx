import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Plus,
  Trash2,
} from 'lucide-react';
import SlideRenderer from './SlideRenderer';

/**
 * Bottom horizontal slide strip for selecting, adding, duplicating,
 * reordering (left/right), and deleting slides.
 */
export default function SlideStrip({
  slides,
  activeSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onMoveSlide,
  onDeleteSlide,
  theme,
  aspectRatio,
  fontPair,
  textAlign,
  fontScaleMultiplier,
  bgPattern,
  branding,
}) {
  const thumbWidth = 72;
  const thumbScale = thumbWidth / aspectRatio.width;
  const thumbHeight = Math.round(aspectRatio.height * thumbScale);

  return (
    <div className="shrink-0 bg-white border-t border-slate-200 px-3 sm:px-5 py-2.5">
      <div className="flex items-center gap-3 overflow-x-auto studio-scroll pb-1">
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;
          return (
            <div
              key={slide.id}
              className="group relative shrink-0 flex flex-col items-center gap-1.5"
            >
              {/* Thumbnail Preview Card */}
              <button
                type="button"
                onClick={() => onSelectSlide(idx)}
                className={`relative rounded-xl overflow-hidden border transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/25'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{
                  width: `${thumbWidth}px`,
                  height: `${Math.min(thumbHeight, 96)}px`,
                }}
              >
                <div
                  style={{
                    width: `${aspectRatio.width}px`,
                    height: `${aspectRatio.height}px`,
                    transform: `scale(${thumbScale})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                  }}
                >
                  <SlideRenderer
                    slide={slide}
                    slideIndex={idx}
                    totalSlides={slides.length}
                    theme={theme}
                    aspectRatio={aspectRatio}
                    fontPair={fontPair}
                    textAlign={textAlign}
                    fontScaleMultiplier={fontScaleMultiplier}
                    bgPattern={bgPattern}
                    branding={branding}
                  />
                </div>
              </button>

              {/* Quick Actions Bar on Hover or Active */}
              <div
                className={`flex items-center gap-0.5 transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onMoveSlide(idx, idx - 1)}
                  disabled={idx === 0}
                  title="Move left"
                  className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicateSlide(idx)}
                  title="Duplicate slide"
                  className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteSlide(idx)}
                  disabled={slides.length <= 1}
                  title="Delete slide"
                  className="p-1 rounded-md text-[#64748B] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveSlide(idx, idx + 1)}
                  disabled={idx === slides.length - 1}
                  title="Move right"
                  className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Slide Button */}
        <button
          type="button"
          onClick={onAddSlide}
          className="shrink-0 h-[84px] w-[72px] rounded-xl border border-dashed border-slate-300 hover:border-[#18181B] hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[11px] font-medium">Add</span>
        </button>
      </div>
    </div>
  );
}
