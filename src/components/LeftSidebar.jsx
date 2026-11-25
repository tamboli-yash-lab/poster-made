import React, { useState, useRef } from 'react';
import {
  AlignCenter,
  AlignLeft,
  ImagePlus,
  Lock,
  Palette,
  Sliders,
  Trash2,
  Type,
  UserCheck,
} from 'lucide-react';
import { LAYOUTS } from '../data/layouts';
import { BG_PATTERNS, FONT_PAIRS, FONT_SCALES, THEMES } from '../data/themes';
import { BRAND_CONFIG } from '../config/brand';

const TABS = [
  { id: 'content', label: 'Content', icon: Type },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'branding', label: 'Branding', icon: UserCheck },
];

/**
 * Left control sidebar with Content, Design, and Branding tabs.
 */
export default function LeftSidebar({
  activeSlide,
  onUpdateSlide,
  themeId,
  onSelectTheme,
  fontPairId,
  onSelectFontPair,
  textAlign,
  onChangeTextAlign,
  fontScale,
  onChangeFontScale,
  bgPattern,
  onChangeBgPattern,
  branding,
  onUpdateBranding,
  isPro,
  onOpenProModal,
}) {
  const [activeTab, setActiveTab] = useState('content');
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const slideImageInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const handleSlideImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const objectUrl = URL.createObjectURL(file);
    onUpdateSlide({ image: objectUrl });
  };

  const handleAvatarFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const objectUrl = URL.createObjectURL(file);
    onUpdateBranding({ avatar: objectUrl });
  };

  const handleThemeClick = (theme) => {
    if (theme.isPro && !isPro) {
      onOpenProModal('theme');
      return;
    }
    onSelectTheme(theme.id);
  };

  const handleWatermarkToggle = () => {
    if (branding.showWatermark && !isPro) {
      onOpenProModal('watermark');
      return;
    }
    onUpdateBranding({ showWatermark: !branding.showWatermark });
  };

  return (
    <aside className="w-full lg:w-[360px] xl:w-[380px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Tab Switcher */}
      <div className="p-3 border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0F172A] border border-slate-200/80'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Tab Body */}
      <div className="flex-1 overflow-y-auto studio-scroll p-4 space-y-6">
        {activeTab === 'content' && activeSlide && (
          <>
            {/* Layout Switcher */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-2">
                Slide Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LAYOUTS.map((layout) => {
                  const selected = activeSlide.layout === layout.id;
                  return (
                    <button
                      key={layout.id}
                      type="button"
                      onClick={() => onUpdateSlide({ layout: layout.id })}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selected
                          ? 'border-[#18181B] bg-zinc-50 ring-1 ring-[#18181B]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#0F172A]">
                        {layout.name}
                      </div>
                      <div className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">
                        {layout.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Eyebrow / Tag */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Eyebrow / Tag
              </label>
              <input
                type="text"
                value={activeSlide.eyebrow}
                onChange={(e) => onUpdateSlide({ eyebrow: e.target.value })}
                placeholder="e.g. 01 / TIP"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Headline */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Headline
              </label>
              <textarea
                rows={3}
                value={activeSlide.headline}
                onChange={(e) => onUpdateSlide({ headline: e.target.value })}
                placeholder="Write a crisp, punchy headline..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Body Text */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Body Copy
              </label>
              <textarea
                rows={4}
                value={activeSlide.body}
                onChange={(e) => onUpdateSlide({ body: e.target.value })}
                placeholder="Add supporting details..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Optional Slide Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Slide Image (Optional)
              </label>
              <input
                ref={slideImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleSlideImageFile(e.target.files?.[0])}
              />

              {activeSlide.image ? (
                <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <img
                    src={activeSlide.image}
                    alt="Slide upload preview"
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateSlide({ image: null })}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 hover:bg-white text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                    handleSlideImageFile(e.dataTransfer.files?.[0]);
                  }}
                  onClick={() => slideImageInputRef.current?.click()}
                  className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    isDraggingImage
                      ? 'border-indigo-500 bg-indigo-50/40'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
                  }`}
                >
                  <ImagePlus className="w-5 h-5 mx-auto text-[#64748B] mb-1.5" />
                  <p className="text-xs font-medium text-[#0F172A]">
                    Drop image or click to upload
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    PNG, JPG, WebP
                  </p>
                </div>
              )}
            </div>

            {/* Slide Indicators */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#0F172A]">
                  Show Slide Number
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={activeSlide.showSlideNumber}
                  onClick={() =>
                    onUpdateSlide({ showSlideNumber: !activeSlide.showSlideNumber })
                  }
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    activeSlide.showSlideNumber ? 'bg-[#18181B]' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      activeSlide.showSlideNumber ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#0F172A]">
                  Show Swipe Arrow
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={activeSlide.showSwipeArrow}
                  onClick={() =>
                    onUpdateSlide({ showSwipeArrow: !activeSlide.showSwipeArrow })
                  }
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    activeSlide.showSwipeArrow ? 'bg-[#18181B]' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      activeSlide.showSwipeArrow ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'design' && (
          <>
            {/* Curated Themes */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {THEMES.map((theme) => {
                  const selected = theme.id === themeId;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleThemeClick(theme)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                        selected
                          ? 'border-[#18181B] ring-1 ring-[#18181B] bg-slate-50/70'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center -space-x-1">
                          <span
                            className="w-5 h-5 rounded-full border border-slate-200"
                            style={{ backgroundColor: theme.bg }}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-slate-200"
                            style={{ backgroundColor: theme.accent }}
                          />
                        </div>
                        {theme.isPro && (
                          <span
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              isPro
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {!isPro && <Lock className="w-2.5 h-2.5" />}
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-medium text-[#0F172A]">
                        {theme.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Pair Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-2">
                Typography Pair
              </label>
              <div className="space-y-2">
                {FONT_PAIRS.map((pair) => {
                  const selected = pair.id === fontPairId;
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      onClick={() => onSelectFontPair(pair.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selected
                          ? 'border-[#18181B] ring-1 ring-[#18181B] bg-zinc-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div
                          className="text-sm font-semibold text-[#0F172A]"
                          style={{ fontFamily: pair.headingFont }}
                        >
                          {pair.name}
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {pair.description}
                        </div>
                      </div>
                      <span
                        className="text-lg text-[#64748B]"
                        style={{ fontFamily: pair.headingFont }}
                      >
                        Aa
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alignment & Font Scale */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Alignment
                </label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => onChangeTextAlign('left')}
                    className={`py-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                      textAlign === 'left'
                        ? 'bg-white text-[#0F172A] border border-slate-200/80'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeTextAlign('center')}
                    className={`py-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                      textAlign === 'center'
                        ? 'bg-white text-[#0F172A] border border-slate-200/80'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-[#64748B]" />
                  <span>Text Scale</span>
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/70">
                  {FONT_SCALES.map((scale) => (
                    <button
                      key={scale.id}
                      type="button"
                      onClick={() => onChangeFontScale(scale.id)}
                      className={`py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-all ${
                        fontScale === scale.id
                          ? 'bg-white text-[#0F172A] border border-slate-200/80'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {scale.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Background Pattern */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Background Pattern
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {BG_PATTERNS.map((pattern) => {
                  const selected = bgPattern === pattern.id;
                  return (
                    <button
                      key={pattern.id}
                      type="button"
                      onClick={() => onChangeBgPattern(pattern.id)}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                        selected
                          ? 'border-[#18181B] bg-zinc-50 text-[#0F172A] ring-1 ring-[#18181B]'
                          : 'border-slate-200 bg-white text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {pattern.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'branding' && (
          <>
            {/* Author Identity */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                value={branding.authorName}
                onChange={(e) => onUpdateBranding({ authorName: e.target.value })}
                placeholder="Your Name"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Social Handle
              </label>
              <input
                type="text"
                value={branding.handle}
                onChange={(e) => onUpdateBranding({ handle: e.target.value })}
                placeholder="@yourhandle"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Avatar Upload */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-2">
                Profile Avatar
              </label>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarFile(e.target.files?.[0])}
              />
              <div className="flex items-center gap-3">
                {branding.avatar ? (
                  <img
                    src={branding.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-semibold text-[#64748B]">
                    {(branding.authorName || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-[#0F172A] transition-colors cursor-pointer"
                  >
                    {branding.avatar ? 'Change' : 'Upload Avatar'}
                  </button>
                  {branding.avatar && (
                    <button
                      type="button"
                      onClick={() => onUpdateBranding({ avatar: null })}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                      title="Remove avatar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Watermark Toggle */}
            <div className="pt-4 border-t border-slate-200">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#0F172A]">
                        Watermark
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          isPro
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {!isPro && <Lock className="w-2.5 h-2.5" />}
                        {isPro ? 'PRO UNLOCKED' : 'PRO to remove'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      {BRAND_CONFIG.defaultWatermark}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={branding.showWatermark}
                    onClick={handleWatermarkToggle}
                    className={`w-10 h-5 rounded-full transition-colors p-0.5 shrink-0 cursor-pointer ${
                      branding.showWatermark ? 'bg-[#18181B]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        branding.showWatermark ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
