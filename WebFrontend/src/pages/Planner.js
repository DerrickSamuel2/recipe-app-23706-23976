import React, { useEffect, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { MealPlanAPI } from '../api/client';
import dayjs from 'dayjs';

function PlannerInner() {
  const [start, setStart] = useState(dayjs().startOf('week').format('YYYY-MM-DD'));
  const [plan, setPlan] = useState({});

  const load = async () => {
    const data = await MealPlanAPI.get('week', start);
    setPlan(data || {});
  };

  useEffect(() => { load(); }, [start]);

  const days = Array.from({ length: 7 }).map((_, i) => dayjs(start).add(i, 'day'));

  return (
    <main className="container">
      <div className="card">
        <h1>Meal Planner</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label htmlFor="start">Week start</label>
          <input id="start" className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <button className="btn" onClick={load}>Refresh</button>
          <button className="btn secondary" onClick={async () => {
            const gl = await MealPlanAPI.groceryList({ startDate: start, endDate: dayjs(start).add(6,'day').format('YYYY-MM-DD') });
            alert(`Grocery list generated with ${gl?.items?.length || 0} items.`);
          }}>Generate Grocery List</button>
          <button className="btn secondary" onClick={async () => { await MealPlanAPI.savePlan(`Plan ${start}`); alert('Plan saved'); }}>Save Plan</button>
        </div>
      </div>

      <div className="calendar" style={{ marginTop: 16 }}>
        {days.map((d) => {
          const entries = plan[d.format('YYYY-MM-DD')] || [];
          return (
            <div key={d.toString()} className="day">
              <strong>{d.format('ddd DD')}</strong>
              <ul>
                {entries.map((e) => (
                  <li key={e.id}>{e.mealType}: {e.recipeTitle} ({e.servings})
                    <button className="btn secondary" style={{ marginLeft: 8 }} onClick={async () => { await MealPlanAPI.removeEntry(e.id); load(); }}>Remove</button>
                  </li>
                ))}
              </ul>
              <AddEntry date={d.format('YYYY-MM-DD')} onAdded={load} />
            </div>
          );
        })}
      </div>
    </main>
  );
}

function AddEntry({ date, onAdded }) {
  const [mealType, setMealType] = useState('dinner');
  const [recipeId, setRecipeId] = useState('');
  const [servings, setServings] = useState(1);
  const add = async () => {
    if (!recipeId) return;
    await MealPlanAPI.setEntry(date, mealType, recipeId, servings);
    setRecipeId('');
    onAdded && onAdded();
  };
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <select className="select" value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
        <input className="input" placeholder="Recipe ID" value={recipeId} onChange={(e) => setRecipeId(e.target.value)} />
        <input className="input" type="number" min="1" value={servings} onChange={(e) => setServings(Number(e.target.value))} />
        <button className="btn" onClick={add}>Add</button>
      </div>
    </div>
  );
}

export default function Planner() {
  return (
    <AppShell>
      <Navbar />
      <ProtectedRoute>
        <PlannerInner />
      </ProtectedRoute>
    </AppShell>
  );
}
