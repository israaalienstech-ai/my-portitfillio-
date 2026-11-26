import React, { useEffect, useRef, useState } from 'react';

interface StarTrailItem {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  rot: number;
}

interface PointerSparklesProps {
  active: boolean;
}

const STAR_COLORS = ['#A68BC8', '#EDA89B', '#E3B26E', '#9DB5A0', '#D8BEFF'];

/**
 * Emits floating star shapes following the cursor.
 */
export const PointerSparkles: React.FC<PointerSparklesProps> = ({ active }) => {
  const [items, setItems] = useState<StarTrailItem[]>([]);
  const lastSpawnRef = useRef(0);
  const idCounter = useRef(0);

  useEffect(() => {
    if (!active) {
      setItems([]);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || isTouch) return;

    const handleMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < 65) return;
      lastSpawnRef.current = now;

      const nextId = ++idCounter.current;
      const item: StarTrailItem = {
        id: nextId,
        x: e.clientX + (Math.random() * 14 - 7),
        y: e.clientY + (Math.random() * 14 - 7),
        dx: (Math.random() - 0.5) * 26,
        dy: -14 - Math.random() * 18,
        size: 12 + Math.random() * 7,
        color: STAR_COLORS[nextId % STAR_COLORS.length],
        rot: Math.round((Math.random() - 0.5) * 40),
      };

      setItems((prev) => [...prev.slice(-6), item]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((it) => it.id !== nextId));
      }, 850);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [active]);

  if (!active || items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {items.map((sp) => (
        <svg
          key={sp.id}
          viewBox="0 0 24 24"
          style={
            {
              position: 'fixed',
              left: sp.x - sp.size / 2,
              top: sp.y - sp.size / 2,
              width: sp.size,
              height: sp.size,
              '--dx': `${sp.dx.toFixed(1)}px`,
              '--dy': `${sp.dy.toFixed(1)}px`,
              '--rot': `${sp.rot}deg`,
              animation: 'starFloatDrift 850ms cubic-bezier(0.22,0.8,0.3,1) forwards',
              filter: `drop-shadow(0 0 4px ${sp.color}66)`,
            } as React.CSSProperties
          }
        >
          <path
            d="M12 2 L14.6 8.5 L21.5 9.2 L16.2 13.8 L17.9 20.6 L12 17 L6.1 20.6 L7.8 13.8 L2.5 9.2 L9.4 8.5 Z"
            fill={sp.color}
            fillOpacity="0.9"
          />
        </svg>
      ))}
      <style>{`
        @keyframes starFloatDrift {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(0.45) rotate(0deg);
          }
          22% {
            opacity: 0.95;
            transform: translate3d(calc(var(--dx) * 0.3), calc(var(--dy) * 0.3), 0) scale(1.08) rotate(calc(var(--rot) * 0.4));
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--dx), var(--dy), 0) scale(0.6) rotate(var(--rot));
          }
        }
      `}</style>
    </div>
  );
};
