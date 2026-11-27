import React, { useEffect, useState } from 'react';
import { ArrowUp, Check, Copy, Download, Mail, MapPin, MessageCircle, Sparkles, X } from 'lucide-react';
import {
  COURSE_BOOKS,
  EXPERIENCE_STATIONS,
  LANGUAGES_LIST,
  Lang,
  PORTFOLIO_COPY,
  SKILL_GROUPS,
  SKILL_LEVEL_LABELS,
} from '../data/rebuildContent';
import { KeyedImage, UPLOADED_ASSETS } from './StorybookVisuals';
import { soundSystem } from '../utils/soundSystem';

interface SceneConnectFooterProps {
  lang: Lang;
  nightMode: boolean;
  onNavigate?: (sectionId: string) => void;
  onBackToTop?: () => void;
}

export const SceneConnectFooter: React.FC<SceneConnectFooterProps> = ({
  lang,
  onNavigate,
  onBackToTop,
}) => {
  const isRtl = lang === 'ar';
  const copy = PORTFOLIO_COPY.connect;

  const [sailOpen, setSailOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<'email' | 'phone' | null>(null);

  useEffect(() => {
    if (!sailOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSailOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sailOpen]);

  const handleCopy = async (kind: 'email' | 'phone', val: string) => {
    soundSystem.copyPing();
    try {
      await navigator.clipboard.writeText(val);
    } catch {
      // Clipboard fallback ignored inside sandboxed iframes
    }
    setCopiedKey(kind);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === kind ? null : current));
    }, 1500);
  };

  const handleOpenSail = () => {
    if (!sailOpen) soundSystem.waterSail();
    setSailOpen((prev) => !prev);
  };

  const handleDownloadCv = () => {
    soundSystem.copyPing();
    const esc = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const expHtml = EXPERIENCE_STATIONS.map(
      (st) => `
      <section style="margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #e6dce8;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;">
          <h3 style="margin:0;font-size:16px;color:#2D2140;">${esc(st.role)} — <span style="color:#7A4FB0;">${esc(st.company)}</span></h3>
          ${st.dates ? `<span style="font-size:12px;color:#6d5b88;">${esc(st.dates)}</span>` : ''}
        </div>
        <p style="margin:6px 0 8px;color:#4D3D66;font-size:13.5px;">${esc(st.roleOverview.en)}</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.55;color:#2D2140;">
          ${st.achievements.map((a) => `<li><strong>${esc(a.badge)}:</strong> ${esc(a.caption.en)}</li>`).join('')}
        </ul>
      </section>`,
    ).join('');

    const skillsHtml = SKILL_GROUPS.map(
      (g) => `
      <div style="margin-bottom:8px;font-size:13px;">
        <strong style="color:#2D2140;">${esc(g.title.en)}:</strong>
        <span style="color:#4D3D66;">${g.skills.map((s) => `${esc(s.label.en)} (${esc(SKILL_LEVEL_LABELS[s.level].en)})`).join(' · ')}</span>
      </div>`,
    ).join('');

    const coursesHtml = COURSE_BOOKS.map(
      (c) => `${esc(c.title)}${c.provider ? ` (${esc(c.provider.en.trim())})` : ''}`,
    ).join(' · ');

    const langsHtml = LANGUAGES_LIST.map(
      (l) => `${esc(l.name.en)} (${esc(l.levelLabel.en)})`,
    ).join(' · ');

    const cvDocument = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Israa Ellban — CV</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 820px; margin: 36px auto; padding: 0 24px; color: #2D2140; background: #FFFDF9; line-height: 1.5; }
    header { border-bottom: 2px solid #2D2140; padding-bottom: 14px; margin-bottom: 22px; }
    h1 { margin: 0 0 4px; font-size: 28px; letter-spacing: 0.01em; }
    h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.14em; color: #7A4FB0; margin: 22px 0 10px; border-bottom: 1px solid #e6dce8; padding-bottom: 4px; }
    a { color: #2D2140; }
  </style>
</head>
<body>
  <header>
    <h1>Israa Ellban</h1>
    <div style="font-size:14px;color:#4D3D66;">Product Manager · Account Manager · Business Development &amp; Operations</div>
    <div style="margin-top:8px;font-size:13px;color:#4D3D66;">
      Egypt (Open for Onsite or Remote) ·
      <a href="mailto:${esc(copy.email)}">${esc(copy.email)}</a> ·
      <a href="${esc(copy.whatsappUrl)}">${esc(copy.phone)} (WhatsApp)</a>
    </div>
  </header>
  <h2>Profile</h2>
  <p style="font-size:13.5px;color:#2D2140;">${esc(copy.body.en)}</p>
  <h2>Experience</h2>
  ${expHtml}
  <h2>Skills</h2>
  ${skillsHtml}
  <h2>Courses &amp; Languages</h2>
  <p style="font-size:13px;color:#4D3D66;"><strong>Courses:</strong> ${coursesHtml}</p>
  <p style="font-size:13px;color:#4D3D66;"><strong>Languages:</strong> ${langsHtml}</p>
</body>
</html>`;

    const blob = new Blob([cvDocument], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Israa_Ellban_CV.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const scrollToSection = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const el = document.getElementById(id);
    if (!el) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const offset = id === 'scene-journey' ? (window.innerWidth >= 640 ? 116 : 88) : 0;
    window.scrollTo({ top: el.offsetTop + offset, behavior: 'smooth' });
  };

  return (
    <footer
      id="scene-connect"
      className="relative z-20 w-full overflow-x-clip bg-transparent"
      aria-label="Connect and footer"
    >
      {/* Wavy landscape container rising over the pinned Projects slide */}
      <div className="relative w-full sm:min-h-[760px] lg:min-h-[820px] flex flex-col justify-end">
        {/* Background wavy landscape image anchored to fill the footer frame */}
        <div className="pointer-events-none relative sm:absolute sm:inset-0 w-full overflow-hidden">
          <KeyedImage
            src={UPLOADED_ASSETS.footerSunsetCutout}
            keyMode="checkerboard"
            alt="Arched stone landscape overlooking a sunset horizon"
            draggable={false}
            className={`block w-full h-[240px] sm:h-full object-cover object-bottom ${
              isRtl ? '-scale-x-100' : ''
            }`}
          />
          {/* Subtle readability vignette ONLY over the lower dark hills area */}
          <div
            className="hidden sm:block absolute inset-x-0 bottom-0 h-[68%]"
            style={{
              background:
                'linear-gradient(180deg, rgba(28, 18, 42, 0) 0%, rgba(28, 18, 42, 0.42) 32%, rgba(28, 18, 42, 0.85) 75%, rgba(24, 15, 36, 0.96) 100%)',
            }}
          />
        </div>

        {/* ALL Connect text, buttons, glass card & footer bar strictly inside the landscape hills frame */}
        <div className="relative z-10 w-full bg-[#241736] sm:bg-transparent -mt-1 sm:mt-0 sm:pt-[220px] md:pt-[260px] lg:pt-[290px] pb-6 sm:pb-8">
          <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-10 lg:px-16">
            <div className="mb-4 text-[#F5EFE0]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E3B26E]">
                {copy.eyebrow[lang]}
              </p>
              <h2
                className="mt-1 font-display font-bold leading-[1.18] text-[#F5EFE0] lg:whitespace-nowrap"
                style={{ fontSize: 'clamp(1.35rem, 2.35vw, 2.3rem)' }}
              >
                <span>{copy.line1Before[lang]}</span>
                <span className="italic text-[#E4D8F0]">{copy.line1Highlight[lang]}</span>
                <span> {copy.line1Emoji} </span>
                <span
                  dir="ltr"
                  className="inline-block rounded-lg bg-[#E3B26E]/22 px-2 py-0.5 text-[#FFE6A3] border-b-2 border-[#E3B26E]/80"
                  style={{ unicodeBidi: 'isolate', fontFamily: 'var(--font-display-en)' }}
                >
                  {copy.line2}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-end">
              {/* Inline-start: Updated Role + Availability Body, Action Pills */}
              <div className="lg:col-span-7 text-[#F5EFE0]">
                <p className="max-w-xl text-sm sm:text-[15px] leading-relaxed text-[#EBE2F0]">
                  {copy.body[lang]}
                </p>

                {/* Primary Email Box with integrated Copy + Direct WhatsApp Link & Copy */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <div
                    dir="ltr"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F5EFE0] pl-5 pr-2 py-1.5 text-xs sm:text-sm font-semibold text-[#2D2140] shadow-lg"
                  >
                    <a
                      href={`mailto:${copy.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 py-1 underline-offset-4 hover:underline hover:opacity-85 transition-opacity cursor-pointer"
                    >
                      <Mail className="h-4 w-4 text-[#7B659D]" />
                      <span>{copy.email}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy('email', copy.email)}
                      aria-label={copy.copyEmail[lang]}
                      title={copy.copyEmail[lang]}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2D2140]/10 hover:bg-[#2D2140]/20 text-[#2D2140] transition-colors"
                    >
                      {copiedKey === 'email' ? (
                        <Check className="h-3.5 w-3.5 text-[#3F6345]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div
                    dir="ltr"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#F5EFE0]/28 bg-[#1C122A]/65 backdrop-blur-xs pl-4 pr-2 py-1.5 text-xs sm:text-sm font-medium text-[#F5EFE0]"
                  >
                    <a
                      href={copy.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 py-0.5 hover:text-[#BCE0C2] transition-colors"
                      aria-label={`${copy.whatsappLabel[lang]}: ${copy.phone}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-[#9DB5A0]" />
                      <span>{copy.phone}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy('phone', copy.phone)}
                      aria-label={copy.copyLabel[lang]}
                      title={copy.copyLabel[lang]}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EFE0]/12 hover:bg-[#F5EFE0]/24 text-[#F5EFE0] transition-colors"
                    >
                      {copiedKey === 'phone' ? (
                        <Check className="h-3 w-3 text-[#9DB5A0]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadCv}
                    className="inline-flex items-center gap-2 rounded-full border border-[#9DB5A0]/50 bg-[#9DB5A0]/20 backdrop-blur-xs px-4 py-2 text-xs sm:text-sm font-semibold text-[#F5EFE0] hover:bg-[#9DB5A0]/35 hover:border-[#9DB5A0] transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-[#BCE0C2]" />
                    <span>{copy.downloadCv[lang]}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenSail}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E3B26E]/40 bg-[#2D2140]/75 backdrop-blur-xs px-4 py-2 text-xs sm:text-sm font-medium text-[#F5EFE0] hover:border-[#E3B26E] transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#E3B26E]" />
                    <span>{copy.button[lang]}</span>
                  </button>
                </div>
              </div>

              {/* Inline-end: Dark Glass Structured Card */}
              <div className="lg:col-span-5">
                <div className="rounded-[22px] border border-[#F5EFE0]/16 bg-[#180F24]/78 backdrop-blur-md p-5 text-[#F5EFE0] shadow-2xl space-y-2.5">
                  <div className="border-b border-[#F5EFE0]/12 pb-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#EDA89B]">
                      {copy.directEmailLabel[lang]}
                    </div>
                    <a
                      href={`mailto:${copy.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="mt-0.5 inline-block text-sm font-semibold text-[#F5EFE0] underline-offset-4 hover:underline hover:text-[#E4D8F0] transition-colors cursor-pointer"
                    >
                      {copy.email}
                    </a>
                  </div>

                  <div className="border-b border-[#F5EFE0]/12 pb-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9DB5A0]">
                      {copy.focusAreasLabel[lang]}
                    </div>
                    <p
                      dir="ltr"
                      className={`mt-0.5 text-xs sm:text-sm font-medium leading-snug text-[#E8DFEE] ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    >
                      {copy.focusAreasValue[lang]}
                    </p>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E3B26E]">
                      {copy.availabilityLabel[lang]}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm font-medium text-[#F5EFE0]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E3B26E]" />
                      <span>{copy.availabilityValue[lang]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Bar inside the dark base of the landscape */}
            <div className="mt-5 border-t border-[#F5EFE0]/15 pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#DFD3EE]/85">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span dir="ltr" className="font-display font-bold text-[#F5EFE0] text-sm">
                  {PORTFOLIO_COPY.brand[lang]}
                </span>
                <span aria-hidden="true">·</span>
                <span>{copy.footer[lang]}</span>
              </div>

              <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-5" aria-label="Footer navigation">
                {PORTFOLIO_COPY.nav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-[#F5EFE0] transition-colors"
                  >
                    {item.label[lang]}
                  </button>
                ))}
              </nav>

              <button
                type="button"
                onClick={() => {
                  if (onBackToTop) {
                    onBackToTop();
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 font-semibold text-[#E3B26E] hover:text-[#F5EFE0] transition-colors shrink-0"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                <span>{copy.backToTop[lang]}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sail Quick Contact Modal */}
      {sailOpen && (
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-[#0B0814]/45"
          onClick={() => setSailOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Direct contact details"
            className="paper-grain-surface relative w-full max-w-md rounded-[26px] border border-[var(--hairline)] bg-[var(--surface-card)] p-6 sm:p-8 shadow-[var(--paper-shadow-lg)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--hairline)] pb-3">
              <span className="font-display italic text-lg font-semibold text-[#A68BC8]">
                {copy.button[lang]}
              </span>
              <button
                type="button"
                onClick={() => setSailOpen(false)}
                aria-label={PORTFOLIO_COPY.experiences.closeLabel[lang]}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-cream)] text-[var(--ink-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-cream)] px-4 py-3">
                <a
                  href={`mailto:${copy.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm sm:text-base font-medium text-[var(--ink-primary)] underline-offset-4 hover:underline hover:text-[#A68BC8] transition-colors truncate cursor-pointer"
                  dir="ltr"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#A68BC8]" />
                  <span className="truncate">{copy.email}</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('email', copy.email)}
                  className="relative inline-flex items-center gap-1.5 rounded-full bg-[#2D2140] px-3 py-1.5 text-xs font-semibold text-[#F5EFE0] dark:bg-[#A68BC8] dark:text-[#1A1328] shrink-0"
                >
                  {copiedKey === 'email' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>{copy.copied[lang]}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copy.copyLabel[lang]}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-cream)] px-4 py-3">
                <a
                  href={copy.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm sm:text-base font-medium text-[var(--ink-primary)] hover:text-[#6B8E63] transition-colors"
                  dir="ltr"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#9DB5A0]" />
                  <span>{copy.phone}</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy('phone', copy.phone)}
                  className="relative inline-flex items-center gap-1.5 rounded-full bg-[#2D2140] px-3 py-1.5 text-xs font-semibold text-[#F5EFE0] dark:bg-[#A68BC8] dark:text-[#1A1328] shrink-0"
                >
                  {copiedKey === 'phone' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>{copy.copied[lang]}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copy.copyLabel[lang]}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
