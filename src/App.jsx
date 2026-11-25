import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, PenLine } from 'lucide-react';
import { BRAND_CONFIG } from './config/brand';
import { EXPORT_TIERS } from './config/exportTiers';
import { ASPECT_RATIOS } from './data/aspectRatios';
import { DEFAULT_PROJECT_STATE } from './data/defaultSlides';
import { FONT_PAIRS, FONT_SCALES, THEMES } from './data/themes';
import { exportAllZip, exportMultiPagePdf, exportSinglePng } from './utils/exporter';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import CanvasStage from './components/CanvasStage';
import SlideStrip from './components/SlideStrip';
import SlideRenderer from './components/SlideRenderer';
import ProModal from './components/ProModal';

function loadInitialProject() {
  try {
    const raw = localStorage.getItem(BRAND_CONFIG.storageKey);
    if (!raw) return DEFAULT_PROJECT_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      return DEFAULT_PROJECT_STATE;
    }
    return {
      ...DEFAULT_PROJECT_STATE,
      ...parsed,
      branding: {
        ...DEFAULT_PROJECT_STATE.branding,
        ...(parsed.branding || {}),
      },
    };
  } catch {
    return DEFAULT_PROJECT_STATE;
  }
}

export default function App() {
  const [project, setProject] = useState(loadInitialProject);
  const [history, setHistory] = useState([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState(EXPORT_TIERS[0].id);
  const [mobileView, setMobileView] = useState('preview'); // 'editor' | 'preview'
  const [isPro, setIsPro] = useState(() => {
    try {
      return localStorage.getItem(BRAND_CONFIG.proStorageKey) === 'true';
    } catch {
      return false;
    }
  });
  const [proModal, setProModal] = useState({ open: false, reason: 'watermark' });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Refs for offscreen 1:1 1080px export nodes
  const exportNodeRefs = useRef([]);

  // Persist project to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BRAND_CONFIG.storageKey, JSON.stringify(project));
    } catch {
      // Ignore storage quota errors
    }
  }, [project]);

  const commitProjectChange = (updater) => {
    setProject((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setHistory((h) => [...h.slice(-24), prev]);
      return next;
    });
  };

  const handleUndo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const previousState = prevHistory[prevHistory.length - 1];
      setProject(previousState);
      setActiveSlideIndex((idx) =>
        Math.min(idx, Math.max(previousState.slides.length - 1, 0))
      );
      return prevHistory.slice(0, -1);
    });
  };

  const handleReset = () => {
    commitProjectChange(DEFAULT_PROJECT_STATE);
    setActiveSlideIndex(0);
  };

  const safeIndex = Math.min(activeSlideIndex, Math.max(project.slides.length - 1, 0));
  const activeSlide = project.slides[safeIndex];

  const activeTheme = useMemo(
    () => THEMES.find((t) => t.id === project.themeId) || THEMES[0],
    [project.themeId]
  );

  const activeAspectRatio = useMemo(
    () =>
      ASPECT_RATIOS.find((r) => r.id === project.aspectRatioId) || ASPECT_RATIOS[0],
    [project.aspectRatioId]
  );

  const activeFontPair = useMemo(
    () => FONT_PAIRS.find((f) => f.id === project.fontPairId) || FONT_PAIRS[0],
    [project.fontPairId]
  );

  const activeFontScale = useMemo(
    () => FONT_SCALES.find((s) => s.id === project.fontScale) || FONT_SCALES[1],
    [project.fontScale]
  );

  const activeTier = useMemo(
    () => EXPORT_TIERS.find((t) => t.id === selectedTierId) || EXPORT_TIERS[0],
    [selectedTierId]
  );

  const handleUpdateSlide = (patch) => {
    commitProjectChange((prev) => ({
      ...prev,
      slides: prev.slides.map((s, idx) =>
        idx === safeIndex ? { ...s, ...patch } : s
      ),
    }));
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      layout: 'minimal-text',
      eyebrow: `0${project.slides.length} / INSIGHT`,
      headline: 'New Slide Headline',
      body: 'Add a concise takeaway here so your audience keeps swiping.',
      image: null,
      showSlideNumber: true,
      showSwipeArrow: true,
    };
    commitProjectChange((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
    setActiveSlideIndex(project.slides.length);
  };

  const handleDuplicateSlide = (index) => {
    const source = project.slides[index];
    if (!source) return;
    const copy = {
      ...source,
      id: `slide-${Date.now()}`,
    };
    commitProjectChange((prev) => {
      const nextSlides = [...prev.slides];
      nextSlides.splice(index + 1, 0, copy);
      return { ...prev, slides: nextSlides };
    });
    setActiveSlideIndex(index + 1);
  };

  const handleMoveSlide = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= project.slides.length) return;
    commitProjectChange((prev) => {
      const nextSlides = [...prev.slides];
      const [moved] = nextSlides.splice(fromIndex, 1);
      nextSlides.splice(toIndex, 0, moved);
      return { ...prev, slides: nextSlides };
    });
    setActiveSlideIndex(toIndex);
  };

  const handleDeleteSlide = (index) => {
    if (project.slides.length <= 1) return;
    commitProjectChange((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, idx) => idx !== index),
    }));
    setActiveSlideIndex((prev) => Math.max(0, Math.min(prev, project.slides.length - 2)));
  };

  const handleExportPng = async () => {
    const node = exportNodeRefs.current[safeIndex];
    if (!node) return;
    setIsExporting(true);
    setExportProgress(0);
    try {
      const num = String(safeIndex + 1).padStart(2, '0');
      await exportSinglePng(
        node,
        `poster-made-slide-${num}.png`,
        activeTier.pixelRatio
      );
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleExportZip = async () => {
    const nodes = project.slides.map((_, idx) => exportNodeRefs.current[idx]).filter(Boolean);
    if (nodes.length === 0) return;
    setIsExporting(true);
    setExportProgress(0);
    try {
      await exportAllZip(
        nodes,
        'poster-made-carousel',
        activeTier.pixelRatio,
        setExportProgress
      );
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleExportPdf = async () => {
    const nodes = project.slides.map((_, idx) => exportNodeRefs.current[idx]).filter(Boolean);
    if (nodes.length === 0) return;
    setIsExporting(true);
    setExportProgress(0);
    try {
      await exportMultiPagePdf(
        nodes,
        activeAspectRatio,
        'poster-made-carousel.pdf',
        activeTier.pixelRatio,
        setExportProgress
      );
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        aspectRatioId={project.aspectRatioId}
        onChangeAspectRatio={(id) =>
          commitProjectChange((p) => ({ ...p, aspectRatioId: id }))
        }
        canUndo={history.length > 0}
        onUndo={handleUndo}
        onReset={handleReset}
        selectedTierId={selectedTierId}
        onSelectTier={setSelectedTierId}
        isPro={isPro}
        onOpenProModal={(reason) => setProModal({ open: true, reason })}
        onExportPng={handleExportPng}
        onExportZip={handleExportZip}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        exportProgress={exportProgress}
      />

      {/* Mobile View Switcher (Editor / Preview) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-center">
        <div className="grid grid-cols-2 w-full max-w-xs bg-slate-100 p-1 rounded-xl border border-slate-200/70">
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              mobileView === 'editor'
                ? 'bg-white text-[#0F172A] border border-slate-200/80'
                : 'text-[#64748B]'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              mobileView === 'preview'
                ? 'bg-white text-[#0F172A] border border-slate-200/80'
                : 'text-[#64748B]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Main 3-Part Studio Workspace */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={`${
            mobileView === 'editor' ? 'flex' : 'hidden'
          } lg:flex h-full min-h-0`}
        >
          <LeftSidebar
            activeSlide={activeSlide}
            onUpdateSlide={handleUpdateSlide}
            themeId={project.themeId}
            onSelectTheme={(id) =>
              commitProjectChange((p) => ({ ...p, themeId: id }))
            }
            fontPairId={project.fontPairId}
            onSelectFontPair={(id) =>
              commitProjectChange((p) => ({ ...p, fontPairId: id }))
            }
            textAlign={project.textAlign}
            onChangeTextAlign={(align) =>
              commitProjectChange((p) => ({ ...p, textAlign: align }))
            }
            fontScale={project.fontScale}
            onChangeFontScale={(scale) =>
              commitProjectChange((p) => ({ ...p, fontScale: scale }))
            }
            bgPattern={project.bgPattern}
            onChangeBgPattern={(pattern) =>
              commitProjectChange((p) => ({ ...p, bgPattern: pattern }))
            }
            branding={project.branding}
            onUpdateBranding={(patch) =>
              commitProjectChange((p) => ({
                ...p,
                branding: { ...p.branding, ...patch },
              }))
            }
            isPro={isPro}
            onOpenProModal={(reason) => setProModal({ open: true, reason })}
          />
        </div>

        {/* Right Canvas Stage + Bottom Slide Strip */}
        <main
          className={`${
            mobileView === 'preview' ? 'flex' : 'hidden'
          } lg:flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden`}
        >
          <CanvasStage
            slide={activeSlide}
            slideIndex={safeIndex}
            totalSlides={project.slides.length}
            theme={activeTheme}
            aspectRatio={activeAspectRatio}
            fontPair={activeFontPair}
            textAlign={project.textAlign}
            fontScaleMultiplier={activeFontScale.multiplier}
            bgPattern={project.bgPattern}
            branding={project.branding}
            onPrevSlide={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
            onNextSlide={() =>
              setActiveSlideIndex((i) => Math.min(project.slides.length - 1, i + 1))
            }
          />

          <SlideStrip
            slides={project.slides}
            activeSlideIndex={safeIndex}
            onSelectSlide={setActiveSlideIndex}
            onAddSlide={handleAddSlide}
            onDuplicateSlide={handleDuplicateSlide}
            onMoveSlide={handleMoveSlide}
            onDeleteSlide={handleDeleteSlide}
            theme={activeTheme}
            aspectRatio={activeAspectRatio}
            fontPair={activeFontPair}
            textAlign={project.textAlign}
            fontScaleMultiplier={activeFontScale.multiplier}
            bgPattern={project.bgPattern}
            branding={project.branding}
          />
        </main>
      </div>

      {/* Offscreen 1:1 1080px Artboards for Crisp Exports */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          pointerEvents: 'none',
          opacity: 1,
        }}
      >
        {project.slides.map((slide, idx) => (
          <div
            key={slide.id}
            ref={(el) => {
              exportNodeRefs.current[idx] = el;
            }}
          >
            <SlideRenderer
              slide={slide}
              slideIndex={idx}
              totalSlides={project.slides.length}
              theme={activeTheme}
              aspectRatio={activeAspectRatio}
              fontPair={activeFontPair}
              textAlign={project.textAlign}
              fontScaleMultiplier={activeFontScale.multiplier}
              bgPattern={project.bgPattern}
              branding={project.branding}
            />
          </div>
        ))}
      </div>

      {/* Pro Upgrade Modal */}
      <ProModal
        isOpen={proModal.open}
        triggerReason={proModal.reason}
        onClose={() => setProModal((prev) => ({ ...prev, open: false }))}
        onUnlockPro={() => setIsPro(true)}
      />
    </div>
  );
}
