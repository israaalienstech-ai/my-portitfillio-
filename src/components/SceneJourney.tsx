import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lang, PORTFOLIO_COPY } from '../data/rebuildContent';
import { KeyedImage } from './StorybookVisuals';
import { soundSystem } from '../utils/soundSystem';

gsap.registerPlugin(ScrollTrigger);

interface SceneJourneyProps {
  lang: Lang;
  onJumpToFertical: () => void;
  onDebugUpdate: (progress: number, beat: string) => void;
}

export const SceneJourney: React.FC<SceneJourneyProps> = ({
  lang,
  onJumpToFertical,
  onDebugUpdate,
}) => {
  const isRtl = lang === 'ar';
  const copy = PORTFOLIO_COPY.journey;

  const outerRef = useRef<HTMLElement>(null);
  const stickyWrapperRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLHeadingElement>(null);
  const lineRefs = useRef<(HTMLLIElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closingRef = useRef<HTMLDivElement>(null);
  const scratchPathsRef = useRef<(SVGPathElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [stepState, setStepState] = useState({
    f1: false,
    f2: false,
    f3: false,
    f4: false,
    h1: false,
    h2: false,
    h3: false,
  });

  const triggeredSoundsRef = useRef({
    wave: false,
    beat1: false,
    beat2: false,
    beat3: false,
    scratch1: false,
    scratch2: false,
    scratch3: false,
  });

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const stickyWrapper = stickyWrapperRef.current;
    if (!outer || !stickyWrapper) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setStepState({ f1: true, f2: true, f3: true, f4: true, h1: true, h2: true, h3: true });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outer,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          if (!triggeredSoundsRef.current.wave) {
            triggeredSoundsRef.current.wave = true;
            soundSystem.waveRise();
          }
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyWrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setStepState({
              f1: p >= 0.04,
              f2: p >= 0.06,
              f3: p >= 0.08,
              f4: p >= 0.1,
              h1: p >= 0.19,
              h2: p >= 0.37,
              h3: p >= 0.55,
            });

            let activeBeat = 'lead';
            if (p > 0.14 && p <= 0.31) {
              activeBeat = 'line-1-questions';
              if (!triggeredSoundsRef.current.beat1 && self.direction > 0) {
                triggeredSoundsRef.current.beat1 = true;
                soundSystem.journeyBeat(0);
              }
            } else if (p > 0.31 && p <= 0.49) {
              activeBeat = 'line-2-research';
              if (!triggeredSoundsRef.current.beat2 && self.direction > 0) {
                triggeredSoundsRef.current.beat2 = true;
                soundSystem.journeyBeat(1);
              }
            } else if (p > 0.49 && p <= 0.65) {
              activeBeat = 'line-3-critical';
              if (!triggeredSoundsRef.current.beat3 && self.direction > 0) {
                triggeredSoundsRef.current.beat3 = true;
                soundSystem.journeyBeat(2);
              }
            } else if (p > 0.65 && p <= 0.85) {
              activeBeat = 'scratches';
              if (p > 0.68 && !triggeredSoundsRef.current.scratch1 && self.direction > 0) {
                triggeredSoundsRef.current.scratch1 = true;
                soundSystem.scratchBurst(0);
              }
              if (p > 0.74 && !triggeredSoundsRef.current.scratch2 && self.direction > 0) {
                triggeredSoundsRef.current.scratch2 = true;
                soundSystem.scratchBurst(1);
              }
              if (p > 0.8 && !triggeredSoundsRef.current.scratch3 && self.direction > 0) {
                triggeredSoundsRef.current.scratch3 = true;
                soundSystem.scratchBurst(2);
              }
            } else if (p > 0.85) {
              activeBeat = 'fertical-cta';
            }
            onDebugUpdate(p, activeBeat);
          },
        },
      });

      if (leadRef.current) {
        tl.fromTo(
          leadRef.current,
          { opacity: 0, y: 38, scale: 0.9, rotate: isRtl ? 2 : -2 },
          { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.11, ease: 'back.out(1.35)' },
          0.01,
        );
      }

      // Scroll Step 1 -> Line 1 + Illustration 1
      if (lineRefs.current[0]) {
        tl.fromTo(lineRefs.current[0], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.11 }, 0.12);
      }
      if (imgRefs.current[0]) {
        tl.fromTo(
          imgRefs.current[0],
          { opacity: 0, scale: 0.9, rotate: isRtl ? 2 : -2, clipPath: 'inset(100% 0% 0% 0% round 220px 220px 28px 28px)' },
          { opacity: 1, scale: 1, rotate: isRtl ? -1 : 1, clipPath: 'inset(0% 0% 0% 0% round 220px 220px 28px 28px)', duration: 0.16 },
          0.12,
        );
      }

      // Scroll Step 2 -> Line 2 + Illustration 2
      if (imgRefs.current[0]) {
        tl.to(imgRefs.current[0], { opacity: 0.34, scale: 0.92, x: isRtl ? 24 : -24, y: -12, duration: 0.14 }, 0.3);
      }
      if (lineRefs.current[1]) {
        tl.fromTo(lineRefs.current[1], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.11 }, 0.3);
      }
      if (imgRefs.current[1]) {
        tl.fromTo(
          imgRefs.current[1],
          { opacity: 0, scale: 0.9, rotate: isRtl ? -2 : 2, clipPath: 'inset(100% 0% 0% 0% round 220px 220px 28px 28px)' },
          { opacity: 1, scale: 1, rotate: isRtl ? -1 : 1, clipPath: 'inset(0% 0% 0% 0% round 220px 220px 28px 28px)', duration: 0.16 },
          0.31,
        );
      }

      // Scroll Step 3 -> Line 3 + Illustration 3
      if (imgRefs.current[0]) {
        tl.to(imgRefs.current[0], { opacity: 0, duration: 0.1 }, 0.48);
      }
      if (imgRefs.current[1]) {
        tl.to(imgRefs.current[1], { opacity: 0.34, scale: 0.92, x: isRtl ? 24 : -24, y: -12, duration: 0.14 }, 0.48);
      }
      if (lineRefs.current[2]) {
        tl.fromTo(lineRefs.current[2], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.11 }, 0.48);
      }
      if (imgRefs.current[2]) {
        tl.fromTo(
          imgRefs.current[2],
          { opacity: 0, scale: 0.9, rotate: isRtl ? -2 : 2, clipPath: 'inset(100% 0% 0% 0% round 220px 220px 28px 28px)' },
          { opacity: 1, scale: 1, rotate: isRtl ? -1 : 1, clipPath: 'inset(0% 0% 0% 0% round 220px 220px 28px 28px)', duration: 0.16 },
          0.49,
        );
      }

      // Scroll Step 4 -> Closing line + original 3-stroke rose/coral scratches
      if (closingRef.current) {
        tl.fromTo(closingRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.08 }, 0.62);
      }
      scratchPathsRef.current.forEach((pathEl, idx) => {
        if (!pathEl) return;
        const len = pathEl.getTotalLength();
        const at = 0.67 + idx * 0.06;
        tl.fromTo(
          pathEl,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 0.055, ease: 'none' },
          at,
        );
        if (closingRef.current) {
          tl.to(
            closingRef.current,
            { x: idx % 2 === 0 ? 1.2 : -1.2, y: 0.8, duration: 0.025, yoyo: true, repeat: 1 },
            at,
          );
        }
      });

      // Scroll Step 5 -> Large FERTICAL CTA
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.1 }, 0.85);
      }
    }, outer);

    return () => ctx.revert();
  }, [lang, isRtl, onDebugUpdate]);

  return (
    <section
      id="scene-journey"
      ref={outerRef}
      className="relative z-10 w-full bg-transparent"
      aria-label="How my journey starts"
    >
      {/* Wave curtain edge */}
      <div
        className="pointer-events-none relative h-[88px] sm:h-[116px] w-full overflow-hidden leading-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="wave-undulate-idle block h-full w-full"
        >
          <path
            d="M0,78 C290,14 520,104 820,46 C1080,-4 1280,82 1440,34 L1440,122 L0,122 Z"
            fill="var(--surface-peach)"
          />
        </svg>
      </div>

      {/* Full-bleed sticky stage */}
      <div
        ref={stickyWrapperRef}
        className="relative -mt-px h-[370svh] w-full transition-colors duration-300"
        style={{ backgroundColor: 'var(--surface-peach)' }}
      >
        <div
          className="sticky-stage paper-grain-surface"
          style={{ backgroundColor: 'var(--surface-peach)' }}
        >
          <div className="relative mx-auto flex h-full w-full max-w-[1400px] flex-col justify-center px-5 sm:px-8 lg:px-20 pt-14 pb-5 sm:pt-16 sm:pb-6 md:py-10">
            <div className="flex flex-col-reverse md:grid md:grid-cols-12 md:items-center gap-3 md:gap-7 lg:gap-10">
              {/* Inline-start scroll steps */}
              <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-center">
                {(() => {
                  const leadStr = copy.lead[lang].trim();
                  const lastSpace = leadStr.lastIndexOf(' ');
                  const leadBeforeLast = lastSpace > 0 ? leadStr.slice(0, lastSpace + 1) : '';
                  const leadLastWord = lastSpace > 0 ? leadStr.slice(lastSpace + 1) : leadStr;
                  return (
                    <h2
                      ref={leadRef}
                      className="font-display font-semibold leading-[1.2] text-[var(--ink-primary)] max-w-2xl"
                      style={{ fontSize: 'clamp(1.2rem, 2.35vw, 2.45rem)' }}
                    >
                      <span>{leadBeforeLast}</span>
                      <span className="inline-flex items-center gap-2 whitespace-nowrap align-baseline">
                        <span>{leadLastWord}</span>
                        <svg
                          viewBox="0 0 92 26"
                          className={`inline-block h-5 w-16 sm:h-6 sm:w-20 align-middle overflow-visible shrink-0 ${isRtl ? '-scale-x-100' : ''}`}
                          aria-hidden="true"
                        >
                          {[
                            { cx: 11, cy: 17, rot: -18, active: stepState.f1 },
                            { cx: 33, cy: 8, rot: -10, active: stepState.f2 },
                            { cx: 56, cy: 17, rot: -16, active: stepState.f3 },
                            { cx: 79, cy: 8, rot: -12, active: stepState.f4 },
                          ].map((fp, fIdx) => (
                            <g
                              key={fIdx}
                              style={{
                                opacity: fp.active ? 1 : 0,
                                transform: fp.active ? 'scale(1)' : 'scale(0.35)',
                                transformOrigin: `${fp.cx}px ${fp.cy}px`,
                                transition: 'opacity 360ms ease, transform 420ms cubic-bezier(0.34,1.4,0.5,1)',
                              }}
                            >
                              <ellipse
                                cx={fp.cx}
                                cy={fp.cy}
                                rx="4.8"
                                ry="3"
                                transform={`rotate(${fp.rot} ${fp.cx} ${fp.cy})`}
                                fill="#EDA89B"
                                stroke="#7A4FB0"
                                strokeWidth="1.5"
                              />
                              <circle
                                cx={fp.cx + 5.8}
                                cy={fp.cy - 2.3}
                                r="1.15"
                                fill="#7A4FB0"
                              />
                            </g>
                          ))}
                        </svg>
                      </span>
                    </h2>
                  );
                })()}

                <ol className="mt-3 md:mt-4 lg:mt-6 space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4.5 max-w-xl">
                  {/* Line 1: Light purple marker */}
                  <li
                    ref={(el) => { lineRefs.current[0] = el; }}
                    className="flex items-baseline gap-2.5 text-sm sm:text-[15px] md:text-base lg:text-xl leading-snug lg:leading-relaxed text-[var(--ink-secondary)]"
                  >
                    <span className="font-display font-bold text-[#7a4fb0] shrink-0">
                      {copy.lines[0].num[lang]}
                    </span>
                    <p>
                      <span className="relative inline-block px-1 font-semibold text-[var(--ink-primary)]">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0.5 top-1 -z-10 rounded-md transition-transform duration-500 ease-out"
                          style={{
                            backgroundColor: 'rgba(186, 158, 224, 0.42)',
                            transformOrigin: isRtl ? 'right center' : 'left center',
                            transform: stepState.h1 ? 'scaleX(1)' : 'scaleX(0)',
                          }}
                        />
                        {copy.lines[0].highlight[lang]}
                      </span>
                      <span>{copy.lines[0].rest[lang]}</span>
                    </p>
                  </li>

                  {/* Line 2: Hand-drawn sage underline #8fb996 */}
                  <li
                    ref={(el) => { lineRefs.current[1] = el; }}
                    className="flex items-baseline gap-2.5 text-sm sm:text-[15px] md:text-base lg:text-xl leading-snug lg:leading-relaxed text-[var(--ink-secondary)]"
                  >
                    <span className="font-display font-bold text-[#5e8e67] shrink-0">
                      {copy.lines[1].num[lang]}
                    </span>
                    <p>
                      <span className="relative inline-block font-semibold text-[var(--ink-primary)]">
                        <span>{copy.lines[1].highlight[lang]}</span>
                        <svg
                          viewBox="0 0 160 14"
                          preserveAspectRatio="none"
                          className="pointer-events-none absolute -bottom-1 inset-x-0 h-3 w-full overflow-visible"
                          aria-hidden="true"
                        >
                          <path
                            d="M 2 9 C 45 3, 110 11, 158 5"
                            fill="none"
                            stroke="#8fb996"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray="175"
                            strokeDashoffset={stepState.h2 ? 0 : 175}
                            style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.22,0.8,0.3,1)' }}
                          />
                        </svg>
                      </span>
                      <span>{copy.lines[1].rest[lang]}</span>
                    </p>
                  </li>

                  {/* Line 3: Hand-drawn pink circle #e9a8a0 */}
                  <li
                    ref={(el) => { lineRefs.current[2] = el; }}
                    className="flex items-baseline gap-2.5 text-sm sm:text-[15px] md:text-base lg:text-xl leading-snug lg:leading-relaxed text-[var(--ink-secondary)]"
                  >
                    <span className="font-display font-bold text-[#c77166] shrink-0">
                      {copy.lines[2].num[lang]}
                    </span>
                    <p>
                      <span className="relative inline-block px-2.5 font-semibold text-[var(--ink-primary)]">
                        {copy.lines[2].highlight[lang]}
                        <svg
                          viewBox="0 0 184 56"
                          preserveAspectRatio="none"
                          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[158%] w-[120%] overflow-visible"
                          aria-hidden="true"
                        >
                          <path
                            d="M 10 28 C 8 5, 174 4, 176 28 C 178 52, 12 53, 8 29 C 6 16, 58 7, 122 9"
                            fill="none"
                            stroke="#e9a8a0"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            strokeDasharray="520"
                            strokeDashoffset={stepState.h3 ? 0 : 520}
                            style={{ transition: 'stroke-dashoffset 750ms cubic-bezier(0.22,0.8,0.3,1)' }}
                          />
                        </svg>
                      </span>
                      <span>{copy.lines[2].rest[lang]}</span>
                    </p>
                  </li>
                </ol>

                {/* Closing line + original rose 3-stroke scratches */}
                <div
                  ref={closingRef}
                  className="mt-3.5 md:mt-5 lg:mt-8 flex flex-wrap items-center gap-x-2 text-base sm:text-lg md:text-xl lg:text-[28px] font-display text-[var(--ink-primary)]"
                >
                  <span>{copy.closingBefore[lang]}</span>
                  <span className="relative inline-block px-1.5 font-semibold italic text-[#D97F70] dark:text-[#EDA89B]">
                    {copy.closingWord[lang]}
                    <svg
                      viewBox="0 0 130 44"
                      className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[135%] w-[115%] overflow-visible"
                      aria-hidden="true"
                    >
                      <path
                        ref={(el) => { scratchPathsRef.current[0] = el; }}
                        d="M 4 24 C 34 15, 86 19, 122 14"
                        fill="none"
                        stroke="#E7907A"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                      <path
                        ref={(el) => { scratchPathsRef.current[1] = el; }}
                        d="M 118 22 C 80 28, 40 21, 8 30"
                        fill="none"
                        stroke="#EDA89B"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                      <path
                        ref={(el) => { scratchPathsRef.current[2] = el; }}
                        d="M 10 18 C 46 31, 92 24, 126 29"
                        fill="none"
                        stroke="#E7907A"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span>{copy.closingAfter[lang]}</span>
                </div>

                {/* Redesigned botanical storybook CTA: This is where it started -> FERTICAL */}
                <div ref={ctaRef} className="mt-3.5 md:mt-5 lg:mt-8 flex flex-wrap items-center gap-2.5 lg:gap-3.5">
                  <span className="font-display text-sm sm:text-base md:text-lg lg:text-xl font-medium text-[var(--ink-secondary)]">
                    {copy.ctaPrefix[lang]}
                  </span>
                  <button
                    type="button"
                    onClick={onJumpToFertical}
                    className="group relative inline-flex items-center gap-2.5 lg:gap-3.5 rounded-2xl border-2 border-[#7A4FB0]/35 bg-[var(--surface-card)] px-3.5 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 shadow-[var(--paper-shadow)] hover:border-[#6B8E63] hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A68BC8]"
                  >
                    <span
                      className="flex h-7 w-7 lg:h-9 lg:w-9 items-center justify-center rounded-xl bg-[#DCE7DD] text-[#355E3B] border border-[#9DB5A0]/50 transition-transform duration-300 group-hover:rotate-6"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 28 28" className="h-4 w-4 lg:h-5 lg:w-5" fill="none">
                        <path
                          d="M6 21 C7 11, 14 6, 22 6 C22 14, 17 21, 7 21 Z"
                          fill="#9DB5A0"
                          stroke="#2F5233"
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 21 C11 16, 15 12, 20 8"
                          stroke="#2F5233"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span
                      dir="ltr"
                      className="font-display text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-[0.14em] uppercase bg-gradient-to-r from-[#2F5233] via-[#6B8E63] to-[#7A4FB0] dark:from-[#BCE0C2] dark:via-[#9DB5A0] dark:to-[#D8BEFF] bg-clip-text text-transparent"
                    >
                      {copy.ctaCompany}
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded-xl bg-[#2D2140] text-[#F5EFE0] dark:bg-[#A68BC8] dark:text-[#1A1328] text-sm lg:text-base font-bold transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      {isRtl ? '←' : '→'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Inline-end: responsive stacked arched frames */}
              <div className="md:col-span-5 lg:col-span-6 flex items-center justify-center mb-1 md:mb-0">
                <div className="relative h-[168px] w-[146px] sm:h-[205px] sm:w-[175px] md:h-[360px] md:w-[305px] lg:h-[490px] lg:w-[415px] xl:h-[560px] xl:w-[475px]">
                  {copy.lines.map((line, idx) => (
                    <div
                      key={line.id}
                      ref={(el) => { imgRefs.current[idx] = el; }}
                      className="arch-panel absolute inset-0 border-4 border-[#FFF9F2] dark:border-[#392B50] bg-[var(--surface-card)] shadow-[var(--paper-shadow-lg)] overflow-hidden p-2 flex items-center justify-center"
                      style={{ zIndex: idx + 1 }}
                    >
                      <KeyedImage
                        src={line.imgSrc}
                        alt={line.highlight[lang]}
                        className="h-full w-full object-contain scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
