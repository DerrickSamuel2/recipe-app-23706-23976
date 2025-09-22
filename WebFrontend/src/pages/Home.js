import React, { useEffect, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { RecipeAPI } from '../api/client';
import { Link } from 'react-router-dom';

export default function Home() {
  const [recs, setRecs] = useState([]);
  useEffect(() => {
    RecipeAPI.recommendations()
      .then(setRecs)
      .catch(() => setRecs([]));
  }, []);

  return (
    <AppShell>
      <Navbar />
      <main className="container">
        <section className="card">
          <h1 style={{ marginTop: 0 }}>Discover Recipes</h1>
          <p>Personalized recommendations based on your preferences.</p>
        </section>

        <section style={{ marginTop: '1rem' }}>
          <div className="grid grid-3">
            {recs.map((r) => (
              <Link key={r.id} to={`/recipes/${r.id}`} className="card" aria-label={r.title}>
                <img src={r.imageUrl} alt="" style={{ width: '100%', borderRadius: 10 }} />
                <h3>{r.title}</h3>
                <p style={{ color: 'var(--muted)' }}>{r.cuisine} • {r.readyInMinutes} min</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <footer className="footer container">© {new Date().getFullYear()} Recipe App</footer>
    </AppShell>
  );
}
