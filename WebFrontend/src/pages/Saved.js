import React, { useEffect, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { RecipeAPI } from '../api/client';
import { Link } from 'react-router-dom';

function SavedInner() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    RecipeAPI.search({ q: '', diets: [], ingredients: [], page: 1 }) // Replace with dedicated "saved" endpoint if available.
      .then((d) => setItems(d?.saved || []))
      .catch(() => setItems([]));
  }, []);
  return (
    <main className="container">
      <h1>Saved recipes</h1>
      <div className="grid grid-3">
        {items.map((r) => (
          <Link key={r.id} to={`/recipes/${r.id}`} className="card">
            <img src={r.imageUrl} alt="" style={{ width: '100%', borderRadius: 10 }} />
            <h3>{r.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default function Saved() {
  return (
    <AppShell>
      <Navbar />
      <ProtectedRoute>
        <SavedInner />
      </ProtectedRoute>
    </AppShell>
  );
}
