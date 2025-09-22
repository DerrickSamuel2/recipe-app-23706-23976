import React, { useEffect, useRef, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { RecipeAPI } from '../api/client';
import { useParams } from 'react-router-dom';

export default function CookingMode() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [idx, setIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    RecipeAPI.get(id).then(setRecipe);
    // prevent screen sleep (best-effort)
    let wakeLock = null;
    if ('wakeLock' in navigator) {
      // no await to avoid errors in some browsers
      navigator.wakeLock.request('screen').then((wl) => (wakeLock = wl)).catch(() => {});
    }
    return () => {
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, [id]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const speak = (text) => {
    if ('speechSynthesis' in window && text) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  const next = () => {
    setIdx((i) => {
      const ni = Math.min((recipe?.steps?.length || 1) - 1, i + 1);
      speak(recipe?.steps?.[ni]);
      return ni;
    });
  };
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  if (!recipe) {
    return (
      <AppShell>
        <Navbar />
        <main className="container cooking">Loading...</main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Navbar />
      <main className="container cooking">
        <h1>{recipe.title}</h1>
        <div className="card">
          <div className="step" aria-live="polite">{recipe.steps?.[idx]}</div>
          <div className="controls">
            <button className="btn" onClick={prev} aria-label="Previous step">◀ Prev</button>
            <button className="btn" onClick={next} aria-label="Next step">Next ▶</button>
            <button className="btn secondary" onClick={() => setRunning((r) => !r)} aria-pressed={running}>
              {running ? 'Pause Timer' : 'Start Timer'}
            </button>
            <button className="btn secondary" onClick={() => setTimer(0)}>Reset Timer</button>
            <button className="btn secondary" onClick={() => speak(recipe.steps?.[idx])}>Speak Step</button>
            <div aria-live="polite" role="status">⏱ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2,'0')}</div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
