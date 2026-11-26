import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
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

  const [cveeezPhase, setCveeezPhase] = useState<'chaos' | 'ask' | 'order' | 'drop'>('chaos');
  const [dropStepIdx, setDropStepIdx] = useState(0);
  const [xfuseAnimated, setXfuseAnimated] = useState(false);

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
      setCveeezPhase('drop');
      setDropStepIdx(4);
      return;
    }

    let timers: number[] = [];
    const runCycle = () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];

      setCveeezPhase('chaos');
      setDropStepIdx(0);

      timers.push(window.setTimeout(() => setCveeezPhase('ask'), 450));
      timers.push(window.setTimeout(() => setCveeezPhase('order'), 1050));
      timers.push(
        window.setTimeout(() => {
          setCveeezPhase('drop');
          [1, 2, 3, 4].forEach((step, idx) => {
            timers.push(
              window.setTimeout(() => {
                setDropStepIdx(step);
              }, idx * 280),
            );
          });
        }, 1650),
      );
      timers.push(window.setTimeout(runCycle, 6500));
    };

    runCycle();

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [station?.id]);

  useEffect(() => {
    if (station?.id === 'xfuse-sell') {
      setXfuseAnimated(false);
      const t = window.setTimeout(() => setXfuseAnimated(true), 180);
      return () => window.clearTimeout(t);
    }
  }, [station?.id]);

  if (!station) return null;

  const displayKeyAchievements = station.keyAchievements?.[lang];
  const isOrdered = cveeezPhase === 'order' || cveeezPhase === 'drop';
  const dropRatios = [1, 0.72, 0.48, 0.28, 0.14];
  const currentRatio = cveeezPhase === 'drop' ? dropRatios[dropStepIdx] : 1;
  const currentDashOffset = 238.76 * (1 - currentRatio);
  const currentStepLabel = copy.cveeezStage.dropSteps[lang][dropStepIdx];
  const centerGaugeText =
    dropStepIdx === 0
      ? isRtl ? 'شهر' : '1 mo'
      : dropStepIdx === 1
        ? isRtl ? '١٤ يوم' : '14 d'
        : dropStepIdx === 2
          ? isRtl ? '٣ أيام' : '3 d'
          : dropStepIdx === 3
            ? isRtl ? '١٢ س' : '12 h'
            : isRtl ? '٤ س' : '4 h';

  return (
    <div
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${station.company} — ${station.role}`}
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
        dir={isRtl ? 'rtl' : 'ltr'}
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
        className={`paper-grain-surface relative z-10 w-full max-w-3xl max-h-[88svh] overflow-y-auto overscroll-contain rounded-t-3xl md:rounded-[28px] border border-[var(--hairline)] bg-[var(--surface-card)] p-5 sm:p-6.5 text-[var(--ink-primary)] shadow-[var(--paper-shadow-lg)] transition-transform duration-300 ease-[cubic-bezier(0.22,0.8,0.3,1)] ${
          isRtl ? 'text-right' : 'text-left'
        }`}
        style={{
          transform: touchDragY > 0
            ? `translate3d(0, ${touchDragY}px, 0)`
            : `rotate(${isRtl ? '-0.6deg' : '0.6deg'})`,
        }}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--ink-muted)]/30 md:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--hairline)] pb-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 shadow-sm overflow-hidden ${
                station.darkLogoBg ? 'bg-[#14161A] p-0' : 'bg-white p-1.5'
              }`}
              style={{ borderColor: station.color }}
            >
              {station.logoSrc ? (
                <img
                  src={station.logoSrc}
                  alt={station.company}
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
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-[var(--ink-muted)]">
                <span dir="ltr" style={{ color: station.color }} className="font-bold tracking-wider uppercase">
                  {station.company}
                </span>
                {station.dates && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span dir="ltr">{station.dates}</span>
                  </>
                )}
                {station.companySubtitle && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{station.companySubtitle[lang]}</span>
                  </>
                )}
              </div>
              <h3
                dir="ltr"
                className={`mt-1 font-display text-base sm:text-lg font-semibold text-[var(--ink-primary)] ${
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
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-cream)] text-[var(--ink-primary)] hover:border-[#A68BC8] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* CVeeeZ Auto-Playing Chaos-to-Order Stage */}
        {station.id === 'cveeez' && (
          <div className="mt-4 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-cream)] p-3.5 overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <p className="text-xs sm:text-[13px] font-semibold text-[var(--ink-primary)]">
                {cveeezPhase === 'chaos' && copy.cveeezStage.captionChaos[lang]}
                {cveeezPhase === 'ask' && copy.cveeezStage.captionAsk[lang]}
                {(cveeezPhase === 'order' || cveeezPhase === 'drop') &&
                  copy.cveeezStage.captionOrder[lang]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center" dir="ltr">
              <div className="relative sm:col-span-8 h-42 rounded-xl border border-[var(--hairline)] bg-[var(--surface-card)]/75 overflow-hidden p-3">
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
                  const targetLeft = 5 + col * 31;
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
                        className={`inline-block self-start rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          isOrdered
                            ? 'text-[#3F6345] dark:text-[#BCE0C2]'
                            : 'text-[#A14635] dark:text-[#FFB3A7]'
                        }`}
                        style={{
                          backgroundColor: isOrdered ? 'rgba(157,181,160,0.28)' : 'rgba(231,144,122,0.22)',
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

              <div className="sm:col-span-4 flex flex-col items-center justify-center rounded-xl border border-[var(--hairline)] bg-[var(--surface-card)]/75 p-3 h-42">
                <svg viewBox="0 0 100 100" className="h-18 w-18">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(166,139,200,0.2)" strokeWidth="7" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke={cveeezPhase === 'drop' && dropStepIdx >= 2 ? '#9DB5A0' : '#E7907A'}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="238.76"
                    strokeDashoffset={currentDashOffset}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 450ms cubic-bezier(0.22,0.8,0.3,1), stroke 450ms ease' }}
                  />
                  <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    className="fill-[var(--ink-primary)] font-display text-base font-bold"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {centerGaugeText}
                  </text>
                </svg>
                <span className="mt-1 text-xs font-semibold text-[var(--ink-secondary)]">
                  {currentStepLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Role Overview, Key Responsibilities, Key Achievements (when provided), Skills Demonstrated */}
        <div className="mt-4 space-y-3.5">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: station.color }}>
              {copy.blocks.roleOverview[lang]}
            </h4>
            <p className="mt-1 text-xs sm:text-[13.5px] leading-relaxed text-[var(--ink-secondary)]">
              {station.roleOverview[lang]}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: station.color }}>
              {copy.blocks.responsibilities[lang]}
            </h4>
            <ul className="mt-1.5 space-y-1 text-xs sm:text-[13px] leading-relaxed text-[var(--ink-secondary)]">
              {station.responsibilities[lang].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: station.color }}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {displayKeyAchievements && displayKeyAchievements.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: station.color }}>
                {copy.blocks.keyAchievements[lang]}
              </h4>
              <ul className="mt-1.5 space-y-1 text-xs sm:text-[13px] leading-relaxed text-[var(--ink-primary)] font-medium">
                {displayKeyAchievements.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: station.color }}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FERTICAL Metric Snapshot Trio */}
          {station.id === 'fertical' && (
            <div className="pt-1 grid grid-cols-3 gap-2.5">
              {[
                { title: '1,000+', sub: isRtl ? 'وحدة في 3 شهور' : 'Units in 3 months', tint: '#E4D8F0' },
                { title: '+80%', sub: isRtl ? 'نمو المبيعات' : 'Sales growth', tint: '#DCE7DD' },
                { title: '€4,000', sub: isRtl ? 'تمويل ستارت أب' : 'Startup funding', tint: '#F6E6CB' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--hairline)] p-2.5 text-center text-[#2D2140]"
                  style={{ backgroundColor: item.tint }}
                >
                  <div dir="ltr" className="font-display text-base sm:text-lg font-bold">{item.title}</div>
                  <div className="mt-0.5 text-[10.5px] font-medium opacity-80">{item.sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* X-FUSE Sales Target Growth Rings (Sales & Marketing Executive station) */}
          {station.id === 'xfuse-sell' && (
            <div className="pt-1 grid grid-cols-2 gap-3">
              {[
                { label: isRtl ? 'الشهر الأول — 70%' : 'Month 1 — 70%', ringPct: 70, opacity: 0.9 },
                { label: isRtl ? 'الشهر الثاني — 120%' : 'Month 2 — 120%', ringPct: 100, opacity: 1 },
              ].map((m, idx) => (
                <div
                  key={m.label}
                  className="flex flex-col items-center rounded-2xl border border-[var(--hairline)] bg-[var(--surface-cream)] p-3 text-center"
                  style={{
                    opacity: m.opacity,
                    transform: xfuseAnimated && idx === 1 ? 'scale(1.02)' : 'scale(1)',
                    transition: 'transform 700ms cubic-bezier(0.34,1.3,0.5,1)',
                  }}
                >
                  <svg viewBox="0 0 64 64" className="h-12 w-12">
                    <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(157,181,160,0.22)" strokeWidth="5.5" />
                    <circle
                      cx="32"
                      cy="32"
                      r="24"
                      fill="none"
                      stroke="#9DB5A0"
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
                  <span className="mt-1.5 text-xs font-semibold text-[var(--ink-primary)]">{m.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-[var(--hairline)]">
            <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: station.color }}>
              {copy.blocks.skillsDemonstrated[lang]}
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {station.skillsDemonstrated[lang].map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl border border-[var(--hairline)] bg-[var(--surface-cream)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink-primary)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

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
