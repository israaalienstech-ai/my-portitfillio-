import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Lang, PORTFOLIO_COPY } from '../data/rebuildContent';
import { GateLanternArt, UPLOADED_ASSETS } from './StorybookVisuals';
import { soundSystem } from '../utils/soundSystem';

interface SceneDarkGateProps {
  lang: Lang;
  onUnlockStart: () => void;
  onGateComplete: () => void;
  onSkipIntro: () => void;
}

export const SceneDarkGate: React.FC<SceneDarkGateProps> = ({
  lang,
  onUnlockStart,
  onGateComplete,
  onSkipIntro,
}) => {
  const isRtl = lang === 'ar';
  const copy = PORTFOLIO_COPY.gate;

  const rootRef = useRef<HTMLDivElement>(null);
  const lanternGroupRef = useRef<HTMLDivElement>(null);
  const cordStretchRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const maskLayerRef = useRef<HTMLDivElement>(null);
  const pointerGlowRef = useRef<HTMLDivElement>(null);

  const [interacted, setInteracted] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const draggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const pointerPosRef = useRef({ x: 0.5, y: 0.5 });
  const currentPosRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSkip(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (unlocked) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    const startTime = performance.now();

    const handlePointerMove = (e: PointerEvent) => {
      if (!interacted) setInteracted(true);
      pointerPosRef.current = {
        x: e.clientX / Math.max(1, window.innerWidth),
        y: e.clientY / Math.max(1, window.innerHeight),
      };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      currentPosRef.current.x += (pointerPosRef.current.x - currentPosRef.current.x) * 0.15;
      currentPosRef.current.y += (pointerPosRef.current.y - currentPosRef.current.y) * 0.15;

      const px = currentPosRef.current.x * 100;
      const py = currentPosRef.current.y * 100;

      const baseX = isRtl ? 15 : 85;
      let swayDeg = 0;
      let flicker = 0.94;

      if (!reduced) {
        swayDeg =
          Math.sin((elapsed * Math.PI * 2) / 5.5) * 5.6 +
          Math.sin((elapsed * Math.PI * 2) / 3.1) * 0.7;
        flicker =
          0.92 +
          Math.sin(elapsed * 7.3) * 0.04 +
          Math.cos(elapsed * 11.9) * 0.035;
      }

      if (lanternGroupRef.current && !draggingRef.current) {
        lanternGroupRef.current.style.transform = `rotate(${swayDeg.toFixed(2)}deg)`;
      }
      if (haloRef.current) {
        haloRef.current.style.opacity = String(Math.max(0.85, Math.min(1, flicker)));
      }

      const lanternSpotX = baseX - Math.sin((swayDeg * Math.PI) / 180) * 5.2;
      const lanternSpotY = 23;

      if (maskLayerRef.current) {
        const maskVal = `radial-gradient(115px circle at ${px.toFixed(2)}% ${py.toFixed(2)}%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0) 100%), radial-gradient(240px circle at ${lanternSpotX.toFixed(2)}% ${lanternSpotY}%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0) 100%)`;
        maskLayerRef.current.style.maskImage = maskVal;
        maskLayerRef.current.style.webkitMaskImage = maskVal;
      }

      if (pointerGlowRef.current) {
        pointerGlowRef.current.style.background = `radial-gradient(105px circle at ${px.toFixed(2)}% ${py.toFixed(2)}%, rgba(244, 201, 93, 0.12) 0%, rgba(244, 201, 93, 0.03) 55%, transparent 100%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isRtl, unlocked, interacted]);

  const triggerPullSequence = () => {
    if (unlocked || pulling) return;
    setInteracted(true);
    setPulling(true);
    setDragOffset(0);
    soundSystem.lanternPull();
    onUnlockStart();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setUnlocked(true);
      onGateComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setUnlocked(true);
        onGateComplete();
      },
    });

    if (cordStretchRef.current) {
      tl.fromTo(
        cordStretchRef.current,
        { y: 18 },
        { y: 0, duration: 0.45, ease: 'elastic.out(1, 0.45)' },
        0,
      );
    }

    if (haloRef.current) {
      tl.to(
        haloRef.current,
        { scale: 3, opacity: 1, duration: 0.35, ease: 'power2.out' },
        0.04,
      );
    }

    if (bloomRef.current) {
      tl.fromTo(
        bloomRef.current,
        { scale: 0.05, opacity: 0.85 },
        { scale: 26, opacity: 1, duration: 1.75, ease: 'cubic-bezier(0.22,0.8,0.3,1)' },
        0.15,
      );
    }

    if (rootRef.current) {
      tl.to(
        rootRef.current,
        { opacity: 0, duration: 0.9, ease: 'power2.inOut' },
        0.95,
      );
    }
  };

  const handleCordPointerDown = (e: React.PointerEvent) => {
    if (unlocked || pulling) return;
    setInteracted(true);
    draggingRef.current = true;
    dragStartYRef.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleCordPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const rawDelta = Math.max(0, Math.min(48, e.clientY - dragStartYRef.current));
    setDragOffset(Math.min(40, rawDelta * 0.85));
  };

  const handleCordPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    triggerPullSequence();
  };

  const handleCordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerPullSequence();
    }
  };

  if (unlocked) return null;

  return (
    <section
      ref={rootRef}
      aria-label="Opening dark gate"
      className="fixed inset-0 z-50 overflow-hidden bg-[#0B0814] text-[#F5EFE0] select-none"
    >
      {/* Hidden night scene revealed inside lantern & pointer pools */}
      <div
        ref={maskLayerRef}
        className="pointer-events-none absolute inset-0"
        style={{
          maskComposite: 'add',
          WebkitMaskComposite: 'source-over',
        }}
      >
        <img
          src={UPLOADED_ASSETS.gateNightScene}
          alt="Moonlit storybook world hidden in darkness"
          className={`h-full w-full object-cover opacity-85 ${isRtl ? '-scale-x-100' : ''}`}
          draggable={false}
        />
      </div>

      <div ref={pointerGlowRef} className="pointer-events-none absolute inset-0" />

      {/* Hanging lantern matching reference screenshot */}
      <div
        className={`absolute top-0 ${isRtl ? 'left-6 sm:left-16 md:left-24' : 'right-6 sm:right-16 md:right-24'} z-20 flex flex-col items-center`}
      >
        <div
          ref={lanternGroupRef}
          className="origin-top flex flex-col items-center cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[#F4C95D] rounded-xl"
          role="button"
          tabIndex={0}
          aria-label={copy.button[lang]}
          onPointerDown={handleCordPointerDown}
          onPointerMove={handleCordPointerMove}
          onPointerUp={handleCordPointerUp}
          onKeyDown={handleCordKeyDown}
        >
          <svg
            width="24"
            height={112 + dragOffset}
            viewBox={`0 0 24 ${112 + dragOffset}`}
            className="overflow-visible transition-[height] duration-75"
            aria-hidden="true"
          >
            <path
              d={`M 12 0 C 11 ${40 + dragOffset * 0.4}, 13 ${80 + dragOffset * 0.7}, 12 ${112 + dragOffset}`}
              fill="none"
              stroke="#E4D8F0"
              strokeOpacity="0.85"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <div
            ref={cordStretchRef}
            className="relative -mt-2 flex flex-col items-center"
            style={{ transform: `translate3d(0, ${dragOffset}px, 0)` }}
          >
            <div
              ref={haloRef}
              className="pointer-events-none absolute -inset-12 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(244,201,93,0.48) 0%, rgba(244,201,93,0.18) 45%, transparent 74%)',
              }}
            />

            <div
              ref={bloomRef}
              className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
              style={{
                background:
                  'radial-gradient(circle, #F5EFE0 0%, #FBEEE1 42%, rgba(244,201,93,0.55) 75%, transparent 100%)',
              }}
            />

            <div className="pointer-events-none absolute -top-6 inset-x-0 flex justify-center" aria-hidden="true">
              <span className="ember-dot ember-1" />
              <span className="ember-dot ember-2" />
              <span className="ember-dot ember-3" />
            </div>

            <GateLanternArt className="relative z-10 h-28 w-20 sm:h-32 sm:w-22 drop-shadow-[0_0_24px_rgba(244,201,93,0.45)]" />
          </div>
        </div>

        {/* Tooltip pill matching reference screenshot */}
        <p
          className="mt-3 rounded-full border border-[#A68BC8]/35 bg-[#2D2140]/92 px-4 py-1.5 text-center text-xs sm:text-sm font-medium text-[#F5EFE0] shadow-md transition-opacity duration-500 whitespace-nowrap"
          style={{ opacity: interacted ? 0 : 1 }}
        >
          {copy.tooltip[lang]}
        </p>
      </div>

      {/* Centered dark gate prompt & delayed skip */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center pointer-events-none">
        <p className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-[#F5EFE0]">
          {copy.line1[lang]}
        </p>
        <p className="mt-3 font-body text-lg sm:text-2xl text-[#DCD0EB]/90">
          {copy.line2[lang]}
        </p>

        <button
          type="button"
          onClick={() => {
            soundSystem.unlock();
            onSkipIntro();
          }}
          className="pointer-events-auto mt-8 text-sm text-[#A997C4]/85 underline underline-offset-4 hover:text-[#F5EFE0] transition-opacity duration-500"
          style={{ opacity: showSkip ? 1 : 0 }}
        >
          {copy.skip[lang]}
        </button>
      </div>

      <style>{`
        .ember-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: #F4C95D;
          opacity: 0;
        }
        .ember-1 { left: 25%; animation: emberUp 3.2s cubic-bezier(.45,0,.2,1) infinite; }
        .ember-2 { left: 52%; animation: emberUp 4.1s cubic-bezier(.45,0,.2,1) 0.9s infinite; }
        .ember-3 { left: 72%; animation: emberUp 3.6s cubic-bezier(.45,0,.2,1) 1.7s infinite; }
        @keyframes emberUp {
          0% { transform: translate3d(0, 14px, 0) scale(0.7); opacity: 0; }
          25% { opacity: 0.75; }
          100% { transform: translate3d(6px, -36px, 0) scale(0.3); opacity: 0; }
        }
      `}</style>
    </section>
  );
};
