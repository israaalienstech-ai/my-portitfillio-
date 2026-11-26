import React, { useState } from 'react';
import { Menu, Moon, Sun, Volume2, VolumeX, X } from 'lucide-react';
import { Lang, PORTFOLIO_COPY } from '../data/rebuildContent';

interface NavbarProps {
  lang: Lang;
  onToggleLang: (next: Lang) => void;
  nightMode: boolean;
  onToggleNight: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  visible: boolean;
  nameLanded: boolean;
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
  logoSlotRef: React.RefObject<HTMLAnchorElement | null>;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  nightMode,
  onToggleNight,
  soundEnabled,
  onToggleSound,
  visible,
  nameLanded,
  activeSectionId,
  onNavigate,
  logoSlotRef,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        className={`absolute top-0 inset-x-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,0.8,0.3,1)] ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-6 sm:px-10 lg:px-14">
          {/* Inline-start: Logo slot (stays empty until hero name lands via FLIP move) */}
          <a
            ref={logoSlotRef}
            href="#scene-hero"
            onClick={(e) => handleNavClick(e, 'scene-hero')}
            className="flex min-w-[132px] items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A68BC8]"
            aria-label={PORTFOLIO_COPY.brand[lang]}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full bg-[#A68BC8] transition-all duration-500 ease-[cubic-bezier(0.34,1.3,0.5,1)]"
              style={{
                opacity: nameLanded ? 1 : 0,
                transform: nameLanded ? 'scale(1)' : 'scale(0.3)',
              }}
              aria-hidden="true"
            />
            <span
              dir="ltr"
              className="font-display text-lg font-semibold tracking-tight text-[var(--ink-primary)] transition-opacity duration-300"
              style={{ opacity: nameLanded ? 1 : 0 }}
            >
              {PORTFOLIO_COPY.brand[lang]}
            </span>
          </a>

          {/* Center: 5 single-line links with hand-drawn curved lavender pen underline */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Primary navigation"
          >
            {PORTFOLIO_COPY.nav.map((item) => {
              const isActive = activeSectionId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="group relative py-1.5 text-[15px] font-medium whitespace-nowrap shrink-0 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A68BC8]"
                >
                  <span className={isActive ? 'text-[var(--ink-primary)] font-semibold' : ''}>
                    {item.label[lang]}
                  </span>
                  <svg
                    viewBox="0 0 80 10"
                    className="pointer-events-none absolute -bottom-1 left-0 w-full h-2.5 overflow-visible"
                    aria-hidden="true"
                  >
                    <path
                      d="M 2 6 Q 40 1.5, 78 5.5"
                      fill="none"
                      stroke="#A68BC8"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: 86,
                        strokeDashoffset: isActive ? 0 : 86,
                        transition: 'stroke-dashoffset 450ms cubic-bezier(0.22, 0.8, 0.3, 1)',
                      }}
                    />
                  </svg>
                </a>
              );
            })}
          </nav>

          {/* Inline-end: EN | AR pill, Sound pill, Night circle button + mobile menu trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="flex items-center rounded-full p-0.5 border border-[var(--hairline)] bg-[var(--surface-card)]/80"
              role="group"
              aria-label="Language toggle"
            >
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                  lang === 'en'
                    ? 'bg-[#2D2140] text-[#F5EFE0] dark:bg-[#A68BC8] dark:text-[#1A1328]'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('ar')}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                  lang === 'ar'
                    ? 'bg-[#2D2140] text-[#F5EFE0] dark:bg-[#A68BC8] dark:text-[#1A1328]'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                AR
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleSound}
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? PORTFOLIO_COPY.controls.soundOn[lang] : PORTFOLIO_COPY.controls.soundOff[lang]}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[var(--hairline)] bg-[var(--surface-card)]/80 px-3 py-1.5 text-xs font-medium text-[var(--ink-primary)] whitespace-nowrap shrink-0 hover:border-[#A68BC8]/60 transition-colors"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-[#A68BC8]" /> : <VolumeX className="h-3.5 w-3.5 text-[var(--ink-muted)]" />}
              <span>{soundEnabled ? PORTFOLIO_COPY.controls.soundOn[lang] : PORTFOLIO_COPY.controls.soundOff[lang]}</span>
            </button>

            <button
              type="button"
              onClick={onToggleNight}
              aria-pressed={nightMode}
              aria-label={nightMode ? PORTFOLIO_COPY.controls.lightMode[lang] : PORTFOLIO_COPY.controls.nightMode[lang]}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-card)]/85 text-[var(--ink-primary)] hover:border-[#A68BC8] transition-colors shrink-0"
            >
              {nightMode ? <Sun className="h-4 w-4 text-[#E3B26E]" /> : <Moon className="h-4 w-4 text-[#2D2140]" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-card)]/85 text-[var(--ink-primary)]"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile soft paper sheet */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-[#0B0814]/45 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="paper-grain-surface rounded-t-3xl border-t border-[var(--hairline)] bg-[var(--surface-cream)] p-6 pb-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-[var(--ink-muted)]/30" />
            <nav className="flex flex-col gap-3">
              {PORTFOLIO_COPY.nav.map((item) => {
                const isActive = activeSectionId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#A68BC8]/20 text-[var(--ink-primary)] font-semibold'
                        : 'text-[var(--ink-secondary)] hover:bg-[var(--surface-peach)]/50'
                    }`}
                  >
                    {item.label[lang]}
                  </a>
                );
              })}
            </nav>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--hairline)] pt-4">
              <button
                type="button"
                onClick={onToggleSound}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--surface-card)] px-4 py-2 text-xs font-medium text-[var(--ink-primary)]"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4 text-[#A68BC8]" /> : <VolumeX className="h-4 w-4 text-[var(--ink-muted)]" />}
                <span>{soundEnabled ? PORTFOLIO_COPY.controls.soundOn[lang] : PORTFOLIO_COPY.controls.soundOff[lang]}</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-full px-4 py-2 text-xs font-semibold text-[var(--ink-muted)]"
              >
                {PORTFOLIO_COPY.experiences.closeLabel[lang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
