import React, { useState } from 'react';
import { Check, Sparkles, X, ArrowUpRight, KeyRound, QrCode } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';

const PRO_BENEFITS = [
  'Watermark-free exports',
  'Ultra-HD 2x & 4K 3x crisp resolution (zero Instagram/LinkedIn blur)',
  'Access to all Pro color themes',
];

/**
 * Clean upgrade modal with direct UPI QR payment, Instagram DM screenshot button,
 * and instant Access Code unlock.
 */
export default function ProModal({ isOpen, triggerReason, onClose, onUnlockPro }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [qrLoadError, setQrLoadError] = useState(false);

  if (!isOpen) return null;

  const subtitleByReason = {
    watermark: 'Remove the default Poster Made watermark from every slide.',
    theme: 'Unlock curated Pro color palettes crafted for high-retention posts.',
    resolution: 'Export at Ultra-HD 2x and 4K 3x for razor-sharp social feeds.',
  };

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    const normalized = code.trim().toUpperCase();
    const isValid = BRAND_CONFIG.validProCodes.some(
      (validCode) => validCode.toUpperCase() === normalized
    );

    if (!isValid) {
      setError('Invalid unlock code. Please check and try again.');
      return;
    }

    try {
      localStorage.setItem(BRAND_CONFIG.proStorageKey, 'true');
    } catch {
      // Ignore storage quota errors
    }

    setError('');
    setCode('');
    onUnlockPro();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 relative max-h-[92vh] overflow-y-auto studio-scroll"
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

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{BRAND_CONFIG.appName} Pro</span>
        </div>

        <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">
          Unlock Pro Studio
        </h2>
        <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
          {subtitleByReason[triggerReason] ||
            'Upgrade to publish studio-grade carousels without limits.'}
        </p>

        {/* Benefits List */}
        <ul className="mt-4 space-y-2 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
          {PRO_BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#0F172A]">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* UPI QR Payment Card */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-white flex flex-col items-center text-center">
          <div className="w-40 h-40 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden p-2">
            {!qrLoadError ? (
              <img
                src={BRAND_CONFIG.upiQrPath}
                alt="UPI QR Code"
                onError={() => setQrLoadError(true)}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#64748B] gap-1.5">
                <QrCode className="w-10 h-10 opacity-60" />
                <span className="text-[11px] font-medium">UPI QR ({BRAND_CONFIG.upiQrPath})</span>
              </div>
            )}
          </div>
          <p className="mt-3 text-sm font-semibold text-[#0F172A]">
            Scan &amp; Pay {BRAND_CONFIG.proPrice} via UPI for Lifetime Pro
          </p>
          <a
            href={BRAND_CONFIG.instagramDmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <span>Paid? Send Screenshot on Instagram</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full h-px bg-slate-200" />
          <span className="px-3 bg-white text-xs font-medium text-[#64748B] whitespace-nowrap absolute">
            Already have an unlock code?
          </span>
        </div>

        {/* Access Code Unlock Form */}
        <form onSubmit={handleUnlockSubmit} className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter unlock code"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-zinc-800 text-white text-sm font-medium transition-colors cursor-pointer shrink-0"
            >
              Unlock Pro
            </button>
          </div>
          {error && (
            <p className="text-xs font-medium text-rose-600">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
