import React from 'react';
import { LANGUAGES_LIST, Lang, PORTFOLIO_COPY } from '../data/rebuildContent';

interface SceneLanguagesProps {
  lang: Lang;
}

export const SceneLanguages: React.FC<SceneLanguagesProps> = ({ lang }) => {
  const copy = PORTFOLIO_COPY.languages;

  return (
    <section
      id="scene-languages"
      className="relative z-10 w-full py-12 sm:py-16 px-6 sm:px-10 paper-grain-surface border-t border-[var(--hairline)]"
      style={{ backgroundColor: 'var(--surface-cream)' }}
      aria-label="Languages"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          className="text-center font-display font-semibold text-[var(--ink-primary)]"
          style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)' }}
        >
          <span>{copy.titleBefore[lang]}</span>
          <span className="italic text-[#A68BC8]">{copy.titleAccent[lang]}</span>
          <span>{copy.titleAfter[lang]}</span>
        </h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LANGUAGES_LIST.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-card)] px-5 py-4 shadow-[var(--paper-shadow)]"
            >
              <div>
                <div className="font-display text-lg sm:text-xl font-bold text-[var(--ink-primary)]">
                  {item.name[lang]}
                </div>
                <div className="text-xs sm:text-sm font-medium text-[var(--ink-muted)] mt-0.5">
                  {item.levelLabel[lang]}
                </div>
              </div>

              {/* Simple labeled dots, never percentages */}
              <div
                className="flex items-center gap-1.5"
                aria-label={`${item.name[lang]} — ${item.levelLabel[lang]}`}
              >
                {[1, 2, 3, 4, 5].map((dotIdx) => {
                  const filled = dotIdx <= item.dots;
                  return (
                    <span
                      key={dotIdx}
                      className="h-3 w-3 rounded-full border transition-colors"
                      style={{
                        backgroundColor: filled ? item.color : 'transparent',
                        borderColor: filled ? item.color : 'rgba(166, 139, 200, 0.35)',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
