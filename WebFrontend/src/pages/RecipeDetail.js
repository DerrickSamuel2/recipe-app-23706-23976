import React, { useContext, useEffect, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { RecipeAPI, SocialAPI } from '../api/client';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

export default function RecipeDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [review, setReview] = useState({ rating: 5, review: '' });

  useEffect(() => {
    RecipeAPI.get(id).then(setRecipe).catch(() => setRecipe(null));
  }, [id]);

  const onDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await RecipeAPI.remove(id);
      nav('/recipes');
    } catch {
      /* no-op */
    }
  };

  const onSave = async () => {
    try {
      await RecipeAPI.save(id);
      alert('Saved to your collection');
    } catch {}
  };

  const onShare = async () => {
    try {
      await SocialAPI.shareRecipe(id, 'in-app');
      alert('Shared!');
    } catch {}
  };

  const onReview = async (e) => {
    e.preventDefault();
    try {
      await RecipeAPI.rate(id, review.rating, review.review);
      alert('Thanks for your review!');
    } catch {}
  };

  if (!recipe) {
    return (
      <AppShell>
        <Navbar />
        <main className="container">Loading...</main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Navbar />
      <main className="container">
        <div className="grid grid-2">
          <div className="card">
            <img src={recipe.imageUrl} alt="" style={{ width: '100%', borderRadius: 10 }} />
          </div>
          <div className="card">
            <h1>{recipe.title}</h1>
            <p style={{ color: 'var(--muted)' }}>{recipe.cuisine} • {recipe.readyInMinutes} min</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              <button className="btn" onClick={() => nav(`/cook/${recipe.id}`)}>Start Cooking</button>
              {isAuthenticated && (
                <>
                  <button className="btn secondary" onClick={onSave}>Save</button>
                  <button className="btn secondary" onClick={onShare}>Share</button>
                  <Link className="btn secondary" to={`/recipes/${recipe.id}/edit`}>Edit</Link>
                  <button className="btn warn" onClick={onDelete}>Delete</button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <div className="card">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients?.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h2>Instructions</h2>
            <ol>
              {recipe.steps?.map((s, idx) => (
                <li key={idx} className="step">{s}</li>
              ))}
            </ol>
          </div>
        </div>

        {isAuthenticated && (
          <div className="card" style={{ marginTop: 16 }}>
            <h2>Leave a review</h2>
            <form onSubmit={onReview}>
              <label htmlFor="rating">Rating</label>
              <select id="rating" className="select" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <label htmlFor="review" style={{ marginTop: 8 }}>Review</label>
              <textarea id="review" className="textarea" value={review.review} onChange={(e) => setReview({ ...review, review: e.target.value })} />
              <button className="btn" type="submit" style={{ marginTop: 12 }}>Submit</button>
            </form>
          </div>
        )}
      </main>
    </AppShell>
  );
}
