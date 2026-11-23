import React, { useEffect, useState } from 'react';

export const UPLOADED_ASSETS = {
  gateNightScene: '/assets/aistudio/Hero_image__dark__98dba6ed.jpg',
  heroArchLight: '/assets/aistudio/hero_light_5c6f37a7.webp',
  heroArchNight: '/assets/aistudio/Hero_image__dark__98dba6ed.jpg',
  logoCveeez: '/assets/aistudio/cveeez_logo_e5423e19.jpg',
  logoCareercv: '/assets/aistudio/Cereer_Cv_1ecf1176.jpg',
  educationFlask: '/assets/aistudio/curious_mind_74a48458.webp',
  skillPeople: '/assets/aistudio/from_insight_to_product_8fa218bd.webp',
  skillBranding: '/assets/aistudio/beyond_the_breif_f1001c3c.webp',
  skillTools: '/assets/aistudio/things_i_bulid_25d9218e.webp',
  connectSunset: '/assets/aistudio/del_882195d5.jpg',
  connectLightCutout: '/assets/aistudio/my_journy__light___f1878cba.jpg',
  footerSunsetCutout: '/assets/aistudio/footer_design_27dd4a30.jpg',
} as const;

const keyedDataUrlCache = new Map<string, string>();

/**
 * Removes solid outer black borders or outer top checkerboard sky via edge flood-fill,
 * preserving interior artwork untouched.
 */
export const KeyedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  keyBlack?: boolean;
  keyMode?: 'black' | 'checkerboard';
  draggable?: boolean;
}> = ({
  src,
  alt,
  className = 'w-full h-full object-contain',
  keyBlack = true,
  keyMode = 'black',
  draggable,
}) => {
  const cacheKey = `${keyMode}:${src}`;
  const [ready, setReady] = useState<boolean>(() => {
    if (!keyBlack) return true;
    return keyedDataUrlCache.has(cacheKey);
  });
  const [resolved, setResolved] = useState<string>(() => {
    if (!keyBlack) return src;
    return keyedDataUrlCache.get(cacheKey) ?? src;
  });

  useEffect(() => {
    if (!keyBlack) {
      setResolved(src);
      setReady(true);
      return;
    }
    const cached = keyedDataUrlCache.get(cacheKey);
    if (cached) {
      setResolved(cached);
      setReady(true);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const d = imageData.data;

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const isKeyPixel = (idx: number) => {
          const p = idx * 4;
          const r = d[p];
          const g = d[p + 1];
          const b = d[p + 2];
          if (keyMode === 'checkerboard') {
            const maxC = Math.max(r, g, b);
            const minC = Math.min(r, g, b);
            return maxC - minC < 22 && minC > 165;
          }
          return r < 24 && g < 24 && b < 24;
        };

        const pushEdge = (x: number, y: number) => {
          const idx = y * w + x;
          if (!visited[idx] && isKeyPixel(idx)) {
            visited[idx] = 1;
            queue[tail++] = idx;
          }
        };

        for (let x = 0; x < w; x++) {
          pushEdge(x, 0);
          if (keyMode === 'black') pushEdge(x, h - 1);
        }
        const sideLimit = keyMode === 'checkerboard' ? Math.floor(h * 0.55) : h;
        for (let y = 0; y < sideLimit; y++) {
          pushEdge(0, y);
          pushEdge(w - 1, y);
        }

        while (head < tail) {
          const cur = queue[head++];
          d[cur * 4 + 3] = 0;
          const x = cur % w;
          const y = (cur - x) / w;
          if (x > 0) pushEdge(x - 1, y);
          if (x < w - 1) pushEdge(x + 1, y);
          if (y > 0) pushEdge(x, y - 1);
          if (y < h - 1) pushEdge(x, y + 1);
        }

        ctx.putImageData(imageData, 0, 0);
        const out = canvas.toDataURL('image/png');
        keyedDataUrlCache.set(cacheKey, out);
        if (!cancelled) {
          setResolved(out);
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setResolved(src);
          setReady(true);
        }
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, keyBlack, keyMode, cacheKey]);

  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={draggable}
      referrerPolicy="no-referrer"
      className={className}
      style={keyMode === 'checkerboard' && !ready ? { opacity: 0 } : undefined}
    />
  );
};

/** Hanging glowing lantern matching the attached gate reference screenshot */
export const GateLanternArt: React.FC<{ className?: string }> = ({ className = 'w-16 h-24' }) => (
  <svg viewBox="0 0 80 120" className={className} aria-hidden="true">
    {/* Ring */}
    <circle cx="40" cy="14" r="6" fill="none" stroke="#F4DFB6" strokeWidth="3.5" />
    {/* Lavender roof cap */}
    <path d="M 22 30 L 30 20 L 50 20 L 58 30 Z" fill="#A68BC8" stroke="#F4DFB6" strokeWidth="2" strokeLinejoin="round" />
    {/* Glowing warm lantern body */}
    <path
      d="M 21 30 L 59 30 L 54 92 Q 40 97 26 92 Z"
      fill="#FBE192"
      stroke="#EDA89B"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Soft inner ribs */}
    <line x1="33" y1="32" x2="35" y2="92" stroke="#E3B26E" strokeWidth="2" strokeOpacity="0.65" />
    <line x1="47" y1="32" x2="45" y2="92" stroke="#E3B26E" strokeWidth="2" strokeOpacity="0.65" />
    {/* Glowing cream flame core */}
    <ellipse cx="40" cy="61" rx="9" ry="15" fill="#FFFDF2" opacity="0.92" />
    {/* Bottom trim */}
    <path d="M 27 92 L 53 92 L 48 98 L 32 98 Z" fill="#A68BC8" />
  </svg>
);

/** Origami paper plane riding dotted journey trails */
export const PaperPlaneArt: React.FC<{ className?: string }> = ({ className = 'w-11 h-8' }) => (
  <svg viewBox="0 0 64 46" className={className} aria-hidden="true">
    <path
      d="M 4 22 L 59 6 L 41 40 L 28 28 Z"
      fill="#FFF9F2"
      stroke="#A68BC8"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path d="M 59 6 L 28 28 L 24 38 L 21 25" fill="#E4D8F0" stroke="#A68BC8" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

/** Soft watercolor jigsaw puzzle piece */
export const PuzzlePieceArt: React.FC<{ color: string; className?: string }> = ({
  color,
  className = 'w-8 h-8',
}) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path
      d="M 10 12 L 19 12 C 19 7, 29 7, 29 12 L 38 12 L 38 20 C 43 20, 43 30, 38 30 L 38 38 L 10 38 L 10 29 C 15 29, 15 21, 10 21 Z"
      fill={color}
      stroke="#FFF9F2"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

/** Stitched cream-and-lavender pocket pouch collecting experience pieces */
export const PuzzlePocketArt: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
    <path
      d="M 10 14 L 46 14 L 46 34 C 46 44, 38 49, 28 49 C 18 49, 10 44, 10 34 Z"
      fill="#E4D8F0"
      stroke="#A68BC8"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path d="M 14 20 L 42 20" stroke="#A68BC8" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
    <path
      d="M 18 14 L 22 6 L 34 6 L 38 14"
      fill="#EDA89B"
      fillOpacity="0.7"
      stroke="#2D2140"
      strokeOpacity="0.35"
      strokeWidth="1.6"
    />
  </svg>
);

/** FERTICAL botanical emblem */
export const FerticalLogoArt: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="44" fill="#F5EFE0" />
    <path d="M 50 76 C 50 56, 50 42, 50 26" stroke="#6F866D" strokeWidth="3.2" strokeLinecap="round" />
    <path d="M 50 48 C 36 46, 28 34, 34 26 C 42 28, 49 38, 50 48 Z" fill="#9DB5A0" />
    <path d="M 50 42 C 64 40, 72 28, 66 20 C 58 22, 51 32, 50 42 Z" fill="#A68BC8" />
    <path d="M 36 74 Q 50 67 64 74" fill="none" stroke="#A68BC8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** X-FUSE crisp monogram emblem */
export const XfuseLogoArt: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="44" fill="#EAF0E8" />
    <path d="M 32 32 C 44 45, 56 55, 68 68" stroke="#2D2140" strokeWidth="5.5" strokeLinecap="round" />
    <path d="M 68 32 C 56 45, 44 55, 32 68" stroke="#9DB5A0" strokeWidth="5.5" strokeLinecap="round" />
    <circle cx="50" cy="50" r="6" fill="#E3B26E" />
  </svg>
);

/** Fallback storybook emblems for the two skill groups without uploaded .webp medallions */
export const SkillEmblemSvg: React.FC<{ variant: 'selling' | 'leading' | 'soft'; className?: string }> = ({
  variant,
  className = 'w-14 h-14',
}) => {
  if (variant === 'selling') {
    return (
      <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
        <circle cx="40" cy="40" r="34" fill="#F9E1DC" stroke="#EDA89B" strokeWidth="2" />
        <path d="M 22 48 C 30 38, 37 42, 43 34 C 49 27, 55 24, 60 20" fill="none" stroke="#E7907A" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 52 19 L 61 19 L 60 28" fill="none" stroke="#E7907A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="56" r="3" fill="#A68BC8" />
        <circle cx="40" cy="56" r="3" fill="#E3B26E" />
        <circle cx="56" cy="56" r="3" fill="#9DB5A0" />
      </svg>
    );
  }
  if (variant === 'leading') {
    return (
      <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
        <circle cx="40" cy="40" r="34" fill="#DCE7DD" stroke="#9DB5A0" strokeWidth="2" />
        <circle cx="40" cy="28" r="7" fill="#2D2140" fillOpacity="0.82" />
        <circle cx="25" cy="48" r="5.5" fill="#6F866D" />
        <circle cx="55" cy="48" r="5.5" fill="#6F866D" />
        <path d="M 34 34 C 30 40, 28 42, 27 43" stroke="#9DB5A0" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 46 34 C 50 40, 52 42, 53 43" stroke="#9DB5A0" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 31 48 C 37 51, 43 51, 49 48" fill="none" stroke="#9DB5A0" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="34" fill="#E4D8F0" stroke="#A68BC8" strokeWidth="2" />
      <path d="M 40 20 C 42 32, 48 38, 60 40 C 48 42, 42 48, 40 60 C 38 48, 32 42, 20 40 C 32 38, 38 32, 40 20 Z" fill="#A68BC8" />
    </svg>
  );
};
