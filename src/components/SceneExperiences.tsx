import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  EXPERIENCE_STATIONS,
  ExperienceStationData,
  Lang,
  PORTFOLIO_COPY,
} from '../data/rebuildContent';
import {
  FerticalLogoArt,
  PaperPlaneArt,
  PuzzlePieceArt,
  PuzzlePocketArt,
  XfuseLogoArt,
} from './StorybookVisuals';
import { ExperiencePopup } from './ExperiencePopup';
import { soundSystem } from '../utils/soundSystem';

gsap.registerPlugin(ScrollTrigger);

interface SceneExperiencesProps {
  lang: Lang;
  showPocket: boolean;
  onCollectedCountChange: (count: number) => void;
  onPopupOpenChange?: (isOpen: boolean) => void;
  onDebugUpdate: (progress: number, beat: string) => void;
}

interface FlyingBatch {
  id: number;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const WORLD_HEIGHT = 2400;
const STATION_WORLD_Y = [400, 940, 1480, 2020];

export const SceneExperiences: React.FC<SceneExperiencesProps> = ({
  lang,
  showPocket,
  onCollectedCountChange,
  onPopupOpenChange,
  onDebugUpdate,
}) => {
  const isRtl = lang === 'ar';
  const copy = PORTFOLIO_COPY.experiences;

  const outerRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const roadDrawRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const pocketRef = useRef<HTMLDivElement>(null);
  const stationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bridgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [xfuseTab, setXfuseTab] = useState<'lead' | 'sell'>('lead');
  const [pocketPulse, setPocketPulse] = useState(false);
  const [flyingBatches, setFlyingBatches] = useState<FlyingBatch[]>([]);
  const [popupStation, setPopupStation] = useState<ExperienceStationData | null>(null);

  const chimedStationsRef = useRef<Set<number>>(new Set());
  const pocketedStationsRef = useRef<Set<number>>(new Set());
  const batchIdRef = useRef(0);

  const launchPiecesToPocket = useCallback(
    (stationIdx: number) => {
      const station = EXPERIENCE_STATIONS[stationIdx];
      if (!station) return;

      const vw = window.innerWidth || 1024;
      const vh = window.innerHeight || 768;

      const stationEl = stationRefs.current[stationIdx];
      const stationRect = stationEl?.getBoundingClientRect();
      const pocketRect = pocketRef.current?.getBoundingClientRect();

      const startX =
        stationRect && stationRect.width > 0
          ? stationRect.left + stationRect.width * 0.5
          : vw * 0.5;
      const startY =
        stationRect && stationRect.height > 0
          ? Math.min(vh * 0.65, Math.max(vh * 0.25, stationRect.top + stationRect.height * 0.5))
          : vh * 0.42;

      const endX =
        pocketRect && pocketRect.width > 0
          ? pocketRect.left + pocketRect.width * 0.5
          : isRtl
            ? 64
            : vw - 64;
      const endY =
        pocketRect && pocketRect.height > 0
          ? pocketRect.top + pocketRect.height * 0.45
          : vh - 64;

      const nextId = ++batchIdRef.current;
      setFlyingBatches((prev) => [
        ...prev,
        { id: nextId, color: station.color, startX, startY, endX, endY },
      ]);

      window.setTimeout(() => {
        setPocketPulse(true);
        soundSystem.piecePocket(stationIdx);
      }, 420);

      window.setTimeout(() => {
        setPocketPulse(false);
      }, 920);

      window.setTimeout(() => {
        setFlyingBatches((prev) => prev.filter((b) => b.id !== nextId));
      }, 1050);
    },
    [isRtl],
  );

  const roadPathD = isRtl
    ? `M 720 0
       C 720 150, 440 250, 440 400
       C 440 600, 1000 710, 1000 940
       C 1000 1160, 420 1260, 420 1480
       C 420 1710, 990 1800, 990 2020
       C 990 2200, 720 2290, 720 ${WORLD_HEIGHT}`
    : `M 720 0
       C 720 150, 1000 250, 1000 400
       C 1000 600, 440 710, 440 940
       C 440 1160, 1020 1260, 1020 1480
       C 1020 1710, 450 1800, 450 2020
       C 450 2200, 720 2290, 720 ${WORLD_HEIGHT}`;

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const world = worldRef.current;
    const roadPath = roadDrawRef.current;
    if (!outer || !world || !roadPath) return;

    const totalLen = roadPath.getTotalLength();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      roadPath.style.strokeDasharray = `${totalLen}`;
      roadPath.style.strokeDashoffset = '0';
      onCollectedCountChange(16);
      return;
    }

    const ctx = gsap.context(() => {
      roadPath.style.strokeDasharray = `${totalLen}`;
      roadPath.style.strokeDashoffset = `${totalLen}`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const curLen = totalLen * p;
            roadPath.style.strokeDashoffset = String(totalLen - curLen);

            const pt = roadPath.getPointAtLength(curLen);
            const ptNext = roadPath.getPointAtLength(Math.min(totalLen, curLen + 4));
            const angleDeg = (Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * 180) / Math.PI;

            const viewportH = window.innerHeight || 800;
            const worldTranslateY = Math.max(
              -(WORLD_HEIGHT - viewportH),
              Math.min(0, viewportH * 0.45 - pt.y),
            );
            gsap.set(world, { y: worldTranslateY });

            if (planeRef.current) {
              gsap.set(planeRef.current, {
                left: `${(pt.x / 1440) * 100}%`,
                top: `${pt.y}px`,
                rotation: angleDeg,
              });
            }

            let currentStation = 0;
            for (let i = 0; i < STATION_WORLD_Y.length; i++) {
              if (pt.y >= STATION_WORLD_Y[i] - 120) {
                currentStation = i;
                if (!chimedStationsRef.current.has(i) && self.direction > 0) {
                  chimedStationsRef.current.add(i);
                  soundSystem.stationBloom(i);
                }
              }
            }
            setActiveStationIndex(currentStation);

            let completedStations = 0;
            for (let i = 0; i < STATION_WORLD_Y.length; i++) {
              const pastTriggerY = STATION_WORLD_Y[i] + 140;
              if (pt.y >= pastTriggerY) {
                completedStations += 1;
                if (!pocketedStationsRef.current.has(i) && self.direction > 0) {
                  pocketedStationsRef.current.add(i);
                  launchPiecesToPocket(i);
                }
              }
            }
            onCollectedCountChange(completedStations * 4);

            onDebugUpdate(p, `station-${EXPERIENCE_STATIONS[currentStation].id}`);
          },
        },
      });

      const stationStarts = [0.06, 0.31, 0.56, 0.8];
      stationRefs.current.forEach((el, idx) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0.25, scale: 0.9, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.12, ease: 'back.out(1.3)' },
          stationStarts[idx],
        );
      });

      const bridgeStarts = [0.22, 0.47, 0.72];
      bridgeRefs.current.forEach((el, idx) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
          bridgeStarts[idx],
        );
      });
    }, outer);

    return () => ctx.revert();
  }, [lang, isRtl, launchPiecesToPocket, onCollectedCountChange, onDebugUpdate]);

  const openDetailsPopup = (station: ExperienceStationData) => {
    setPopupStation(station);
    onPopupOpenChange?.(true);
  };

  React.useEffect(() => {
    onPopupOpenChange?.(Boolean(popupStation));
  }, [popupStation, onPopupOpenChange]);

  const getStationAchievements = (st: ExperienceStationData) => {
    if (st.tabs) {
      return xfuseTab === 'lead' ? st.tabs.lead.slice(0, 3) : st.tabs.sell.slice(0, 3);
    }
    return st.achievements.slice(0, 3);
  };

  return (
    <section
      id="scene-experiences"
      ref={outerRef}
      className="relative z-10 h-[560svh] w-full paper-grain-surface"
      style={{ backgroundColor: 'var(--surface-cream)' }}
      aria-label="Experiences roadmap"
    >
      <div className="sticky-stage">
        <div className="relative h-full w-full max-w-[1440px] mx-auto overflow-hidden">
          <div
            ref={worldRef}
            className="relative w-full"
            style={{ height: `${WORLD_HEIGHT}px` }}
          >
            {/* Continuous S-curve Bézier dotted road */}
            <svg
              viewBox={`0 0 1440 ${WORLD_HEIGHT}`}
              preserveAspectRatio="none"
              className="pointer-events-none hidden md:block absolute inset-0 h-full w-full overflow-visible"
              aria-hidden="true"
            >
              <path
                d={roadPathD}
                fill="none"
                stroke="#A68BC8"
                strokeOpacity="0.22"
                strokeWidth="3"
                strokeDasharray="6 11"
                strokeLinecap="round"
              />
              <path
                ref={roadDrawRef}
                d={roadPathD}
                fill="none"
                stroke="#A68BC8"
                strokeWidth="3.2"
                strokeDasharray="6 11"
                strokeLinecap="round"
              />
            </svg>

            {/* Origami paper plane */}
            <div
              ref={planeRef}
              className="pointer-events-none hidden md:block absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <PaperPlaneArt className="h-9 w-12 drop-shadow-sm" />
            </div>

            {/* 4 Stations + Bridges */}
            {EXPERIENCE_STATIONS.map((st, idx) => {
              const isEven = idx % 2 === 0;
              const alignRightOnDesktop = isRtl ? isEven : !isEven;
              const worldY = STATION_WORLD_Y[idx];
              const displayedAchievements = getStationAchievements(st);

              return (
                <React.Fragment key={st.id}>
                  {st.bridgeBefore && (
                    <div
                      ref={(el) => { bridgeRefs.current[idx - 1] = el; }}
                      className="hidden md:flex absolute inset-x-0 justify-center px-8"
                      style={{ top: `${worldY - 245}px` }}
                    >
                      <p className="max-w-xl rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)]/94 px-7 py-3.5 text-center font-display italic text-lg lg:text-xl text-[var(--ink-primary)] shadow-xs">
                        {st.bridgeBefore[lang]}
                      </p>
                    </div>
                  )}

                  {/* Station Medallion + Card (click-only popup via Open the file button) */}
                  <div
                    ref={(el) => { stationRefs.current[idx] = el; }}
                    className={`hidden md:flex absolute items-center gap-5 ${
                      alignRightOnDesktop
                        ? 'right-6 lg:right-12 flex-row-reverse'
                        : 'left-6 lg:left-12 flex-row'
                    }`}
                    style={{ top: `${worldY - 145}px` }}
                  >
                    {/* Medallion + dashed date pill */}
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`soft-float-idle relative flex h-28 w-28 lg:h-32 lg:w-32 items-center justify-center rounded-full border-[3px] shadow-[var(--paper-shadow)] overflow-hidden ${
                          st.darkLogoBg ? 'bg-[#14161A] p-0' : 'bg-white p-2'
                        }`}
                        style={{ borderColor: st.color }}
                      >
                        {st.logoSrc ? (
                          <img
                            src={st.logoSrc}
                            alt={st.company[lang]}
                            className={`h-full w-full rounded-full ${
                              st.darkLogoBg ? 'object-cover' : 'object-contain'
                            }`}
                          />
                        ) : st.id === 'fertical' ? (
                          <FerticalLogoArt className="h-full w-full" />
                        ) : (
                          <XfuseLogoArt className="h-full w-full" />
                        )}
                      </div>

                      <span
                        className="mt-3 rounded-full border border-dashed px-3.5 py-1 text-xs sm:text-sm font-medium text-[var(--ink-secondary)] bg-[var(--surface-card)]/95 whitespace-nowrap"
                        style={{ borderColor: st.color }}
                      >
                        {st.dates[lang]}
                      </span>
                    </div>

                    {/* Station Card */}
                    <div className="w-[410px] lg:w-[480px] rounded-[26px] border border-[var(--hairline)] bg-[var(--surface-card)] p-5 lg:p-6 shadow-[var(--paper-shadow)]">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-1.5" aria-hidden="true">
                          {[0, 1, 2, 3].map((dotIdx) => (
                            <span
                              key={dotIdx}
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: dotIdx === idx ? '20px' : '8px',
                                backgroundColor: dotIdx === idx ? st.color : 'rgba(166,139,200,0.28)',
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: st.color }}>
                          {st.company[lang]}
                        </span>
                      </div>

                      <h3
                        dir="ltr"
                        className={`font-display text-lg lg:text-xl font-semibold leading-snug text-[var(--ink-primary)] ${
                          isRtl ? 'text-right' : 'text-left'
                        }`}
                      >
                        {st.role}
                      </h3>

                      {/* X-FUSE interactive Lead / Sell tabs inside one station */}
                      {st.tabs && (
                        <div
                          className="mt-3 inline-flex rounded-full border border-[var(--hairline)] bg-[var(--surface-cream)] p-1"
                          role="tablist"
                          aria-label="X-FUSE tracks"
                        >
                          {(['lead', 'sell'] as const).map((tabKey) => {
                            const active = xfuseTab === tabKey;
                            return (
                              <button
                                key={tabKey}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => setXfuseTab(tabKey)}
                                className={`rounded-full px-4 py-1 text-xs font-bold transition-colors ${
                                  active
                                    ? 'bg-[#2D2140] text-[#F5EFE0] dark:bg-[#A68BC8] dark:text-[#1A1328]'
                                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                                }`}
                              >
                                {tabKey === 'lead' ? copy.tabLead[lang] : copy.tabSell[lang]}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Up to 3 Achievements directly on card */}
                      <ul className="mt-3.5 space-y-2">
                        {displayedAchievements.map((ach, aIdx) => (
                          <li
                            key={`${st.id}-${xfuseTab}-${aIdx}`}
                            className="flex items-start gap-2.5 rounded-xl border border-[var(--hairline)] bg-[var(--surface-cream)]/75 px-3 py-2 text-xs lg:text-sm leading-snug text-[var(--ink-primary)]"
                          >
                            <span
                              dir="ltr"
                              className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold text-[#2D2140]"
                              style={{ backgroundColor: st.softColor }}
                            >
                              {ach.badge}
                            </span>
                            <span className="flex-1">{ach.caption[lang]}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => openDetailsPopup(st)}
                          className="rounded-full bg-[#2D2140] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#F5EFE0] hover:bg-[#41305C] dark:bg-[#A68BC8] dark:text-[#1A1328] whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A68BC8]"
                        >
                          {copy.openFile[lang]}
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile responsive vertical card deck */}
          <div className="md:hidden absolute inset-0 flex flex-col justify-center px-4 pt-18 pb-22">
            {(() => {
              const st = EXPERIENCE_STATIONS[activeStationIndex];
              const displayedAchievements = getStationAchievements(st);
              return (
                <div className="rounded-3xl border border-[var(--hairline)] bg-[var(--surface-card)] p-4 sm:p-5 shadow-[var(--paper-shadow)]">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3].map((dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setActiveStationIndex(dotIdx)}
                          aria-label={EXPERIENCE_STATIONS[dotIdx].company[lang]}
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: dotIdx === activeStationIndex ? '20px' : '10px',
                            backgroundColor: dotIdx === activeStationIndex ? st.color : 'rgba(166,139,200,0.3)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-[var(--ink-muted)]">{st.dates[lang]}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-14 w-14 shrink-0 rounded-full border-2 overflow-hidden ${
                        st.darkLogoBg ? 'bg-[#14161A] p-0' : 'bg-white p-1'
                      }`}
                      style={{ borderColor: st.color }}
                    >
                      {st.logoSrc ? (
                        <img
                          src={st.logoSrc}
                          alt={st.company[lang]}
                          className={`h-full w-full rounded-full ${
                            st.darkLogoBg ? 'object-cover' : 'object-contain'
                          }`}
                        />
                      ) : st.id === 'fertical' ? (
                        <FerticalLogoArt className="h-full w-full" />
                      ) : (
                        <XfuseLogoArt className="h-full w-full" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: st.color }}>
                        {st.company[lang]}
                      </div>
                      <h3
                        dir="ltr"
                        className={`font-display text-base sm:text-lg font-semibold text-[var(--ink-primary)] ${
                          isRtl ? 'text-right' : 'text-left'
                        }`}
                      >
                        {st.role}
                      </h3>
                    </div>
                  </div>

                  {st.tabs && (
                    <div className="mt-3 inline-flex rounded-full border border-[var(--hairline)] bg-[var(--surface-cream)] p-1">
                      {(['lead', 'sell'] as const).map((tabKey) => {
                        const active = xfuseTab === tabKey;
                        return (
                          <button
                            key={tabKey}
                            type="button"
                            onClick={() => setXfuseTab(tabKey)}
                            className={`rounded-full px-3.5 py-1 text-xs font-bold transition-colors ${
                              active
                                ? 'bg-[#2D2140] text-[#F5EFE0] dark:bg-[#A68BC8] dark:text-[#1A1328]'
                                : 'text-[var(--ink-secondary)]'
                            }`}
                          >
                            {tabKey === 'lead' ? copy.tabLead[lang] : copy.tabSell[lang]}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <ul className="mt-3 space-y-2">
                    {displayedAchievements.map((ach, aIdx) => (
                      <li
                        key={`${st.id}-m-${xfuseTab}-${aIdx}`}
                        className="flex items-start gap-2 rounded-xl border border-[var(--hairline)] bg-[var(--surface-cream)]/75 px-3 py-2 text-xs leading-snug text-[var(--ink-primary)]"
                      >
                        <span
                          dir="ltr"
                          className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold text-[#2D2140]"
                          style={{ backgroundColor: st.softColor }}
                        >
                          {ach.badge}
                        </span>
                        <span className="flex-1">{ach.caption[lang]}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => openDetailsPopup(st)}
                      className="rounded-full bg-[#2D2140] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#F5EFE0] dark:bg-[#A68BC8] dark:text-[#1A1328]"
                    >
                      {copy.openFile[lang]}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Shimmering Flying Puzzle Pieces flying cleanly from each station into the skills pocket */}
      {flyingBatches.map((batch) => (
        <FlyingPuzzleSet key={batch.id} batch={batch} />
      ))}

      {/* Borderless floating skills pocket — visible ONLY inside Experiences */}
      {showPocket && (
        <div
          ref={pocketRef}
          className={`fixed bottom-5 ${isRtl ? 'left-5 sm:left-8' : 'right-5 sm:right-8'} z-30 flex flex-col items-center pointer-events-none select-none transition-transform duration-500 ease-[cubic-bezier(0.34,1.5,0.5,1)]`}
          style={{
            transform: pocketPulse ? 'scale(1.26)' : 'scale(1)',
          }}
        >
          <div className="relative flex items-center justify-center">
            <span
              className="pointer-events-none absolute -inset-3 rounded-full transition-opacity duration-300"
              style={{
                background:
                  'radial-gradient(circle, rgba(244,201,93,0.65) 0%, rgba(166,139,200,0.35) 50%, transparent 72%)',
                opacity: pocketPulse ? 1 : 0,
              }}
              aria-hidden="true"
            />
            <PuzzlePocketArt className="relative z-10 h-12 w-12 sm:h-14 sm:w-14 drop-shadow-md" />
          </div>
          <span
            dir="ltr"
            className="mt-1 font-display italic text-xs sm:text-sm font-semibold tracking-wide text-[var(--ink-primary)] drop-shadow-xs"
          >
            {copy.pocketLabel}
          </span>
        </div>
      )}

      <ExperiencePopup
        station={popupStation}
        lang={lang}
        onClose={() => setPopupStation(null)}
      />
    </section>
  );
};

const PIECE_OFFSETS = [
  { ox: -38, oy: -28, rot: -18, delay: 0 },
  { ox: 26, oy: -42, rot: 22, delay: 75 },
  { ox: -14, oy: 18, rot: 14, delay: 140 },
  { ox: 42, oy: 12, rot: -24, delay: 205 },
];

const FlyingPuzzleSet: React.FC<{ batch: FlyingBatch }> = ({ batch }) => {
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    pieceRefs.current.forEach((el, idx) => {
      if (!el) return;
      const offset = PIECE_OFFSETS[idx];
      const sx = batch.startX + offset.ox;
      const sy = batch.startY + offset.oy;
      const ex = batch.endX;
      const ey = batch.endY;

      gsap.fromTo(
        el,
        {
          x: sx,
          y: sy,
          scale: 0.55,
          opacity: 0,
          rotation: offset.rot,
        },
        {
          x: ex,
          y: ey,
          scale: 0.35,
          opacity: 1,
          rotation: offset.rot * 2.2,
          duration: 0.65,
          delay: offset.delay / 1000,
          ease: 'power2.inOut',
          keyframes: [
            { x: sx + (ex - sx) * 0.12, y: sy - 24, scale: 1.25, opacity: 1, duration: 0.2 },
            { x: ex, y: ey, scale: 0.25, opacity: 0.15, duration: 0.45 },
          ],
        },
      );
    });
  }, [batch]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {PIECE_OFFSETS.map((offset, idx) => (
        <div
          key={idx}
          ref={(el) => { pieceRefs.current[idx] = el; }}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            filter: `drop-shadow(0 0 12px ${batch.color}) drop-shadow(0 0 22px rgba(244,201,93,0.75))`,
          }}
        >
          <PuzzlePieceArt color={batch.color} className="h-11 w-11 sm:h-12 sm:w-12" />
        </div>
      ))}
    </div>
  );
};
