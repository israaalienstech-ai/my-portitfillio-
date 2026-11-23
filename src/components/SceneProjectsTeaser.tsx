import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lang, PORTFOLIO_COPY } from '../data/rebuildContent';
import { KeyedImage, PaperPlaneArt, UPLOADED_ASSETS } from './StorybookVisuals';

gsap.registerPlugin(ScrollTrigger);

interface SceneProjectsTeaserProps {
  lang: Lang;
}

export const SceneProjectsTeaser: React.FC<SceneProjectsTeaserProps> = ({ lang }) => {
  const copy = PORTFOLIO_COPY.projectsTeaser;
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const loopPathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pathEl = loopPathRef.current;
    const planeEl = planeRef.current;
    if (!pathEl || !planeEl) return;

    const total = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = `${total}`;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      pathEl.style.strokeDashoffset = '0';
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const cycle = ((now - start) / 7000) % 1;
      const progress =
        cycle < 0.65
          ? cycle / 0.65
          : cycle < 0.72
          ? 1
          : 1 - (cycle - 0.72) / 0.28;

      const cur = Math.max(0, Math.min(total, total * progress));
      pathEl.style.strokeDashoffset = String(total - cur);

      const pt = pathEl.getPointAtLength(cur);
      const next = pathEl.getPointAtLength(Math.min(total, cur + 3));
      const angle = (Math.atan2(next.y - pt.y, next.x - pt.x) * 180) / Math.PI;
      planeEl.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) rotate(${angle.toFixed(1)}deg)`;
      planeEl.style.opacity = progress < 0.04 ? '0' : '1';

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const connectEl = document.getElementById('scene-connect');
    if (!card || !connectEl) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: connectEl,
            start: 'top 55%',
            end: 'top 12%',
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="scene-projects-teaser"
      ref={sectionRef}
      className="sticky top-0 z-[5] h-[100svh] flex items-center justify-center w-full overflow-hidden paper-grain-surface py-12 sm:py-16 px-5 sm:px-10 lg:px-20 transition-colors duration-300"
      style={{ backgroundColor: 'var(--surface-peach)' }}
      aria-label="Projects being updated teaser"
    >
      <div
        ref={cardRef}
        className="mx-auto w-full max-w-5xl rounded-[32px] border border-[var(--hairline)] bg-[var(--surface-card)]/95 p-6 sm:p-10 shadow-[var(--paper-shadow)]"
      >
        <div className="text-center max-w-xl mx-auto">
          <h2
            className="font-display font-semibold text-[var(--ink-primary)]"
            style={{ fontSize: 'clamp(1.85rem, 3.6vw, 2.75rem)' }}
          >
            <span>{copy.titleBefore[lang]}</span>
            <span className="italic text-[#A68BC8]">{copy.titleAccent[lang]}</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[var(--ink-secondary)]">
            {copy.line[lang]}
          </p>
        </div>

        {/* Clean illustrated workbench teaser */}
        <div className="pointer-events-none relative mt-8 mx-auto max-w-3xl h-64 sm:h-72 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-cream)]/85 overflow-hidden p-4 select-none">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="wall-frame-wash wall-wash-1 h-14 sm:h-16 rounded-xl border border-[#A68BC8]/30" />
            <div className="wall-frame-wash wall-wash-2 h-14 sm:h-16 rounded-xl border border-[#EDA89B]/35" />
            <div className="wall-frame-wash wall-wash-3 h-14 sm:h-16 rounded-xl border border-[#9DB5A0]/35" />
          </div>

          <div className="relative h-40 sm:h-44 flex items-center justify-center">
            <KeyedImage
              src={UPLOADED_ASSETS.skillTools}
              alt="Projects workbench illustration"
              className="h-full w-auto object-contain"
            />
          </div>

          <svg viewBox="0 0 720 260" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <path
              ref={loopPathRef}
              d="M 45 215 C 160 120, 310 230, 445 140 C 550 72, 620 155, 675 75"
              fill="none"
              stroke="#A68BC8"
              strokeWidth="2.5"
              strokeDasharray="5 9"
              strokeLinecap="round"
            />
          </svg>

          <div ref={planeRef} className="absolute top-0 left-0 -ml-5 -mt-4">
            <PaperPlaneArt className="h-8 w-11" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes softWashLoop {
          0%, 100% { background-color: rgba(255, 249, 242, 0.45); }
          40% { background-color: rgba(166, 139, 200, 0.22); }
          70% { background-color: rgba(237, 168, 155, 0.16); }
        }
        .wall-frame-wash { animation: softWashLoop 6.5s ease-in-out infinite; }
        .wall-wash-2 { animation-delay: 2.1s; }
        .wall-wash-3 { animation-delay: 4.2s; }
      `}</style>
    </section>
  );
};
