import React, { useEffect, useState } from 'react';

export interface DebugState {
  activeScene: string;
  sceneProgress: number;
  activeBeat: string;
}

interface DebugOverlayProps {
  state: DebugState;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({ state }) => {
  const [enabled, setEnabled] = useState(false);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isDebug = params.get('debug') === '1';
    setEnabled(isDebug);
    if (!isDebug) return;

    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="fixed bottom-3 left-3 z-[90] pointer-events-none rounded-xl border border-[#A68BC8]/40 bg-[#0B0814]/88 px-3.5 py-2.5 text-[11px] font-mono text-[#F5EFE0] shadow-lg"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      <div>viewport: {viewport.w} × {viewport.h}</div>
      <div>scene: {state.activeScene}</div>
      <div>progress: {state.sceneProgress.toFixed(3)}</div>
      <div>beat: {state.activeBeat}</div>
    </div>
  );
};
