import React from 'react';
import { Check, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

const PRO_BENEFITS = [
  'Watermark-free exports',
  'Ultra-HD 2x & 4K 3x crisp resolution (zero Instagram/LinkedIn blur)',
  'Access to all Pro color themes',
];

/**
 * Clean upgrade modal triggered when clicking Pro themes,
 * Pro export resolutions, or disabling the watermark.
 */
export default function ProModal({ isOpen, triggerReason, onClose }) {
  if (!isOpen) return null;

  const subtitleByReason = {
    watermark: 'Remove the default Poster Made watermark from every slide.',
    theme: 'Unlock curated Pro color palettes crafted for high-retention posts.',
    resolution: 'Export at Ultra-HD 2x and 4K 3x for razor-sharp social feeds.',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{BRAND_CONFIG.appName} Pro</span>
        </div>

        <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">
          Unlock Pro Studio
        </h2>
        <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
          {subtitleByReason[triggerReason] ||
            'Upgrade to publish studio-grade carousels without limits.'}
        </p>

        <ul className="mt-5 space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          {PRO_BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm text-[#0F172A]">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <a
            href={BRAND_CONFIG.proUpgradeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <span>Upgrade to Pro</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-[#0F172A] transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
