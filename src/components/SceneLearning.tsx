import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, X } from 'lucide-react';
import {
  COURSE_BOOKS,
  CourseBookItem,
  Lang,
  PORTFOLIO_COPY,
} from '../data/rebuildContent';
import { soundSystem } from '../utils/soundSystem';

gsap.registerPlugin(ScrollTrigger);

interface SceneLearningProps {
  lang: Lang;
  onDebugUpdate: (progress: number, beat: string) => void;
}

const BOOK_HEIGHTS = [274, 296, 266, 290, 278];
const BOOK_TILTS = [-1.4, 0.8, -0.5, 1.5, -1.1];

export const SceneLearning: React.FC<SceneLearningProps> = ({ lang, onDebugUpdate }) => {
  const isRtl = lang === 'ar';
  const copy = PORTFOLIO_COPY.learning;

  const sectionRef = useRef<HTMLElement>(null);
  const bookRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [openBook, setOpenBook] = useState<CourseBookItem | null>(null);
  const thudPlayedRef = useRef(false);

  useEffect(() => {
    if (!openBook) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenBook(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openBook]);

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top 72%',
          end: 'bottom 82%',
          scrub: 0.8,
          onUpdate: (self) => {
            if (self.progress > 0.25 && !thudPlayedRef.current && self.direction > 0) {
              thudPlayedRef.current = true;
              COURSE_BOOKS.forEach((_, idx) => {
                window.setTimeout(() => soundSystem.bookThud(idx), idx * 95);
              });
            }
            onDebugUpdate(self.progress, 'courses-bookshelf');
          },
        },
      });

      bookRefs.current.forEach((bookEl, idx) => {
        if (!bookEl) return;
        tl.fromTo(
          bookEl,
          { opacity: 0, y: 28, rotate: BOOK_TILTS[idx] * 2 },
          {
            opacity: 1,
            y: 0,
            rotate: BOOK_TILTS[idx],
            duration: 0.28,
            ease: 'back.out(1.25)',
          },
          0.08 + idx * 0.08,
        );
      });
    }, sec);

    return () => ctx.revert();
  }, [onDebugUpdate]);

  const hoveredBook = COURSE_BOOKS.find((b) => b.id === hoveredBookId) ?? null;

  return (
    <section
      id="scene-learning"
      ref={sectionRef}
      className="relative z-10 w-full paper-grain-surface py-24 sm:py-32 px-5 sm:px-10 lg:px-20 transition-colors duration-300"
      style={{ backgroundColor: 'var(--surface-cream)' }}
      aria-label="My courses"
    >
      <div className="mx-auto max-w-5xl flex flex-col items-center">
        <h2
          className="font-display font-semibold text-center text-[var(--ink-primary)]"
          style={{ fontSize: 'clamp(2rem, 3.8vw, 3.1rem)' }}
        >
          <span>{copy.coursesTitleBefore[lang]}</span>
          <span className="italic text-[#E7907A]">{copy.coursesTitleAccent[lang]}</span>
        </h2>

        {/* Tactile Wooden Bookshelf with Slim Tall Book Spines */}
        <div
          className="relative mt-12 w-full rounded-[30px] border border-[var(--hairline)] bg-[var(--surface-card)]/95 px-4 sm:px-10 pt-12 pb-10 shadow-[var(--paper-shadow)] overflow-hidden"
          onMouseLeave={() => setHoveredBookId(null)}
        >
          {/* Slim vertical spines standing naturally side-by-side */}
          <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-end justify-center gap-3 sm:gap-5 md:gap-7 pb-0">
            {COURSE_BOOKS.map((book, idx) => {
              const isHovered = hoveredBookId === book.id;
              const isDimmed = Boolean(hoveredBookId && hoveredBookId !== book.id);
              const baseHeight = BOOK_HEIGHTS[idx] ?? 280;
              const baseTilt = BOOK_TILTS[idx] ?? 0;

              return (
                <button
                  key={book.id}
                  ref={(el) => { bookRefs.current[idx] = el; }}
                  type="button"
                  onMouseEnter={() => setHoveredBookId(book.id)}
                  onClick={() => {
                    soundSystem.popupRustle();
                    setOpenBook(book);
                  }}
                  aria-label={book.title}
                  className="group relative flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A68BC8] transition-all duration-300 ease-[cubic-bezier(0.34,1.3,0.5,1)]"
                  style={{
                    opacity: isDimmed ? 0.56 : 1,
                    transform: isHovered
                      ? `translate3d(0, -18px, 0) rotate(${isRtl ? -2.5 : 2.5}deg) scale(1.04)`
                      : `translate3d(0, 0, 0) rotate(${baseTilt}deg)`,
                  }}
                >
                  {/* Slim tall standing book spine */}
                  <div
                    className="relative w-[62px] sm:w-[74px] md:w-[82px] rounded-t-xl rounded-b-[4px] border border-[#2D2140]/15 shadow-lg flex flex-col items-center justify-between py-4 px-2 overflow-hidden"
                    style={{
                      height: `${baseHeight}px`,
                      backgroundColor: book.spineColor,
                      boxShadow: isHovered
                        ? '0 20px 30px -12px rgba(45, 33, 64, 0.35), inset -4px 0 10px rgba(45,33,64,0.12)'
                        : '0 10px 18px -10px rgba(45, 33, 64, 0.28), inset -4px 0 8px rgba(45,33,64,0.1)',
                    }}
                  >
                    {/* Top cloth rib lines */}
                    <div className="w-full space-y-1.5">
                      <div className="h-[2px] w-full bg-[#FFF9F2]/45 rounded-full" />
                      <div className="h-[1.5px] w-3/4 mx-auto bg-[#2D2140]/20 rounded-full" />
                    </div>

                    {/* Vertical English Course Title */}
                    <div
                      dir="ltr"
                      className="flex-1 flex flex-col items-center justify-center py-2 overflow-hidden"
                    >
                      <span
                        className="font-display text-[17px] sm:text-[19px] font-bold tracking-wide text-[#2D2140] whitespace-nowrap select-none"
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                        }}
                      >
                        {book.title}
                      </span>
                    </div>

                    {/* Bottom index + subtle provider mark */}
                    <div className="w-full flex flex-col items-center gap-1.5 border-t border-[#2D2140]/20 pt-2.5 text-[#2D2140]/80">
                      {book.provider && (
                        <span className="text-[10px] font-bold leading-none text-[#2D2140]/90 whitespace-nowrap">
                          {book.provider[lang]}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold tracking-wider">0{idx + 1}</span>
                        <BookOpen className="h-3.5 w-3.5 opacity-75" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Warm tactile wooden shelf ledge */}
          <div
            className="relative z-20 mx-auto h-4 w-full max-w-3xl rounded-full shadow-md"
            style={{
              background: 'linear-gradient(180deg, #D5B391 0%, #B38A62 65%, #936C49 100%)',
            }}
            aria-hidden="true"
          />

          {/* Subtle active title preview ribbon underneath shelf */}
          <div className="mt-5 min-h-[28px] text-center">
            {hoveredBook && (
              <p dir="ltr" className="font-display text-lg font-semibold text-[var(--ink-primary)] transition-opacity duration-200">
                {hoveredBook.title}
                {hoveredBook.provider ? ` · ${hoveredBook.provider[lang]}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Opened Book Paper Note */}
      {openBook && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-[#0B0814]/40"
          role="dialog"
          aria-modal="true"
          aria-label={openBook.title}
          onClick={() => setOpenBook(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="paper-grain-surface relative w-full max-w-lg rounded-t-3xl md:rounded-[26px] border border-[var(--hairline)] bg-[var(--surface-card)] p-6 sm:p-8 shadow-[var(--paper-shadow-lg)]"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--ink-muted)]/30 md:hidden" />

            <div className="flex items-start justify-between gap-4 border-b border-[var(--hairline)] pb-4">
              <div>
                <h3 dir="ltr" className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink-primary)]">
                  {openBook.title}
                </h3>
                {openBook.provider?.[lang] && (
                  <p className="mt-1.5 text-base font-medium text-[#A68BC8]">
                    {openBook.provider[lang]}
                  </p>
                )}
                {openBook.year && (
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">{openBook.year}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOpenBook(null)}
                aria-label={PORTFOLIO_COPY.experiences.closeLabel[lang]}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-cream)] text-[var(--ink-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {openBook.note?.[lang] && (
              <p className="mt-4 text-base leading-relaxed text-[var(--ink-secondary)]">
                {openBook.note[lang]}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
