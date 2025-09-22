import React, { useEffect, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { RecipeAPI } from '../api/client';
import { Link } from 'react-router-dom';

export default function Recipes() {
  const [q, setQ] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [diets, setDiets] = useState([]);
  const [results, setResults] = useState([]);

  const search = async (e) => {
    e?.preventDefault();
    try {
      const res = await RecipeAPI.search({
        q,
        ingredients: ingredients.split(',').map(s => s.trim()).filter(Boolean),
        diets,
        page: 1,
      });
      setResults(res?.items || []);
    } catch {
      setResults([]);
    }
  };

  useEffect(() => { search(); /* initial */ // eslint-disable-next-line
  }, []);

  return (
    <AppShell>
      <Navbar />
      <main className="container">
        <div className="card">
          <form onSubmit={search}>
            <div className="grid grid-3">
              <div>
                <label htmlFor="q">Search</label>
                <input id="q" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g., pasta" />
              </div>
              <div>
                <label htmlFor="ing">Ingredients</label>
                <input id="ing" className="input" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="tomato, garlic" />
              </div>
              <div>
                <label>Dietary</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['vegetarian', 'vegan', 'gluten-free', 'keto'].map((d) => (
                    <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={diets.includes(d)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...diets, d]
                            : diets.filter((x) => x !== d);
                          setDiets(next);
                        }}
                      />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button className="btn" type="submit" style={{ marginTop: 12 }}>Search</button>
            <Link to="/recipes/new" className="btn secondary" style={{ marginLeft: 8 }}>Add Recipe</Link>
          </form>
        </div>
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {results.map((r) => (
            <Link key={r.id} to={`/recipes/${r.id}`} className="card" aria-label={r.title}>
              <img src={r.imageUrl} alt="" style={{ width: '100%', borderRadius: 10 }} />
              <h3>{r.title}</h3>
              <p style={{ color: 'var(--muted)' }}>{r.cuisine} • {r.readyInMinutes} min</p>
            </Link>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
