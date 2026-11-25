import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Download,
  FileArchive,
  FileText,
  Image as ImageIcon,
  Layers,
  Lock,
  RotateCcw,
  Undo2,
  Check,
  Loader2,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { ASPECT_RATIOS } from '../data/aspectRatios';
import { EXPORT_TIERS } from '../config/exportTiers';

/**
 * Top studio navigation bar with logo, aspect ratio selector,
 * undo/reset actions, and export quality + download dropdown.
 */
export default function Navbar({
  aspectRatioId,
  onChangeAspectRatio,
  canUndo,
  onUndo,
  onReset,
  selectedTierId,
  onSelectTier,
  onOpenProModal,
  onExportPng,
  onExportZip,
  onExportPdf,
  isExporting,
  exportProgress,
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTierClick = (tier) => {
    if (tier.isPro) {
      setExportOpen(false);
      onOpenProModal('resolution');
      return;
    }
    onSelectTier(tier.id);
  };

  const runExport = (fn) => {
    setExportOpen(false);
    fn();
  };

  return (
    <header className="h-14 shrink-0 bg-white border-b border-slate-200 px-3 sm:px-5 flex items-center justify-between gap-3 z-30">
      {/* Left: Brand Logo */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#18181B] text-white flex items-center justify-center shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-2 truncate">
          <span className="font-semibold text-[15px] tracking-tight text-[#0F172A]">
            {BRAND_CONFIG.appName}
          </span>
          <span className="hidden xl:inline-block text-xs text-[#64748B] font-medium">
            Studio
          </span>
        </div>
      </div>

      {/* Center: Aspect Ratio Selector */}
      <div className="hidden sm:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
        {ASPECT_RATIOS.map((ratio) => {
          const active = ratio.id === aspectRatioId;
          return (
            <button
              key={ratio.id}
              type="button"
              onClick={() => onChangeAspectRatio(ratio.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                active
                  ? 'bg-white text-[#0F172A] border border-slate-200/80'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>{ratio.label}</span>
              <span className="text-[10px] opacity-70">{ratio.ratio}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Aspect Ratio Select */}
      <div className="sm:hidden">
        <select
          aria-label="Aspect Ratio"
          value={aspectRatioId}
          onChange={(e) => onChangeAspectRatio(e.target.value)}
          className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {ASPECT_RATIOS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.ratio}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Undo, Reset & Export Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo last change"
          className="p-2 rounded-xl border border-slate-200 bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onReset}
          title="Reset to demo carousel"
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Reset</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setExportOpen((prev) => !prev)}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-xl bg-[#18181B] hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-70"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {exportProgress ? `Exporting ${exportProgress}%` : 'Exporting...'}
                </span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </>
            )}
          </button>

          {exportOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-lg p-2 z-50">
              {/* Export Quality Section */}
              <div className="px-2 pt-1 pb-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                  Export Quality
                </p>
                <div className="space-y-1">
                  {EXPORT_TIERS.map((tier) => {
                    const isSelected = selectedTierId === tier.id && !tier.isPro;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleTierClick(tier)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/50 text-[#0F172A]'
                            : 'border-transparent hover:bg-slate-50 text-[#0F172A]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold truncate">
                              {tier.label}
                            </span>
                            {tier.isPro ? (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                                <Lock className="w-2.5 h-2.5" />
                                PRO
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-0.5">
                            {tier.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-200 my-1.5" />

              {/* Download Actions */}
              <div className="space-y-1 p-1">
                <button
                  type="button"
                  onClick={() => runExport(onExportPng)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-[#64748B]" />
                  <span>Current Slide (PNG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => runExport(onExportZip)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <FileArchive className="w-4 h-4 text-[#64748B]" />
                  <span>All Slides (ZIP)</span>
                </button>
                <button
                  type="button"
                  onClick={() => runExport(onExportPdf)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#64748B]" />
                  <span>LinkedIn Carousel (PDF)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
