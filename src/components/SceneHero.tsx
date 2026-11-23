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

  const line3Full = `${copy.line3Before}${copy.line3Curiosity}${copy.line3Mid}${copy.line3Steps}${copy.line3After}`;
  const fullText = `${copy.line1}\n${copy.line2}\n${line3Full}`;

  const hasCompletedOnceRef = useRef(false);
  const [typedCount, setTypedCount] = useState(0);
  const [typingStage, setTypingStage] = useState<'idle' | 'typing' | 'done'>('idle');
  const [showHighlights, setShowHighlights] = useState(false);
  const [heroScrollLift, setHeroScrollLift] = useState(0);

  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const midParallaxRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLSpanElement>(null);
  const rightEyeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!gateComplete) return;

    if (skipTyping || reduced || hasCompletedOnceRef.current) {
      hasCompletedOnceRef.current = true;
      setTypedCount(fullText.length);
      setTypingStage('done');
      setShowHighlights(true);
      onNameLanded();
      onIntroComplete();
      return;
    }

    let cancelled = false;
    let idx = 0;
    let timerId = 0;
    let highlightTimer = 0;

    setTypedCount(0);
    setTypingStage('typing');
    setShowHighlights(false);

    const step = () => {
      if (cancelled) return;
      idx += 1;
      setTypedCount(idx);
      if (idx % 3 === 1) soundSystem.typewriterTick();

      if (idx < fullText.length) {
        const ch = fullText[idx - 1];
        const delay = ch === '\n' ? 210 : 28;
        timerId = window.setTimeout(step, delay);
      } else {
        timerId = window.setTimeout(() => {
          if (cancelled) return;
          hasCompletedOnceRef.current = true;
          setTypingStage('done');
          onNameLanded();
          soundSystem.nameLand();
          onIntroComplete();
          highlightTimer = window.setTimeout(() => {
            if (!cancelled) setShowHighlights(true);
          }, 160);
        }, 180);
      }
    };

    timerId = window.setTimeout(step, 140);

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
      window.clearTimeout(highlightTimer);
    };
  }, [gateComplete, skipTyping, fullText, onNameLanded, onIntroComplete]);

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
  const visibleSlice = fullText.slice(0, typedCount);
  const parts = visibleSlice.split('\n');
  const visibleLine1 = parts[0] ?? '';
  const visibleLine2 = parts[1] ?? '';
  const visibleLine3 = parts[2] ?? '';

  const line1Complete = typedCount >= copy.line1.length;
  const isDone = typingStage === 'done';

  // Slice line 3 into annotated segments while preserving typing flow
  const lenBefore = copy.line3Before.length;
  const lenCuriosity = lenBefore + copy.line3Curiosity.length;
  const lenMid = lenCuriosity + copy.line3Mid.length;
  const lenSteps = lenMid + copy.line3Steps.length;

  const segBefore = visibleLine3.slice(0, lenBefore);
  const segCuriosity = visibleLine3.slice(lenBefore, lenCuriosity);
  const segMid = visibleLine3.slice(lenCuriosity, lenMid);
  const segSteps = visibleLine3.slice(lenMid, lenSteps);
  const segAfter = visibleLine3.slice(lenSteps);

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
                ? 'linear-gradient(270deg, var(--surface-hero) 0%, color-mix(in srgb, var(--surface-hero) 78%, transparent) 46%, transparent 70%)'
                : 'linear-gradient(90deg, var(--surface-hero) 0%, color-mix(in srgb, var(--surface-hero) 78%, transparent) 46%, transparent 70%)',
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

        {/* Minimal 3-line Welcome + pulsing arrow icon button ONLY */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-6 sm:px-12 lg:px-20">
          <div
            className="max-w-2xl pt-10 transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(0, ${(-heroScrollLift * 46).toFixed(1)}px, 0)`,
              opacity: Math.max(0, 1 - heroScrollLift * 1.15),
            }}
          >
            <h1
              className="font-display font-bold leading-[1.22] tracking-tight text-[var(--ink-primary)]"
              style={{ fontSize: isRtl ? 'clamp(2.1rem, 4.1vw, 3.6rem)' : 'clamp(2.2rem, 4.3vw, 3.9rem)' }}
            >
              {/* Line 1: Hello! I'm Esraa El Labban 👋 (no highlight on name, 👋 waves once) */}
              <span className="block">
                <span>{visibleLine1}</span>
                {line1Complete && (
                  <span className="wave-once ms-2" aria-hidden="true">
                    👋
                  </span>
                )}
                {typingStage === 'typing' && parts.length === 1 && (
                  <span className="typewriter-caret" aria-hidden="true" />
                )}
              </span>

              {/* Line 2 */}
              {(parts.length >= 2 || isDone) && (
                <span className="mt-2 block font-semibold text-[var(--ink-secondary)]">
                  <span>{visibleLine2}</span>
                  {typingStage === 'typing' && parts.length === 2 && (
                    <span className="typewriter-caret" aria-hidden="true" />
                  )}
                </span>
              )}

              {/* Line 3 with Curiosity underline (#7a4fb0) and Steps pink marker (#e9a8a0) + 3 footsteps */}
              {(parts.length >= 3 || isDone) && (
                <span
                  className="mt-3 block font-normal text-[var(--ink-primary)]"
                  style={{ fontSize: isRtl ? 'clamp(1.45rem, 2.7vw, 2.35rem)' : 'clamp(1.45rem, 2.8vw, 2.45rem)' }}
                >
                  <span>{segBefore}</span>

                  {segCuriosity && (
                    <span className="relative inline-block font-semibold">
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
                          stroke="#7a4fb0"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeDasharray="130"
                          strokeDashoffset={showHighlights ? 0 : 130}
                          style={{ transition: 'stroke-dashoffset 650ms cubic-bezier(0.22,0.8,0.3,1)' }}
                        />
                      </svg>
                    </span>
                  )}

                  <span>{segMid}</span>

                  {segSteps && (
                    <span className="relative inline-flex items-center">
                      <span className="relative inline-block px-1 font-semibold">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0.5 top-1.5 -z-10 rounded-md transition-transform duration-500 ease-out"
                          style={{
                            backgroundColor: 'rgba(233, 168, 160, 0.52)',
                            transformOrigin: isRtl ? 'right center' : 'left center',
                            transform: showHighlights ? 'scaleX(1)' : 'scaleX(0)',
                            transitionDelay: '220ms',
                          }}
                        />
                        {segSteps}
                      </span>

                      {/* Three tiny hand-drawn footsteps */}
                      <svg
                        viewBox="0 0 46 20"
                        className="ms-1.5 inline-block h-4 w-9 shrink-0 overflow-visible"
                        aria-hidden="true"
                        style={{
                          opacity: showHighlights ? 1 : 0,
                          transform: showHighlights ? 'translate3d(0,0,0)' : 'translate3d(-4px,2px,0)',
                          transition: 'opacity 450ms ease 480ms, transform 450ms ease 480ms',
                        }}
                      >
                        <ellipse cx="7" cy="13" rx="3.1" ry="1.9" transform="rotate(-18 7 13)" fill="#e9a8a0" stroke="#7a4fb0" strokeWidth="1" />
                        <ellipse cx="21" cy="7" rx="3.1" ry="1.9" transform="rotate(-12 21 7)" fill="#e9a8a0" stroke="#7a4fb0" strokeWidth="1" />
                        <ellipse cx="36" cy="12" rx="3.1" ry="1.9" transform="rotate(-16 36 12)" fill="#e9a8a0" stroke="#7a4fb0" strokeWidth="1" />
                      </svg>
                    </span>
                  )}

                  <span>{segAfter}</span>
                  {typingStage === 'typing' && parts.length >= 3 && (
                    <span className="typewriter-caret" aria-hidden="true" />
                  )}
                </span>
              )}
            </h1>

            {/* Small pulsing downward arrow icon button ONLY — no text label */}
            <div
              className="mt-10 flex items-center transition-all duration-700"
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-card)]/90 text-[var(--ink-primary)] shadow-sm hover:border-[#7a4fb0] hover:scale-105 transition-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7a4fb0] animate-pulse"
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
