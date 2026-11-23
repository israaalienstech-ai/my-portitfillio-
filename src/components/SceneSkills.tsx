import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  EXPERIENCE_COLORS,
  Lang,
  PORTFOLIO_COPY,
  SKILL_GROUPS,
  SKILL_LEVEL_LABELS,
  SkillEntryItem,
} from '../data/rebuildContent';
import {
  PuzzlePieceArt,
  PuzzlePocketArt,
} from './StorybookVisuals';
import { soundSystem } from '../utils/soundSystem';

gsap.registerPlugin(ScrollTrigger);

interface SceneSkillsProps {
  lang: Lang;
  onDebugUpdate: (progress: number, beat: string) => void;
}

const FOUR_PIECES = [
  { color: '#A68BC8', label: 'FERTICAL', rowX: -126, burstX: -460, burstY: -220, rot: -16 },
  { color: '#E7907A', label: 'CVeeeZ', rowX: -42, burstX: -190, burstY: -310, rot: 12 },
  { color: '#9DB5A0', label: 'X-FUSE', rowX: 42, burstX: 210, burstY: -290, rot: -10 },
  { color: '#E3B26E', label: 'Career CV', rowX: 126, burstX: 460, burstY: -210, rot: 18 },
];

export const SceneSkills: React.FC<SceneSkillsProps> = ({ lang, onDebugUpdate }) => {
  const isRtl = lang === 'ar';
  const copy = PORTFOLIO_COPY.skillsSlide;

  const outerRef = useRef<HTMLElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const heroPocketRef = useRef<HTMLDivElement>(null);
  const assemblyLabelRef = useRef<HTMLDivElement>(null);
  const fourPieceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelsSlideRef = useRef<HTMLDivElement>(null);
  const panelsInnerRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pieceItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [activeSkill, setActiveSkill] = useState<{
    groupId: string;
    item: SkillEntryItem;
    rect: { x: number; y: number };
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const triggeredRef = useRef({
    complete: false,
    burst: false,
  });

  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            let beat = 'pocket-grow';

            if (p >= 0.12 && p < 0.36) {
              beat = 'gather-4-pieces';
            } else if (p >= 0.36 && p < 0.45) {
              beat = 'my-skills-complete';
              if (!triggeredRef.current.complete && self.direction > 0) {
                triggeredRef.current.complete = true;
                soundSystem.skillComplete();
              }
            } else if (p >= 0.45 && p < 0.55) {
              beat = 'burst-reveal-skills';
              if (!triggeredRef.current.burst && self.direction > 0) {
                triggeredRef.current.burst = true;
                soundSystem.burstShimmer();
              }
            } else if (p >= 0.55 && p < 0.76) {
              beat = 'puzzle-assemble-row-1';
            } else if (p >= 0.76) {
              beat = 'puzzle-assemble-row-2';
            }

            onDebugUpdate(p, beat);
          },
        },
      });

      // Phase 1: Pocket enters & grows centered
      if (heroPocketRef.current) {
        tl.fromTo(
          heroPocketRef.current,
          { scale: 0.65, y: 120, opacity: 0 },
          { scale: 1.45, y: 18, opacity: 1, duration: 0.13, ease: 'back.out(1.4)' },
          0,
        );
        tl.to(
          heroPocketRef.current,
          { scale: 0.9, y: 95, opacity: 0, duration: 0.1, ease: 'power2.in' },
          0.18,
        );
      }

      // Phase 2: 4 puzzle pieces rise side-by-side & Phase 3 burst
      fourPieceRefs.current.forEach((pieceEl, i) => {
        const spec = FOUR_PIECES[i];
        if (!pieceEl || !spec) return;
        const startAt = 0.11 + i * 0.03;

        tl.fromTo(
          pieceEl,
          { x: (i - 1.5) * 14, y: 65, scale: 0.35, rotation: spec.rot * 1.8, opacity: 0 },
          {
            x: spec.rowX,
            y: 26,
            scale: 1.15,
            rotation: 0,
            opacity: 1,
            duration: 0.14,
            ease: 'back.out(1.4)',
          },
          startAt,
        );

        tl.to(
          pieceEl,
          {
            x: spec.burstX,
            y: spec.burstY,
            scale: 0.3,
            rotation: spec.rot * 2.5,
            opacity: 0,
            duration: 0.11,
            ease: 'power2.in',
          },
          0.44 + i * 0.012,
        );
      });

      if (assemblyLabelRef.current) {
        tl.fromTo(
          assemblyLabelRef.current,
          { y: -38, scale: 0.86, opacity: 0 },
          { y: -56, scale: 1, opacity: 1, duration: 0.13, ease: 'power2.out' },
          0.21,
        );
        tl.to(
          assemblyLabelRef.current,
          { y: -88, scale: 1.08, opacity: 0, duration: 0.09, ease: 'power2.in' },
          0.44,
        );
      }

      // Phase 4: Reveal Skills Slide — NO inner scroll
      if (panelsSlideRef.current) {
        tl.fromTo(
          panelsSlideRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' },
          0.49,
        );
      }

      // Row 1 groups (Soft, Hard) arrive first, then Row 2 (Technical, Tools) on main scroll
      [0, 1].forEach((idx) => {
        const grp = groupRefs.current[idx];
        if (!grp) return;
        tl.fromTo(
          grp,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'back.out(1.25)' },
          0.51 + idx * 0.025,
        );
      });

      [2, 3].forEach((idx) => {
        const grp = groupRefs.current[idx];
        if (!grp) return;
        tl.fromTo(
          grp,
          { opacity: 0, y: 26, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: 'back.out(1.25)' },
          0.7 + (idx - 2) * 0.03,
        );
      });

      // One-by-one puzzle piece assembly across all 4 groups
      const orderedSkillIds = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => s.id));
      const totalItems = orderedSkillIds.length;
      orderedSkillIds.forEach((skillId, sIdx) => {
        const btn = pieceItemRefs.current[skillId];
        if (!btn) return;
        const slot = 0.54 + (sIdx / Math.max(1, totalItems - 1)) * 0.36;
        tl.fromTo(
          btn,
          { opacity: 0, scale: 0.55, y: 14, rotation: sIdx % 2 === 0 ? -5 : 5 },
          { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.045, ease: 'back.out(1.6)' },
          slot,
        );
      });

      // Dynamic outer translateY on scroll so Row 2 fits cleanly on all screen heights without internal scrolling
      const stageH = stageContainerRef.current?.clientHeight ?? window.innerHeight;
      const innerH = panelsInnerRef.current?.scrollHeight ?? stageH;
      const overflowPx = Math.max(0, innerH - stageH + 72);
      const isCompact = window.innerWidth < 1024 || overflowPx > 16;

      if (panelsInnerRef.current) {
        const startY = isCompact ? 12 : 42;
        const endY = isCompact ? -overflowPx : 0;
        tl.fromTo(
          panelsInnerRef.current,
          { y: startY },
          { y: endY, duration: 0.25, ease: 'power2.inOut' },
          0.69,
        );
      }
    }, outer);

    return () => ctx.revert();
  }, [onDebugUpdate]);

  const handleActivate = (groupId: string, item: SkillEntryItem, el: HTMLElement) => {
    const gridRect = gridRef.current?.getBoundingClientRect();
    const chipRect = el.getBoundingClientRect();
    if (!gridRect) return;
    setActiveSkill({
      groupId,
      item,
      rect: {
        x: chipRect.left - gridRect.left + chipRect.width / 2,
        y: chipRect.top - gridRect.top,
      },
    });
  };

  return (
    <section
      id="scene-skills"
      ref={outerRef}
      className="relative z-10 h-[430svh] w-full paper-grain-surface"
      style={{ backgroundColor: 'var(--surface-peach)' }}
      aria-label="Skills puzzle assembly"
    >
      <div ref={stageContainerRef} className="sticky-stage">
        <div className="relative flex h-full w-full max-w-[1380px] mx-auto items-start justify-center px-5 sm:px-10 lg:px-14 overflow-hidden">
          {/* Pocket -> 4 Colored Puzzle Pieces -> "my skills" */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
            aria-hidden="true"
          >
            <div ref={heroPocketRef} className="relative flex flex-col items-center">
              <span
                className="absolute -inset-8 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(244,201,93,0.45) 0%, rgba(166,139,200,0.28) 55%, transparent 72%)',
                }}
              />
              <PuzzlePocketArt className="relative h-24 w-24 sm:h-28 sm:w-28 drop-shadow-lg" />
              <span dir="ltr" className="relative mt-2 font-display italic text-base sm:text-lg font-semibold text-[var(--ink-primary)]">
                {PORTFOLIO_COPY.experiences.pocketLabel}
              </span>
            </div>

            <div
              ref={assemblyLabelRef}
              dir="ltr"
              className="absolute font-display italic font-bold text-[var(--ink-primary)] select-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.4rem)' }}
            >
              {copy.assemblyLabel}
            </div>

            {FOUR_PIECES.map((piece, idx) => (
              <div
                key={piece.label}
                ref={(el) => { fourPieceRefs.current[idx] = el; }}
                className="absolute"
                style={{
                  filter: `drop-shadow(0 0 14px ${piece.color})`,
                }}
              >
                <PuzzlePieceArt color={piece.color} className="h-14 w-14 sm:h-16 sm:w-16" />
              </div>
            ))}
          </div>

          {/* 4-Group Puzzle Grid (Soft, Hard, Technical, Tools) — ZERO internal scrollbar */}
          <div
            ref={panelsSlideRef}
            className="relative z-10 w-full pt-8 sm:pt-12 pb-10"
          >
            <div ref={panelsInnerRef} className="w-full">
              <div className="text-center max-w-2xl mx-auto mb-5">
                <h2
                  className="font-display font-semibold text-[var(--ink-primary)]"
                  style={{ fontSize: 'clamp(1.65rem, 3.2vw, 2.7rem)' }}
                >
                  <span>{copy.titleBefore[lang]}</span>
                  <span className="italic text-[#A68BC8]">{copy.titleAccent[lang]}</span>
                  <span>{copy.titleAfter[lang]}</span>
                </h2>
                <p className="mt-1 text-sm sm:text-base text-[var(--ink-secondary)]">
                  {copy.subtitle[lang]}
                </p>
              </div>

              <div
                ref={gridRef}
                onMouseLeave={() => setActiveSkill(null)}
                className="relative max-w-[1260px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
              >
                {activeSkill && (
                  <div className="pointer-events-none hidden md:block absolute inset-0 z-30">
                    <svg className="h-full w-full overflow-visible">
                      <path
                        d={`M ${activeSkill.rect.x} ${activeSkill.rect.y} C ${activeSkill.rect.x + (isRtl ? -36 : 36)} ${activeSkill.rect.y - 42}, ${activeSkill.rect.x + (isRtl ? -16 : 16)} ${Math.max(10, activeSkill.rect.y - 50)}, ${activeSkill.rect.x} ${Math.max(14, activeSkill.rect.y - 62)}`}
                        fill="none"
                        stroke={EXPERIENCE_COLORS[activeSkill.item.source].hex}
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div
                      className="absolute -translate-x-1/2 rounded-full px-3.5 py-1 text-xs font-bold text-[#2D2140] shadow-md whitespace-nowrap"
                      style={{
                        left: activeSkill.rect.x,
                        top: Math.max(2, activeSkill.rect.y - 90),
                        backgroundColor: EXPERIENCE_COLORS[activeSkill.item.source].soft,
                        border: `1.5px solid ${EXPERIENCE_COLORS[activeSkill.item.source].hex}`,
                      }}
                    >
                      {(activeSkill.item.sourceLabel ?? EXPERIENCE_COLORS[activeSkill.item.source].label)[lang]}
                    </div>
                  </div>
                )}

                {SKILL_GROUPS.map((group, gIdx) => {
                  const isDimmed = Boolean(activeSkill && activeSkill.groupId !== group.id);
                  return (
                    <div
                      key={group.id}
                      ref={(el) => { groupRefs.current[gIdx] = el; }}
                      className="rounded-[24px] border border-[var(--hairline)] bg-[var(--surface-card)]/96 p-4 sm:p-5 shadow-[var(--paper-shadow)] transition-opacity duration-300"
                      style={{ opacity: isDimmed ? 0.52 : 1 }}
                    >
                      <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[var(--hairline)]">
                        <div className="flex items-center gap-2.5">
                          <PuzzlePieceArt color={group.color} className="h-7 w-7 shrink-0" />
                          <h3
                            dir="ltr"
                            className="font-display text-lg sm:text-xl font-bold text-[var(--ink-primary)]"
                          >
                            {group.title[lang]}
                          </h3>
                        </div>
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: group.color }}
                          aria-hidden="true"
                        />
                      </div>

                      {/* Puzzle pieces assembling one by one with scroll */}
                      <div className="flex flex-wrap gap-2">
                        {group.skills.map((skill) => {
                          const isSelected = activeSkill?.item.id === skill.id;
                          const srcColor = EXPERIENCE_COLORS[skill.source];
                          const levelText = SKILL_LEVEL_LABELS[skill.level][lang];

                          return (
                            <button
                              key={skill.id}
                              ref={(el) => { pieceItemRefs.current[skill.id] = el; }}
                              type="button"
                              onMouseEnter={(e) => handleActivate(group.id, skill, e.currentTarget)}
                              onClick={(e) => handleActivate(group.id, skill, e.currentTarget)}
                              className="group inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-medium text-[var(--ink-primary)] shadow-2xs transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-[#A68BC8]"
                              style={{
                                borderColor: isSelected ? srcColor.hex : 'var(--hairline)',
                                backgroundColor: isSelected ? srcColor.soft : 'var(--surface-cream)',
                                color: isSelected ? '#2D2140' : undefined,
                                transform: isSelected ? 'translate3d(0, -2px, 0)' : undefined,
                              }}
                            >
                              <PuzzlePieceArt color={srcColor.hex} className="h-4 w-4 shrink-0" />
                              <span>{skill.label[lang]}</span>
                              <span
                                className="rounded-md px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#2D2140]"
                                style={{ backgroundColor: group.softColor }}
                              >
                                {levelText}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeSkill && (
                <div className="md:hidden mt-3 text-center">
                  <span
                    className="inline-block rounded-full px-4 py-1.5 text-xs font-bold text-[#2D2140] shadow"
                    style={{
                      backgroundColor: EXPERIENCE_COLORS[activeSkill.item.source].soft,
                      border: `1.5px solid ${EXPERIENCE_COLORS[activeSkill.item.source].hex}`,
                    }}
                  >
                    {(activeSkill.item.sourceLabel ?? EXPERIENCE_COLORS[activeSkill.item.source].label)[lang]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
