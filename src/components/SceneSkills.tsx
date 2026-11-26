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
  { color: '#A68BC8', label: 'FERTICAL', rowX: -126, burstX: -420, burstY: -220, rot: -16 },
  { color: '#E7907A', label: 'CVeeeZ', rowX: -42, burstX: -150, burstY: -310, rot: 12 },
  { color: '#9DB5A0', label: 'X-FUSE', rowX: 42, burstX: 150, burstY: -310, rot: -8 },
  { color: '#E3B26E', label: 'Career CV', rowX: 126, burstX: 420, burstY: -210, rot: 14 },
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
      const vw = window.innerWidth || 1024;
      const vh = window.innerHeight || 768;
      const cornerOffsetX = vw >= 640 ? 64 : 48;
      const cornerX = isRtl ? -(vw / 2 - cornerOffsetX) : vw / 2 - cornerOffsetX;
      const cornerY = vh / 2 - 62;

      if (heroPocketRef.current) {
        gsap.set(heroPocketRef.current, {
          x: cornerX,
          y: cornerY,
          scale: 0.56,
          opacity: 0,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onEnter: () => {
            if (heroPocketRef.current) gsap.set(heroPocketRef.current, { opacity: 1 });
          },
          onLeaveBack: () => {
            if (heroPocketRef.current) gsap.set(heroPocketRef.current, { opacity: 0 });
          },
          onUpdate: (self) => {
            const p = self.progress;
            let beat = 'pocket-grow';

            if (p >= 0.14 && p < 0.38) {
              beat = 'gather-4-pieces';
            } else if (p >= 0.38 && p < 0.46) {
              beat = 'my-skills-complete';
              if (!triggeredRef.current.complete && self.direction > 0) {
                triggeredRef.current.complete = true;
                soundSystem.skillComplete();
              }
            } else if (p >= 0.46 && p < 0.55) {
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

      // Phase 1: Pocket glides & scales smoothly from its Experiences bottom corner straight to center
      if (heroPocketRef.current) {
        tl.fromTo(
          heroPocketRef.current,
          { x: cornerX, y: cornerY, scale: 0.56, opacity: 1 },
          { x: 0, y: 18, scale: 1.48, opacity: 1, duration: 0.16, ease: 'power2.out' },
          0,
        );
        tl.to(
          heroPocketRef.current,
          { x: 0, y: 95, scale: 0.9, opacity: 0, duration: 0.1, ease: 'power2.in' },
          0.2,
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
          0.62 + (idx - 2) * 0.03,
        );
      });

      // One-by-one puzzle piece assembly across all 4 groups
      const orderedSkillIds = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => s.id));
      const totalItems = orderedSkillIds.length;
      orderedSkillIds.forEach((skillId, sIdx) => {
        const btn = pieceItemRefs.current[skillId];
        if (!btn) return;
        const slot = 0.52 + (sIdx / Math.max(1, totalItems - 1)) * 0.3;
        tl.fromTo(
          btn,
          { opacity: 0, scale: 0.55, y: 14, rotation: sIdx % 2 === 0 ? -5 : 5 },
          { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.045, ease: 'back.out(1.6)' },
          slot,
        );
      });

      // Measure full height including container top padding so NO bottom card (e.g. Tools) is ever clipped
      const stageH = stageContainerRef.current?.clientHeight ?? window.innerHeight;
      const innerH = panelsInnerRef.current?.scrollHeight ?? stageH;
      const slidePadTop = panelsSlideRef.current
        ? parseFloat(window.getComputedStyle(panelsSlideRef.current).paddingTop) || 32
        : 32;
      const overflowPx = Math.max(0, slidePadTop + innerH - stageH + 44);

      if (panelsInnerRef.current) {
        const startY = overflowPx > 0 ? 8 : 22;
        const endY = -overflowPx;
        tl.fromTo(
          panelsInnerRef.current,
          { y: startY },
          { y: endY, duration: 0.24, ease: 'power2.inOut' },
          0.6,
        );
      }
    }, outer);

    return () => ctx.revert();
  }, [lang, onDebugUpdate]);

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
              <PuzzlePocketArt
                className="relative h-24 w-24 sm:h-28 sm:w-28 drop-shadow-lg"
                collectedStations={5}
              />
              <span dir="ltr" className="relative mt-2 font-display italic text-sm sm:text-base font-semibold text-[var(--ink-primary)]">
                {PORTFOLIO_COPY.experiences.pocketLabel}
              </span>
            </div>

            <div
              ref={assemblyLabelRef}
              dir="ltr"
              className="absolute font-display italic font-bold text-[var(--ink-primary)] select-none"
              style={{ fontSize: 'clamp(1.85rem, 4.2vw, 3.1rem)' }}
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
            className="relative z-10 w-full pt-6 sm:pt-9 pb-8"
          >
            <div ref={panelsInnerRef} className="w-full">
              <div className="text-center max-w-2xl mx-auto mb-3.5 sm:mb-4">
                <h2
                  className="font-display font-semibold text-[var(--ink-primary)]"
                  style={{ fontSize: 'clamp(1.25rem, 2.25vw, 1.9rem)' }}
                >
                  <span>{copy.titleBefore[lang]}</span>
                  <span className="italic text-[#A68BC8]">{copy.titleAccent[lang]}</span>
                  <span>{copy.titleAfter[lang]}</span>
                </h2>
                <p className="mt-1 text-xs sm:text-[13px] text-[var(--ink-secondary)]">
                  {copy.subtitle[lang]}
                </p>
              </div>

              <div
                ref={gridRef}
                onMouseLeave={() => setActiveSkill(null)}
                className="relative max-w-[1260px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4"
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
                      className="rounded-[22px] border border-[var(--hairline)] bg-[var(--surface-card)]/96 p-3.5 sm:p-4 shadow-[var(--paper-shadow)] transition-opacity duration-300"
                      style={{ opacity: isDimmed ? 0.52 : 1 }}
                    >
                      <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[var(--hairline)]">
                        <div className="flex items-center gap-2.5">
                          <PuzzlePieceArt color={group.color} className="h-7 w-7 shrink-0" />
                          <h3
                            dir="ltr"
                            className="font-display text-base sm:text-lg font-bold text-[var(--ink-primary)]"
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
                              className="group inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-medium text-[var(--ink-primary)] shadow-2xs transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-[#A68BC8]"
                              style={{
                                borderColor: isSelected ? srcColor.hex : 'var(--hairline)',
                                backgroundColor: isSelected ? srcColor.soft : 'var(--surface-cream)',
                                color: isSelected ? '#2D2140' : undefined,
                                transform: isSelected ? 'translate3d(0, -2px, 0)' : undefined,
                              }}
                            >
                              <PuzzlePieceArt color={srcColor.hex} className="h-3.5 w-3.5 shrink-0" />
                              <span>{skill.label[lang]}</span>
                              <span
                                className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-[#2D2140]"
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
