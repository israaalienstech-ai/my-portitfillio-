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
  const ctaRef = useRef<HTMLDivElement>(null);

  const [stepState, setStepState] = useState({
    h1: false,
    h2: false,
    h3: false,
    doodle: false,
  });

  const triggeredSoundsRef = useRef({
    wave: false,
    beat1: false,
    beat2: false,
    beat3: false,
    scribble: false,
  });

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const stickyWrapper = stickyWrapperRef.current;
    if (!outer || !stickyWrapper) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setStepState({ h1: true, h2: true, h3: true, doodle: true });
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
              h1: p >= 0.19,
              h2: p >= 0.37,
              h3: p >= 0.55,
              doodle: p >= 0.72,
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
            } else if (p > 0.49 && p <= 0.67) {
              activeBeat = 'line-3-critical';
              if (!triggeredSoundsRef.current.beat3 && self.direction > 0) {
                triggeredSoundsRef.current.beat3 = true;
                soundSystem.journeyBeat(2);
              }
            } else if (p > 0.67 && p <= 0.85) {
              activeBeat = 'scribbles';
              if (!triggeredSoundsRef.current.scribble && self.direction > 0) {
                triggeredSoundsRef.current.scribble = true;
                soundSystem.scratchBurst(0);
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
          { opacity: 0.25, y: 18 },
          { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
          0,
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

      // Scroll Step 4 -> Scribbles closing line
      if (closingRef.current) {
        tl.fromTo(closingRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.1 }, 0.66);
      }

      // Scroll Step 5 -> Large FERTICAL CTA
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.1 }, 0.84);
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
          <div className="relative mx-auto flex h-full w-full max-w-[1400px] flex-col justify-center px-6 sm:px-12 lg:px-20 py-10">
            <div className="flex flex-col-reverse md:grid md:grid-cols-12 md:items-center gap-6 md:gap-10">
              {/* Inline-start scroll steps */}
              <div className="md:col-span-6 flex flex-col justify-center">
                <h2
                  ref={leadRef}
                  className="font-display font-semibold leading-[1.15] text-[var(--ink-primary)] max-w-2xl"
                  style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.9rem)' }}
                >
                  {copy.lead[lang]}
                </h2>

                <ol className="mt-5 md:mt-7 space-y-4 md:space-y-5 max-w-xl">
                  {/* Line 1: Light purple marker */}
                  <li
                    ref={(el) => { lineRefs.current[0] = el; }}
                    className="flex items-baseline gap-2.5 text-base sm:text-lg md:text-xl leading-relaxed text-[var(--ink-secondary)]"
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
                    className="flex items-baseline gap-2.5 text-base sm:text-lg md:text-xl leading-relaxed text-[var(--ink-secondary)]"
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
                    className="flex items-baseline gap-2.5 text-base sm:text-lg md:text-xl leading-relaxed text-[var(--ink-secondary)]"
                  >
                    <span className="font-display font-bold text-[#c77166] shrink-0">
                      {copy.lines[2].num[lang]}
                    </span>
                    <p>
                      <span className="relative inline-block px-1.5 font-semibold text-[var(--ink-primary)]">
                        {copy.lines[2].highlight[lang]}
                        <svg
                          viewBox="0 0 180 54"
                          preserveAspectRatio="none"
                          className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[132%] w-[112%] overflow-visible"
                          aria-hidden="true"
                        >
                          <path
                            d="M 14 28 C 12 8, 166 5, 170 26 C 174 47, 14 49, 10 29 C 8 18, 56 9, 112 10"
                            fill="none"
                            stroke="#e9a8a0"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            strokeDasharray="460"
                            strokeDashoffset={stepState.h3 ? 0 : 460}
                            style={{ transition: 'stroke-dashoffset 750ms cubic-bezier(0.22,0.8,0.3,1)' }}
                          />
                        </svg>
                      </span>
                      <span>{copy.lines[2].rest[lang]}</span>
                    </p>
                  </li>
                </ol>

                {/* Closing line: wobbly "scribbles" + gold (#e8b04a) spiral, star, and arrow doodles */}
                <div
                  ref={closingRef}
                  className="mt-6 md:mt-8 flex flex-wrap items-center gap-x-2 text-xl sm:text-2xl md:text-[28px] font-display text-[var(--ink-primary)]"
                >
                  <span>{copy.closingBefore[lang]}</span>
                  <span className="relative inline-block px-2 font-semibold italic text-[#c97e24] dark:text-[#e8b04a]">
                    <span className="inline-block -rotate-2">{copy.closingWord[lang]}</span>
                    {/* Wobbly gold underline + small spiral, star & arrow doodles */}
                    <svg
                      viewBox="0 0 175 68"
                      className="pointer-events-none absolute -inset-x-4 -inset-y-3 h-[155%] w-[138%] overflow-visible"
                      aria-hidden="true"
                    >
                      {/* Wobbly line directly under word */}
                      <path
                        d="M 18 44 Q 32 38, 46 44 T 74 44 T 102 44 T 130 44"
                        fill="none"
                        stroke="#e8b04a"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeDasharray="150"
                        strokeDashoffset={stepState.doodle ? 0 : 150}
                        style={{ transition: 'stroke-dashoffset 550ms ease' }}
                      />
                      {/* Small gold spiral on one side */}
                      <path
                        d="M 10 24 C 6 19, 14 14, 18 19 C 22 24, 14 31, 8 27 C 3 23, 5 13, 14 11"
                        fill="none"
                        stroke="#e8b04a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="90"
                        strokeDashoffset={stepState.doodle ? 0 : 90}
                        style={{ transition: 'stroke-dashoffset 550ms ease 180ms' }}
                      />
                      {/* Small 4-point gold star */}
                      <path
                        d="M 148 11 L 151 18 L 158 20 L 151 22 L 148 29 L 145 22 L 138 20 L 145 18 Z"
                        fill="none"
                        stroke="#e8b04a"
                        strokeWidth="1.9"
                        strokeLinejoin="round"
                        strokeDasharray="70"
                        strokeDashoffset={stepState.doodle ? 0 : 70}
                        style={{ transition: 'stroke-dashoffset 480ms ease 320ms' }}
                      />
                      {/* Small curved arrow */}
                      <path
                        d="M 136 46 Q 152 46, 158 34 M 151 36 L 158 34 L 161 41"
                        fill="none"
                        stroke="#e8b04a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="70"
                        strokeDashoffset={stepState.doodle ? 0 : 70}
                        style={{ transition: 'stroke-dashoffset 480ms ease 440ms' }}
                      />
                    </svg>
                  </span>
                  <span>{copy.closingAfter[lang]}</span>
                </div>

                {/* Large CTA: This is where it started: FERTICAL -> */}
                <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-3.5">
                  <span className="font-display text-lg sm:text-xl font-medium text-[var(--ink-secondary)]">
                    {copy.ctaPrefix[lang]}
                  </span>
                  <button
                    type="button"
                    onClick={onJumpToFertical}
                    className="inline-flex items-center gap-3 rounded-full bg-[#2D2140] px-8 py-4 font-display text-lg sm:text-2xl font-bold tracking-wide text-[#F5EFE0] shadow-[var(--paper-shadow)] hover:bg-[#41305C] hover:scale-[1.03] dark:bg-[#A68BC8] dark:text-[#1A1328] dark:hover:bg-[#E4D8F0] transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A68BC8]"
                  >
                    <span dir="ltr">{copy.ctaCompany}</span>
                    <span aria-hidden="true">{isRtl ? '←' : '→'}</span>
                  </button>
                </div>
              </div>

              {/* Inline-end: 50% larger stacked arched frames */}
              <div className="md:col-span-6 flex items-center justify-center mb-2 md:mb-0">
                <div className="relative h-[250px] w-[215px] sm:h-[360px] sm:w-[305px] md:h-[520px] md:w-[440px] lg:h-[570px] lg:w-[485px]">
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
