import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Lang, PORTFOLIO_COPY } from '../data/rebuildContent';
import { UPLOADED_ASSETS } from './StorybookVisuals';
import { soundSystem } from '../utils/soundSystem';

interface SceneHeroProps {
  lang: Lang;
  nightMode: boolean;
  gateComplete: boolean;
  skipTyping: boolean;
  logoSlotRef: React.RefObject<HTMLAnchorElement | null>;
  onNameLanded: () => void;
  onIntroComplete: () => void;
  onStartJourneyClick: () => void;
  fixedOpacity: number;
}

const CONFETTI_BITS = [
  { cx: '-28px', cy: '-26px', cr: '-45deg', color: '#E8B04A', shape: 'rect', delay: '0ms' },
  { cx: '26px', cy: '-30px', cr: '60deg', color: '#E9A8A0', shape: 'circle', delay: '40ms' },
  { cx: '-14px', cy: '-38px', cr: '110deg', color: '#A68BC8', shape: 'rect', delay: '70ms' },
  { cx: '38px', cy: '-16px', cr: '-80deg', color: '#8FB996', shape: 'rect', delay: '100ms' },
  { cx: '-36px', cy: '10px', cr: '75deg', color: '#E8B04A', shape: 'circle', delay: '120ms' },
  { cx: '16px', cy: '-40px', cr: '-110deg', color: '#F4C95D', shape: 'star', delay: '50ms' },
  { cx: '34px', cy: '14px', cr: '40deg', color: '#A68BC8', shape: 'circle', delay: '140ms' },
  { cx: '-6px', cy: '22px', cr: '-55deg', color: '#E9A8A0', shape: 'rect', delay: '90ms' },
];

type HeroStage =
  | 'idle'
  | 'typing-greeting'
  | 'typing-headline'
  | 'typing-line3'
  | 'done';

export const SceneHero: React.FC<SceneHeroProps> = ({
  lang,
  nightMode,
  gateComplete,
  skipTyping,
  onNameLanded,
  onIntroComplete,
  onStartJourneyClick,
  fixedOpacity,
}) => {
  const isRtl = lang === 'ar';
  const copy = PORTFOLIO_COPY.hero[lang];

  const greetingFull = copy.greeting;
  const headlineFull = `${copy.namePrefix}${copy.name}${copy.portfolioPrefix}${copy.portfolioWord}${copy.portfolioDots}`;
  const line3Full = `${copy.line3Before}${copy.line3Curiosity}${copy.line3Mid}${copy.line3Steps}${copy.line3After}`;

  // Guarantee typing runs ONCE after gate opens and NEVER erases/replays on scroll or language toggle
  const hasFinishedTypingRef = useRef(false);
  const onNameLandedRef = useRef(onNameLanded);
  const onIntroCompleteRef = useRef(onIntroComplete);
  onNameLandedRef.current = onNameLanded;
  onIntroCompleteRef.current = onIntroComplete;

  const [stage, setStage] = useState<HeroStage>('idle');
  const [cG, setCG] = useState(0);
  const [cH, setCH] = useState(0);
  const [c3, setC3] = useState(0);
  const [greetingSettled, setGreetingSettled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [heroScrollLift, setHeroScrollLift] = useState(0);

  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const midParallaxRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLSpanElement>(null);
  const rightEyeRef = useRef<HTMLSpanElement>(null);
  const confettiFiredRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!gateComplete) return;

    // Once initial typing is complete (or skipped / reduced motion), NEVER erase or restart typing!
    if (skipTyping || reduced || hasFinishedTypingRef.current) {
      hasFinishedTypingRef.current = true;
      setCG(greetingFull.length);
      setCH(headlineFull.length);
      setC3(line3Full.length);
      setGreetingSettled(true);
      setShowHighlights(true);
      setStage('done');
      onNameLandedRef.current();
      onIntroCompleteRef.current();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    setCG(0);
    setCH(0);
    setC3(0);
    setGreetingSettled(false);
    setShowConfetti(false);
    setShowHighlights(false);
    setStage('typing-greeting');

    let iG = 0;
    let iH = 0;
    let i3 = 0;

    const portfolioWordEnd =
      copy.namePrefix.length +
      copy.name.length +
      copy.portfolioPrefix.length +
      copy.portfolioWord.length;

    // Slow gentle character-by-character typewriter
    const stepGreeting = () => {
      iG += 1;
      setCG(iG);
      if (iG % 2 === 1) soundSystem.typewriterTick();

      if (iG < greetingFull.length) {
        const ch = greetingFull[iG - 1];
        schedule(stepGreeting, ch === ' ' ? 70 : ch === '.' ? 160 : 92);
      } else {
        schedule(() => {
          setGreetingSettled(true);
          onNameLandedRef.current();
          soundSystem.nameLand();
          schedule(() => {
            setStage('typing-headline');
            stepHeadline();
          }, 520);
        }, 420);
      }
    };

    const stepHeadline = () => {
      iH += 1;
      setCH(iH);
      if (iH % 2 === 1) soundSystem.typewriterTick();

      if (iH >= portfolioWordEnd && !confettiFiredRef.current) {
        confettiFiredRef.current = true;
        setShowConfetti(true);
        soundSystem.confettiPop();
      }

      if (iH < headlineFull.length) {
        const ch = headlineFull[iH - 1];
        schedule(stepHeadline, ch === ' ' ? 65 : 88);
      } else {
        schedule(() => {
          setStage('typing-line3');
          stepLine3();
        }, 420);
      }
    };

    const stepLine3 = () => {
      i3 += 1;
      setC3(i3);
      if (i3 % 2 === 1) soundSystem.typewriterTick();

      if (i3 < line3Full.length) {
        schedule(stepLine3, 72);
      } else {
        schedule(() => {
          hasFinishedTypingRef.current = true;
          setStage('done');
          setShowHighlights(true);
          onIntroCompleteRef.current();
        }, 220);
      }
    };

    schedule(stepGreeting, 240);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [gateComplete, skipTyping, greetingFull, headlineFull, line3Full, copy.namePrefix.length, copy.name.length, copy.portfolioPrefix.length, copy.portfolioWord.length]);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const handleMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const ny = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;

      if (bgParallaxRef.current) {
        bgParallaxRef.current.style.transform = `translate3d(${(-nx * 3).toFixed(2)}px, ${(-ny * 3).toFixed(2)}px, 0) scale(1.02)`;
      }
      if (midParallaxRef.current) {
        midParallaxRef.current.style.transform = `translate3d(${(-nx * 6).toFixed(2)}px, ${(-ny * 6).toFixed(2)}px, 0)`;
      }

      const eyeX = nx * 1.4;
      const eyeY = ny * 1.2;
      if (leftEyeRef.current) {
        leftEyeRef.current.style.transform = `translate3d(${eyeX.toFixed(2)}px, ${eyeY.toFixed(2)}px, 0)`;
      }
      if (rightEyeRef.current) {
        rightEyeRef.current.style.transform = `translate3d(${eyeX.toFixed(2)}px, ${eyeY.toFixed(2)}px, 0)`;
      }
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const ratio = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.55)));
      setHeroScrollLift(ratio);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const heroArtSrc = nightMode ? UPLOADED_ASSETS.heroArchNight : UPLOADED_ASSETS.heroArchLight;

  // Slicing greeting
  const visibleGreeting = greetingFull.slice(0, cG);
  const greetingDone = cG >= greetingFull.length;

  // Slicing largest headline: [namePrefix][name] (Line 1 nowrap) + [portfolioPrefix][portfolioWord][portfolioDots]
  const visibleHeadline = headlineFull.slice(0, cH);
  const hNamePrefixLen = copy.namePrefix.length;
  const hNameEnd = hNamePrefixLen + copy.name.length;
  const hPortPrefixEnd = hNameEnd + copy.portfolioPrefix.length;
  const hPortWordEnd = hPortPrefixEnd + copy.portfolioWord.length;

  const segNamePrefix = visibleHeadline.slice(0, hNamePrefixLen);
  const segName = visibleHeadline.slice(hNamePrefixLen, hNameEnd);
  const segPortPrefix = visibleHeadline.slice(hNameEnd, hPortPrefixEnd);
  const segPortWord = visibleHeadline.slice(hPortPrefixEnd, hPortWordEnd);
  const segPortDots = visibleHeadline.slice(hPortWordEnd);

  // Slicing Line 3
  const visibleLine3 = line3Full.slice(0, c3);
  const lenBefore = copy.line3Before.length;
  const lenCuriosity = lenBefore + copy.line3Curiosity.length;
  const lenMid = lenCuriosity + copy.line3Mid.length;
  const lenSteps = lenMid + copy.line3Steps.length;

  const segBefore = visibleLine3.slice(0, lenBefore);
  const segCuriosity = visibleLine3.slice(lenBefore, lenCuriosity);
  const segMid = visibleLine3.slice(lenCuriosity, lenMid);
  const segSteps = visibleLine3.slice(lenMid, lenSteps);
  const segAfter = visibleLine3.slice(lenSteps);

  const isDone = stage === 'done';
  const showHeadline = stage === 'typing-headline' || stage === 'typing-line3' || isDone;
  const showLine3 = stage === 'typing-line3' || isDone;

  // High-contrast ink & highlight colors tailored for both Light and Dark mode
  const baseInk = nightMode ? '#F7F2E8' : '#2D2140';
  const nameHighlightColor = nightMode ? '#DFBDFF' : '#6D32B8';
  const nameHighlightShadow = nightMode
    ? '0 0 18px rgba(196, 148, 255, 0.42)'
    : '0 1px 0 rgba(109, 50, 184, 0.14)';
  const portfolioHighlightColor = nightMode ? '#F7B4A0' : '#C95E4B';
  const curiosityColor = nightMode ? '#DFBDFF' : '#6D32B8';
  const stepsTextColor = nightMode ? '#FFFDF8' : '#2D2140';
  const stepsMarkerBg = nightMode ? 'rgba(233, 168, 160, 0.48)' : 'rgba(233, 168, 160, 0.58)';
  const footstepFill = nightMode ? '#F7C67E' : '#E9A8A0';
  const footstepStroke = nightMode ? '#FFF9F2' : '#5F3B8E';

  return (
    <section
      id="scene-hero"
      className="relative h-[100svh] w-full"
      aria-label="Welcome"
    >
      <div
        className="fixed inset-0 z-0 overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: 'var(--surface-hero)',
          opacity: fixedOpacity,
          pointerEvents: fixedOpacity < 0.15 ? 'none' : 'auto',
        }}
      >
        <div
          ref={bgParallaxRef}
          className="pointer-events-none absolute inset-0 transition-transform duration-150 ease-out"
          style={{ transform: 'scale(1.02)' }}
        >
          <img
            src={heroArtSrc}
            alt="Arched floral window overlooking a storybook castle, books, butterflies, paper plane, and a curious black cat"
            className={`h-full w-full object-cover object-right ${isRtl ? '-scale-x-100' : ''}`}
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background: isRtl
                ? 'linear-gradient(270deg, var(--surface-hero) 0%, color-mix(in srgb, var(--surface-hero) 85%, transparent) 50%, transparent 74%)'
                : 'linear-gradient(90deg, var(--surface-hero) 0%, color-mix(in srgb, var(--surface-hero) 85%, transparent) 50%, transparent 74%)',
            }}
          />
        </div>

        {/* Cat eye tracking overlay */}
        <div
          ref={midParallaxRef}
          className="pointer-events-none hidden lg:block absolute inset-0"
          aria-hidden="true"
        >
          <div
            className="absolute flex gap-1.5"
            style={{
              top: '46.3%',
              left: isRtl ? undefined : '83.55%',
              right: isRtl ? '83.55%' : undefined,
            }}
          >
            <span ref={leftEyeRef} className="block h-1.5 w-1.5 rounded-full bg-[#F4C95D]/85 shadow-[0_0_6px_rgba(244,201,93,0.65)]" />
            <span ref={rightEyeRef} className="block h-1.5 w-1.5 rounded-full bg-[#F4C95D]/85 shadow-[0_0_6px_rgba(244,201,93,0.65)]" />
          </div>
        </div>

        {/* Choreographed Hero Welcome */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-6 sm:px-12 lg:px-20">
          <div
            className="w-full max-w-3xl pt-10 transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(0, ${(-heroScrollLift * 46).toFixed(1)}px, 0)`,
              opacity: Math.max(0, 1 - heroScrollLift * 1.15),
              color: baseInk,
              fontFamily: isRtl ? undefined : '"Agrave Pro", var(--font-display-en)',
            }}
          >
            {/* Greeting line: starts centered & slightly larger, then shrinks & settles smoothly */}
            <p
              className="font-display font-medium tracking-tight transition-all duration-700 ease-[cubic-bezier(0.22,0.8,0.3,1)]"
              style={{
                fontSize: isRtl ? 'clamp(1rem, 1.65vw, 1.38rem)' : 'clamp(1.2rem, 2vw, 1.75rem)',
                color: nightMode ? '#DFD3EE' : '#584673',
                fontFamily: isRtl ? undefined : '"Agrave Pro", var(--font-display-en)',
                transform: greetingSettled
                  ? 'translate3d(0, 0, 0) scale(1)'
                  : 'translate3d(0, 8vh, 0) scale(1.18)',
                transformOrigin: isRtl ? 'right top' : 'left top',
              }}
            >
              <span>{visibleGreeting}</span>
              {greetingDone && (
                <span className="wave-once ms-2" aria-hidden="true">
                  👋
                </span>
              )}
              {stage === 'typing-greeting' && (
                <span className="typewriter-caret" aria-hidden="true" />
              )}
            </p>

            {/* LARGEST Focal Headline: Name on ONE single line + "and this is my portfolio..." */}
            <h1
              className="mt-2 font-display font-bold leading-[1.18] tracking-tight transition-opacity duration-300"
              style={{
                fontSize: isRtl ? 'clamp(1.32rem, 3.05vw, 2.75rem)' : 'clamp(1.36rem, 3.8vw, 3.65rem)',
                fontFamily: isRtl ? undefined : '"Agrave Pro", var(--font-display-en)',
                opacity: showHeadline ? 1 : 0,
              }}
            >
              {/* Single-line Name line */}
              <span className="block whitespace-nowrap">
                <span>{segNamePrefix}</span>
                <span
                  style={{
                    color: nameHighlightColor,
                    textShadow: nameHighlightShadow,
                  }}
                >
                  {segName}
                </span>
                {stage === 'typing-headline' && cH <= hNameEnd && (
                  <span className="typewriter-caret" aria-hidden="true" />
                )}
              </span>

              {/* "and this is my portfolio..." with distinct highlight color & mini confetti */}
              {(cH > hNameEnd || isDone) && (
                <span className="mt-1 block">
                  <span>{segPortPrefix}</span>
                  {segPortWord && (
                    <span className="relative inline-block" style={{ color: portfolioHighlightColor }}>
                      <span>{segPortWord}</span>
                      {showConfetti && (
                        <span
                          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
                          aria-hidden="true"
                        >
                          {CONFETTI_BITS.map((bit, bIdx) => (
                            <span
                              key={bIdx}
                              className="hero-confetti-bit absolute"
                              style={
                                {
                                  '--cx': bit.cx,
                                  '--cy': bit.cy,
                                  '--cr': bit.cr,
                                  animationDelay: bit.delay,
                                } as React.CSSProperties
                              }
                            >
                              {bit.shape === 'circle' ? (
                                <span
                                  className="block h-1.5 w-1.5 rounded-full"
                                  style={{ backgroundColor: bit.color }}
                                />
                              ) : bit.shape === 'star' ? (
                                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
                                  <path
                                    d="M6 0 L7.5 4.5 L12 6 L7.5 7.5 L6 12 L4.5 7.5 L0 6 L4.5 4.5 Z"
                                    fill={bit.color}
                                  />
                                </svg>
                              ) : (
                                <span
                                  className="block h-2 w-1 rounded-[1px]"
                                  style={{ backgroundColor: bit.color }}
                                />
                              )}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  )}
                  <span>{segPortDots}</span>
                  {stage === 'typing-headline' && cH > hNameEnd && (
                    <span className="typewriter-caret" aria-hidden="true" />
                  )}
                </span>
              )}
            </h1>

            {/* Last sentence: smaller than headline, distinct highlight colors, footsteps AFTER the end */}
            <p
              className="mt-4 font-body font-medium leading-[1.58] transition-opacity duration-300"
              style={{
                fontSize: isRtl ? 'clamp(0.95rem, 1.4vw, 1.2rem)' : 'clamp(1.05rem, 1.65vw, 1.42rem)',
                fontFamily: isRtl ? undefined : '"Agrave Pro", var(--font-body-en)',
                opacity: showLine3 ? 1 : 0,
                color: baseInk,
              }}
            >
              <span>{segBefore}</span>

              {segCuriosity && (
                <span
                  className="relative inline-block font-bold"
                  style={{
                    color: curiosityColor,
                    textShadow: nightMode ? '0 0 12px rgba(196, 148, 255, 0.35)' : undefined,
                  }}
                >
                  <span>{segCuriosity}</span>
                  <svg
                    viewBox="0 0 120 14"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute -bottom-1 inset-x-0 h-3 w-full overflow-visible"
                    aria-hidden="true"
                  >
                    <path
                      d="M 2 9 C 34 3, 82 11, 118 5"
                      fill="none"
                      stroke={curiosityColor}
                      strokeWidth="4.2"
                      strokeLinecap="round"
                      strokeDasharray="130"
                      strokeDashoffset={showHighlights ? 0 : 130}
                      style={{ transition: 'stroke-dashoffset 850ms cubic-bezier(0.22,0.8,0.3,1)' }}
                    />
                  </svg>
                </span>
              )}

              <span>{segMid}</span>

              {segSteps && (
                <span className="relative inline-block px-1.5 font-bold" style={{ color: stepsTextColor }}>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0.5 top-1 -z-10 rounded-md transition-transform duration-700 ease-out"
                    style={{
                      backgroundColor: stepsMarkerBg,
                      transformOrigin: isRtl ? 'right center' : 'left center',
                      transform: showHighlights ? 'scaleX(1)' : 'scaleX(0)',
                      transitionDelay: '280ms',
                    }}
                  />
                  {segSteps}
                </span>
              )}

              <span>{segAfter}</span>

              {/* 3 Footsteps placed cleanly at the VERY END after the last sentence, appearing slowly step-by-step */}
              {isDone && (
                <svg
                  viewBox="0 0 64 24"
                  className="ms-2 inline-block h-5 w-14 align-middle overflow-visible drop-shadow-xs"
                  aria-hidden="true"
                >
                  <ellipse
                    cx="10"
                    cy="16"
                    rx="4.4"
                    ry="2.7"
                    transform="rotate(-18 10 16)"
                    fill={footstepFill}
                    stroke={footstepStroke}
                    strokeWidth="1.5"
                    style={{
                      opacity: showHighlights ? 1 : 0,
                      transition: 'opacity 750ms ease 650ms',
                    }}
                  />
                  <ellipse
                    cx="30"
                    cy="8"
                    rx="4.4"
                    ry="2.7"
                    transform="rotate(-12 30 8)"
                    fill={footstepFill}
                    stroke={footstepStroke}
                    strokeWidth="1.5"
                    style={{
                      opacity: showHighlights ? 1 : 0,
                      transition: 'opacity 750ms ease 1100ms',
                    }}
                  />
                  <ellipse
                    cx="50"
                    cy="15"
                    rx="4.4"
                    ry="2.7"
                    transform="rotate(-16 50 15)"
                    fill={footstepFill}
                    stroke={footstepStroke}
                    strokeWidth="1.5"
                    style={{
                      opacity: showHighlights ? 1 : 0,
                      transition: 'opacity 750ms ease 1550ms',
                    }}
                  />
                </svg>
              )}

              {stage === 'typing-line3' && (
                <span className="typewriter-caret" aria-hidden="true" />
              )}
            </p>

            {/* Small pulsing downward arrow icon button ONLY */}
            <div
              className="mt-8 flex items-center transition-all duration-700"
              style={{
                opacity: isDone ? 1 : 0,
                transform: isDone ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
                pointerEvents: isDone ? 'auto' : 'none',
              }}
            >
              <button
                type="button"
                onClick={onStartJourneyClick}
                aria-label={isRtl ? 'انزل تحت' : 'Scroll down'}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-card)]/90 text-[var(--ink-primary)] shadow-sm hover:border-[#A68BC8] hover:scale-105 transition-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A68BC8] animate-pulse"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
