import React, { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lang } from './data/rebuildContent';
import { soundSystem } from './utils/soundSystem';
import { Navbar } from './components/Navbar';
import { SceneDarkGate } from './components/SceneDarkGate';
import { SceneHero } from './components/SceneHero';
import { SceneJourney } from './components/SceneJourney';
import { SceneExperiences } from './components/SceneExperiences';
import { SceneSkills } from './components/SceneSkills';
import { SceneLanguages } from './components/SceneLanguages';
import { SceneLearning } from './components/SceneLearning';
import { SceneProjectsTeaser } from './components/SceneProjectsTeaser';
import { SceneConnectFooter } from './components/SceneConnectFooter';
import { DebugOverlay, DebugState } from './components/DebugOverlay';
import { PointerSparkles } from './components/PointerSparkles';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const [nightMode, setNightMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => soundSystem.isEnabled());

  const [gateComplete, setGateComplete] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [nameLanded, setNameLanded] = useState(false);
  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [heroFixedOpacity, setHeroFixedOpacity] = useState(1);
  const [activeSectionId, setActiveSectionId] = useState('scene-hero');
  const [showPocket, setShowPocket] = useState(false);
  const [, setCollectedCount] = useState(0);

  const [debugState, setDebugState] = useState<DebugState>({
    activeScene: 'gate',
    sceneProgress: 0,
    activeBeat: 'dark-gate',
  });

  const lenisRef = useRef<Lenis | null>(null);
  const logoSlotRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', nightMode);
  }, [nightMode]);

  useEffect(() => {
    return soundSystem.subscribe(setSoundEnabled);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!scrollUnlocked || popupOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
  }, [scrollUnlocked, popupOpen]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight || 800;
      const journeyEl = document.getElementById('scene-journey');
      const expEl = document.getElementById('scene-experiences');
      const skillsEl = document.getElementById('scene-skills');

      if (expEl && y > expEl.offsetTop - vh * 0.25) {
        setHeroFixedOpacity(0);
      } else {
        setHeroFixedOpacity(1);
      }

      if (expEl) {
        const inExperiences =
          y + vh * 0.72 >= expEl.offsetTop &&
          (!skillsEl || y < skillsEl.offsetTop);
        setShowPocket(inExperiences);
      }

      const sections = [
        'scene-connect',
        'scene-learning',
        'scene-languages',
        'scene-skills',
        'scene-experiences',
        'scene-journey',
        'scene-hero',
      ];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && y + vh * 0.35 >= el.offsetTop) {
          setActiveSectionId(id === 'scene-languages' ? 'scene-skills' : id);
          if (id === 'scene-hero' && journeyEl && y < journeyEl.offsetTop * 0.5) {
            setDebugState({ activeScene: 'hero', sceneProgress: y / vh, activeBeat: 'welcome' });
          } else if (id === 'scene-languages') {
            setDebugState({ activeScene: 'skills', sceneProgress: 1, activeBeat: 'languages' });
          } else if (id === 'scene-connect') {
            setDebugState({ activeScene: 'connect', sceneProgress: 1, activeBeat: 'boat-and-footer' });
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const offset = sectionId === 'scene-journey' ? (window.innerWidth >= 640 ? 116 : 88) : 0;
    const targetY = el.offsetTop + offset;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY, { duration: 1.4 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }, []);

  const handleBackToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSkipAllIntro = useCallback(() => {
    setLang('en');
    setNightMode(true);
    setSkipIntro(true);
    setGateComplete(true);
    setNavbarVisible(true);
    setNameLanded(true);
    setScrollUnlocked(true);
    setDebugState({ activeScene: 'hero', sceneProgress: 0, activeBeat: 'skipped' });
  }, []);

  const handleJourneyDebug = useCallback((progress: number, beat: string) => {
    setDebugState({ activeScene: 'journey', sceneProgress: progress, activeBeat: beat });
  }, []);

  const handleExperiencesDebug = useCallback((progress: number, beat: string) => {
    setDebugState({ activeScene: 'experiences', sceneProgress: progress, activeBeat: beat });
  }, []);

  const handleSkillsDebug = useCallback((progress: number, beat: string) => {
    setDebugState({ activeScene: 'skills', sceneProgress: progress, activeBeat: beat });
  }, []);

  const handleLearningDebug = useCallback((progress: number, beat: string) => {
    setDebugState({ activeScene: 'learning', sceneProgress: progress, activeBeat: beat });
  }, []);

  const handleNameLanded = useCallback(() => {
    setNameLanded(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setScrollUnlocked(true);
    setDebugState({ activeScene: 'hero', sceneProgress: 0, activeBeat: 'ready-to-scroll' });
  }, []);

  return (
    <div className="relative min-h-screen w-full font-body text-[var(--ink-primary)]">
      <PointerSparkles active={gateComplete} />

      <Navbar
        lang={lang}
        onToggleLang={setLang}
        nightMode={nightMode}
        onToggleNight={() => setNightMode((n) => !n)}
        soundEnabled={soundEnabled}
        onToggleSound={() => soundSystem.toggle()}
        visible={navbarVisible}
        nameLanded={nameLanded}
        activeSectionId={activeSectionId}
        onNavigate={handleNavigate}
        logoSlotRef={logoSlotRef}
      />

      {!gateComplete && (
        <SceneDarkGate
          lang={lang}
          onUnlockStart={() => {
            setLang('en');
            setNightMode(true);
            setNavbarVisible(true);
            setDebugState({ activeScene: 'gate', sceneProgress: 0.7, activeBeat: 'blooming-light' });
          }}
          onGateComplete={() => {
            setLang('en');
            setNightMode(true);
            setGateComplete(true);
            setNavbarVisible(true);
            setScrollUnlocked(true);
            setDebugState({ activeScene: 'hero', sceneProgress: 0, activeBeat: 'welcome' });
          }}
          onSkipIntro={handleSkipAllIntro}
        />
      )}

      <main>
        <SceneHero
          lang={lang}
          nightMode={nightMode}
          gateComplete={gateComplete}
          skipTyping={skipIntro}
          logoSlotRef={logoSlotRef}
          onNameLanded={handleNameLanded}
          onIntroComplete={handleIntroComplete}
          onStartJourneyClick={() => handleNavigate('scene-journey')}
          fixedOpacity={heroFixedOpacity}
        />

        <SceneJourney
          lang={lang}
          onJumpToFertical={() => {
            const expEl = document.getElementById('scene-experiences');
            if (!expEl) return;
            const totalScrollable = expEl.offsetHeight - window.innerHeight;
            const ferticalY = expEl.offsetTop + totalScrollable * 0.11;
            if (lenisRef.current) {
              lenisRef.current.scrollTo(ferticalY, { duration: 1.4 });
            } else {
              window.scrollTo(0, ferticalY);
            }
          }}
          onDebugUpdate={handleJourneyDebug}
        />

        <SceneExperiences
          lang={lang}
          showPocket={showPocket}
          onCollectedCountChange={setCollectedCount}
          onPopupOpenChange={setPopupOpen}
          onDebugUpdate={handleExperiencesDebug}
        />

        <SceneSkills onDebugUpdate={handleSkillsDebug} lang={lang} />

        <SceneLanguages lang={lang} />

        <SceneLearning
          lang={lang}
          onDebugUpdate={handleLearningDebug}
        />

        <div className="relative">
          <SceneProjectsTeaser lang={lang} />
          <SceneConnectFooter
            lang={lang}
            nightMode={nightMode}
            onNavigate={handleNavigate}
            onBackToTop={handleBackToTop}
          />
        </div>
      </main>

      <DebugOverlay state={debugState} />
    </div>
  );
}
