import React, { useEffect, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { RecipeAPI } from '../api/client';
import { useNavigate, useParams } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

function RecipeEditorInner() {
  const { id } = useParams();
  const nav = useNavigate();
  const editing = id !== 'new';
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    cuisine: '',
    readyInMinutes: 30,
    ingredients: '',
    steps: '',
  });

  useEffect(() => {
    if (editing) {
      RecipeAPI.get(id).then((r) => {
        setForm({
          title: r.title || '',
          imageUrl: r.imageUrl || '',
          cuisine: r.cuisine || '',
          readyInMinutes: r.readyInMinutes || 30,
          ingredients: (r.ingredients || []).join('\n'),
          steps: (r.steps || []).join('\n'),
        });
      });
    }
  }, [editing, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      ingredients: form.ingredients.split('\n').map((s) => s.trim()).filter(Boolean),
      steps: form.steps.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await RecipeAPI.update(id, payload);
        nav(`/recipes/${id}`);
      } else {
        const created = await RecipeAPI.create(payload);
        nav(`/recipes/${created.id}`);
      }
    } catch {
      alert('Failed to save recipe');
    }
  };

  return (
    <main className="container">
      <div className="card">
        <h1>{editing ? 'Edit Recipe' : 'New Recipe'}</h1>
        <form onSubmit={onSubmit}>
          <label htmlFor="title">Title</label>
          <input id="title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <label htmlFor="imageUrl" style={{ marginTop: 8 }}>Image URL</label>
          <input id="imageUrl" className="input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />

          <label htmlFor="cuisine" style={{ marginTop: 8 }}>Cuisine</label>
          <input id="cuisine" className="input" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} />

          <label htmlFor="rim" style={{ marginTop: 8 }}>Ready in minutes</label>
          <input id="rim" className="input" type="number" min="0" value={form.readyInMinutes} onChange={(e) => setForm({ ...form, readyInMinutes: Number(e.target.value) })} />

          <label htmlFor="ingredients" style={{ marginTop: 8 }}>Ingredients (one per line)</label>
          <textarea id="ingredients" className="textarea" rows="6" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />

          <label htmlFor="steps" style={{ marginTop: 8 }}>Steps (one per line)</label>
          <textarea id="steps" className="textarea" rows="8" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} />

          <button className="btn" type="submit" style={{ marginTop: 12 }}>Save</button>
        </form>
      </div>
    </main>
  );
}

export default function RecipeEdit() {
  return (
    <AppShell>
      <Navbar />
      <ProtectedRoute>
        <RecipeEditorInner />
      </ProtectedRoute>
    </AppShell>
  );
}
