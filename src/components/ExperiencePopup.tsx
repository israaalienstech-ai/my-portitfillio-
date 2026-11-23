import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import {
  ExperienceStationData,
  Lang,
  PORTFOLIO_COPY,
} from '../data/rebuildContent';
import { FerticalLogoArt, XfuseLogoArt } from './StorybookVisuals';
import { soundSystem } from '../utils/soundSystem';

interface ExperiencePopupProps {
  station: ExperienceStationData | null;
  lang: Lang;
  onClose: () => void;
}

const CVEEEZ_CARDS = [
  { x: 10, y: 12, r: -11 },
  { x: 42, y: 4, r: 8 },
  { x: 69, y: 18, r: -7 },
  { x: 16, y: 54, r: 12 },
  { x: 47, y: 48, r: -9 },
  { x: 66, y: 56, r: 7 },
];

export const ExperiencePopup: React.FC<ExperiencePopupProps> = ({
  station,
  lang,
  onClose,
}) => {
  const isRtl = lang === 'ar';
  const copy = PORTFOLIO_COPY.experiences;

  const noteRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [touchDragY, setTouchDragY] = useState(0);

  const [cveeezPhase, setCveeezPhase] = useState<'chaos' | 'ask' | 'order' | 'clock'>('chaos');
  const [cveeezRunKey, setCveeezRunKey] = useState(0);
  const [clockHours, setClockHours] = useState(0);

  const [xfuseAnimated, setXfuseAnimated] = useState(false);
  const [careercvMerged, setCareercvMerged] = useState(false);

  useEffect(() => {
    if (!station) return;
    soundSystem.popupRustle();
  }, [station?.id]);

  useEffect(() => {
    if (!station) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [station, onClose]);

  useEffect(() => {
    if (!station) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || isCoarse) return;

    const handleMove = (e: PointerEvent) => {
      if (!noteRef.current) return;
      const nx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const ny = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      noteRef.current.style.transform = `translate3d(${(nx * 12).toFixed(1)}px, ${(ny * 10).toFixed(1)}px, 0) rotate(${isRtl ? '-0.6deg' : '0.6deg'})`;
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [station, isRtl]);

  useEffect(() => {
    if (station?.id !== 'cveeez') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setCveeezPhase('clock');
      setClockHours(4);
      return;
    }

    setCveeezPhase('chaos');
    setClockHours(0);

    const t1 = window.setTimeout(() => setCveeezPhase('ask'), 1900);
    const t2 = window.setTimeout(() => setCveeezPhase('order'), 3400);
    const t3 = window.setTimeout(() => {
      setCveeezPhase('clock');
      let step = 0;
      const counter = window.setInterval(() => {
        step += 1;
        setClockHours(Math.min(4, step));
        if (step >= 4) window.clearInterval(counter);
      }, 220);
    }, 5100);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [station?.id, cveeezRunKey]);

  useEffect(() => {
    if (station?.id === 'xfuse') {
      setXfuseAnimated(false);
      const t = window.setTimeout(() => setXfuseAnimated(true), 180);
      return () => window.clearTimeout(t);
    }
    if (station?.id === 'careercv') {
      setCareercvMerged(false);
      const t = window.setTimeout(() => setCareercvMerged(true), 220);
      return () => window.clearTimeout(t);
    }
  }, [station?.id]);

  if (!station) return null;

  const isOrdered = cveeezPhase === 'order' || cveeezPhase === 'clock';

  return (
    <div
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${station.company[lang]} — ${station.role}`}
      onClick={onClose}
    >
      <div
        className="pointer-events-auto absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(11, 8, 20, 0.24) 0%, rgba(11, 8, 20, 0.44) 100%)',
        }}
      />

      <div
        ref={noteRef}
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartYRef.current = e.touches[0].clientY;
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
          if (touchStartYRef.current === null) return;
          setTouchDragY(Math.max(0, e.touches[0].clientY - touchStartYRef.current));
        }}
        onTouchEnd={() => {
          setTouchDragY(0);
          if (touchDragY > 90) onClose();
          touchStartYRef.current = null;
        }}
        className="paper-grain-surface relative z-10 w-full max-w-3xl max-h-[88svh] overflow-y-auto overscroll-contain rounded-t-3xl md:rounded-[28px] border border-[var(--hairline)] bg-[var(--surface-card)] p-6 sm:p-8 text-[var(--ink-primary)] shadow-[var(--paper-shadow-lg)] transition-transform duration-300 ease-[cubic-bezier(0.22,0.8,0.3,1)]"
        style={{
          transform: touchDragY > 0
            ? `translate3d(0, ${touchDragY}px, 0)`
            : `rotate(${isRtl ? '-0.6deg' : '0.6deg'})`,
        }}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--ink-muted)]/30 md:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--hairline)] pb-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 shadow-sm overflow-hidden ${
                station.darkLogoBg ? 'bg-[#14161A] p-0' : 'bg-white p-1.5'
              }`}
              style={{ borderColor: station.color }}
            >
              {station.logoSrc ? (
                <img
                  src={station.logoSrc}
                  alt={station.company[lang]}
                  className={`h-full w-full rounded-full ${
                    station.darkLogoBg ? 'object-cover' : 'object-contain'
                  }`}
                />
              ) : station.id === 'fertical' ? (
                <FerticalLogoArt className="h-full w-full" />
              ) : (
                <XfuseLogoArt className="h-full w-full" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[var(--ink-muted)]">
                <span style={{ color: station.color }} className="font-bold tracking-wider uppercase">
                  {station.company[lang]}
                </span>
                <span aria-hidden="true">·</span>
                <span>{station.dates[lang]}</span>
                {station.companySubtitle && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{station.companySubtitle[lang]}</span>
                  </>
                )}
              </div>
              <h3
                dir="ltr"
                className={`mt-1 font-display text-2xl sm:text-3xl font-semibold text-[var(--ink-primary)] ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
              >
                {station.role}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={copy.closeLabel[lang]}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-cream)] text-[var(--ink-primary)] hover:border-[#A68BC8] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Highlight headline + chips */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display italic text-xl sm:text-2xl text-[var(--ink-primary)]">
            “{station.headline[lang]}”
          </p>
          {station.extraChips && station.extraChips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {station.extraChips.map((chip) => (
                <span
                  key={chip.en}
                  className="rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#2D2140]"
                  style={{ backgroundColor: station.softColor }}
                >
                  {chip[lang]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CVeeeZ Embedded 7s Chaos-to-Order Stage */}
        {station.id === 'cveeez' && (
          <div className="mt-5 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-cream)] p-4 overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-sm sm:text-base font-semibold text-[var(--ink-primary)]">
                {cveeezPhase === 'chaos' && copy.cveeezStage.captionChaos[lang]}
                {cveeezPhase === 'ask' && copy.cveeezStage.captionAsk[lang]}
                {(cveeezPhase === 'order' || cveeezPhase === 'clock') &&
                  copy.cveeezStage.captionOrder[lang]}
              </p>
              <button
                type="button"
                onClick={() => setCveeezRunKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hairline)] bg-[var(--surface-card)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{copy.cveeezStage.replay[lang]}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="relative sm:col-span-8 h-48 rounded-xl border border-[var(--hairline)] bg-[var(--surface-card)]/75 overflow-hidden p-3">
                <svg
                  viewBox="0 0 360 160"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M 15 125 C 85 15, 30 140, 145 45 C 240 -5, 165 150, 275 40 C 315 5, 325 120, 345 75"
                    fill="none"
                    stroke="#E7907A"
                    strokeOpacity={isOrdered ? 0 : 0.45}
                    strokeWidth="2.5"
                    strokeDasharray="5 7"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-opacity 600ms ease' }}
                  />
                  <path
                    d="M 25 80 C 115 48, 245 112, 335 80"
                    fill="none"
                    stroke="#9DB5A0"
                    strokeOpacity={isOrdered ? 0.85 : 0}
                    strokeWidth="2.8"
                    strokeDasharray="6 7"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-opacity 700ms ease' }}
                  />
                </svg>

                {CVEEEZ_CARDS.map((card, i) => {
                  const col = i % 3;
                  const row = Math.floor(i / 3);
                  const targetLeft = isRtl ? 68 - col * 31 : 5 + col * 31;
                  const targetTop = 10 + row * 45;

                  return (
                    <div
                      key={i}
                      className={`absolute w-[28%] h-[36%] rounded-lg border bg-[var(--surface-card)] p-2 shadow-xs flex flex-col justify-between transition-all ${
                        cveeezPhase === 'chaos' ? 'cveeez-jitter' : ''
                      }`}
                      style={{
                        left: `${isOrdered ? targetLeft : card.x}%`,
                        top: `${isOrdered ? targetTop : card.y}%`,
                        transform: `rotate(${isOrdered ? 0 : card.r}deg)`,
                        borderColor: isOrdered ? '#9DB5A0' : 'rgba(231,144,122,0.45)',
                        transitionDuration: '700ms',
                        transitionTimingFunction: 'cubic-bezier(0.34,1.3,0.5,1)',
                        transitionDelay: `${i * 90}ms`,
                      }}
                    >
                      <div className="h-1.5 w-3/4 rounded-full bg-[var(--ink-muted)]/25" />
                      <span
                        className="inline-block self-start rounded px-1.5 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: isOrdered ? 'rgba(157,181,160,0.28)' : 'rgba(231,144,122,0.2)',
                          color: isOrdered ? '#3F6345' : '#A14635',
                        }}
                      >
                        {isOrdered
                          ? copy.cveeezStage.stampActive[lang]
                          : copy.cveeezStage.stampsChaos[i][lang]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="sm:col-span-4 flex flex-col items-center justify-center rounded-xl border border-[var(--hairline)] bg-[var(--surface-card)]/75 p-3 h-48">
                <svg viewBox="0 0 100 100" className="h-24 w-24">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(166,139,200,0.22)" strokeWidth="7" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#9DB5A0"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="238.76"
                    strokeDashoffset={cveeezPhase === 'clock' ? 238.76 - 59.7 : 238.76}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 1100ms cubic-bezier(0.22,0.8,0.3,1)' }}
                  />
                  <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    className="fill-[var(--ink-primary)] font-display text-xl font-bold"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {clockHours}
                  </text>
                </svg>
                <span className="mt-1 text-sm font-semibold text-[var(--ink-secondary)]">
                  {clockHours} {copy.cveeezStage.clockSuffix[lang]}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Challenge, What I did, Result (omitted for Career CV) */}
        <div className="mt-6 space-y-5">
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: station.color }}>
              {copy.blocks.challenge[lang]}
            </h4>
            <p className="mt-1.5 text-base sm:text-lg leading-relaxed text-[var(--ink-secondary)]">
              {station.challenge[lang]}
            </p>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: station.color }}>
              {copy.blocks.whatIDid[lang]}
            </h4>
            <p className="mt-1.5 text-base sm:text-lg leading-relaxed text-[var(--ink-secondary)]">
              {station.whatIDid[lang]}
            </p>
          </div>

          {station.result && (
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: station.color }}>
                {copy.blocks.result[lang]}
              </h4>
              <p className="mt-1.5 text-base sm:text-lg leading-relaxed text-[var(--ink-primary)] font-medium">
                {station.result[lang]}
              </p>
            </div>
          )}
        </div>

        {/* FERTICAL Metric Snapshot Trio */}
        {station.id === 'fertical' && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { title: '1,000+', sub: lang === 'ar' ? 'منتج في 3 شهور' : 'Units in 3 months', tint: '#E4D8F0' },
              { title: '+80%', sub: lang === 'ar' ? 'نمو المبيعات' : 'Sales growth', tint: '#DCE7DD' },
              { title: '€4,000', sub: lang === 'ar' ? 'تمويل للشركة' : 'Raised for startup', tint: '#F6E6CB' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[var(--hairline)] p-4 text-center text-[#2D2140]"
                style={{ backgroundColor: item.tint }}
              >
                <div className="font-display text-xl sm:text-2xl font-bold">{item.title}</div>
                <div className="mt-1 text-xs font-medium opacity-80">{item.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* X-FUSE Growth Stages & ClickUp Mini-Board */}
        {station.id === 'xfuse' && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: lang === 'ar' ? 'الشهر 1: فشل' : 'Month 1: Miss', ringPct: 12, opacity: 0.7 },
                { label: lang === 'ar' ? 'الشهر 2: 70%' : 'Month 2 — 70%', ringPct: 70, opacity: 0.92 },
                { label: lang === 'ar' ? 'الشهر 3: 120%' : 'Month 3 — 120%', ringPct: 100, opacity: 1 },
              ].map((m, idx) => (
                <div
                  key={m.label}
                  className="flex flex-col items-center rounded-2xl border border-[var(--hairline)] bg-[var(--surface-cream)] p-4 text-center"
                  style={{
                    opacity: m.opacity,
                    transform: xfuseAnimated && idx === 2 ? 'scale(1.03)' : 'scale(1)',
                    transition: 'transform 700ms cubic-bezier(0.34,1.3,0.5,1)',
                  }}
                >
                  <svg viewBox="0 0 64 64" className="h-14 w-14">
                    <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(157,181,160,0.22)" strokeWidth="5.5" />
                    <circle
                      cx="32"
                      cy="32"
                      r="24"
                      fill="none"
                      stroke={idx === 0 ? '#E7907A' : '#9DB5A0'}
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      strokeDasharray="150.8"
                      strokeDashoffset={
                        xfuseAnimated ? 150.8 - (150.8 * m.ringPct) / 100 : 150.8
                      }
                      transform="rotate(-90 32 32)"
                      style={{ transition: 'stroke-dashoffset 950ms cubic-bezier(0.22,0.8,0.3,1)' }}
                    />
                  </svg>
                  <span className="mt-2 text-xs sm:text-sm font-semibold text-[var(--ink-primary)]">{m.label}</span>
                </div>
              ))}
            </div>

            {/* Clean ClickUp Delivery Board Snapshot */}
            <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-cream)] p-4">
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] sm:text-xs font-semibold text-[#2D2140]">
                {[
                  { name: lang === 'ar' ? 'قيد المراجعة' : 'In Review', bg: '#E4D8F0' },
                  { name: lang === 'ar' ? 'تعديلات' : 'In Edits', bg: '#F7DCD4' },
                  { name: lang === 'ar' ? 'خلص' : 'Done', bg: '#DCE7DD' },
                  { name: lang === 'ar' ? 'جاهز للنشر' : 'Ready', bg: '#F6E6CB' },
                ].map((col) => (
                  <div key={col.name} className="rounded-xl p-2.5 shadow-xs" style={{ backgroundColor: col.bg }}>
                    {col.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Career CV Smooth Overlapping Circles */}
        {station.id === 'careercv' && (
          <div className="mt-6 flex items-center justify-center rounded-2xl border border-[var(--hairline)] bg-[var(--surface-cream)] py-6 px-4 overflow-hidden">
            <div className="flex items-center justify-center">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full border border-[#A68BC8]/45 bg-[#E4D8F0]/80 text-xs font-bold text-[#2D2140] transition-transform duration-1000 ease-[cubic-bezier(0.22,0.8,0.3,1)]"
                style={{
                  transform: careercvMerged
                    ? `translate3d(${isRtl ? '-16px' : '16px'}, 0, 0)`
                    : `translate3d(${isRtl ? '34px' : '-34px'}, 0, 0)`,
                }}
              >
                {lang === 'ar' ? 'الاحتياج' : 'Need'}
              </div>
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full border border-[#E3B26E]/55 bg-[#F6E6CB]/85 text-xs font-bold text-[#2D2140] transition-transform duration-1000 ease-[cubic-bezier(0.22,0.8,0.3,1)] mix-blend-multiply dark:mix-blend-screen"
                style={{
                  transform: careercvMerged
                    ? `translate3d(${isRtl ? '16px' : '-16px'}, 0, 0)`
                    : `translate3d(${isRtl ? '-34px' : '34px'}, 0, 0)`,
                }}
              >
                {lang === 'ar' ? 'الخدمة' : 'Service'}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes stuckJitter {
            0%, 100% { translate: 0 0; }
            50% { translate: 1.5px -1.5px; }
          }
          .cveeez-jitter {
            animation: stuckJitter 1.4s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};
