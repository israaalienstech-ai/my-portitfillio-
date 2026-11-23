import React, { useEffect, useRef, useState } from 'react';

interface SparkleDot {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface PointerSparklesProps {
  active: boolean;
}

/**
 * Emits 2–3 soft fading 4-pt paper sparkles behind the pointer on light scenes (Section 2).
 */
export const PointerSparkles: React.FC<PointerSparklesProps> = ({ active }) => {
  const [sparkles, setSparkles] = useState<SparkleDot[]>([]);
  const lastSpawnRef = useRef(0);
  const idCounter = useRef(0);

  useEffect(() => {
    if (!active) {
      setSparkles([]);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || isTouch) return;

    const handleMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < 160) return;
      lastSpawnRef.current = now;
      const nextId = ++idCounter.current;
      const dot: SparkleDot = {
        id: nextId,
        x: e.clientX + (Math.random() * 10 - 5),
        y: e.clientY + (Math.random() * 10 - 5),
        size: 6 + Math.random() * 3.5,
      };
      setSparkles((prev) => [...prev.slice(-2), dot]);
      window.setTimeout(() => {
        setSparkles((prev) => prev.filter((item) => item.id !== nextId));
      }, 650);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [active]);

  if (!active || sparkles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {sparkles.map((sp) => (
        <svg
          key={sp.id}
          viewBox="0 0 24 24"
          style={{
            position: 'fixed',
            left: sp.x - sp.size / 2,
            top: sp.y - sp.size / 2,
            width: sp.size,
            height: sp.size,
            animation: 'fadeOutSparkle 650ms cubic-bezier(0.22,0.8,0.3,1) forwards',
          }}
        >
          <path
            d="M12 1 C12.8 8.5, 15.5 11.2, 23 12 C15.5 12.8, 12.8 15.5, 12 23 C11.2 15.5, 8.5 12.8, 1 12 C8.5 11.2, 11.2 8.5, 12 1 Z"
            fill="#E3B26E"
            fillOpacity="0.48"
          />
        </svg>
      ))}
      <style>{`
        @keyframes fadeOutSparkle {
          0% { opacity: 0.9; transform: scale(0.75) rotate(0deg); }
          100% { opacity: 0; transform: scale(1.15) rotate(18deg); }
        }
      `}</style>
    </div>
  );
};
