import React, { useEffect, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { PremiumAPI } from '../api/client';

export default function Premium() {
  const [status, setStatus] = useState({ active: false });
  useEffect(() => {
    PremiumAPI.status().then(setStatus).catch(() => setStatus({ active: false }));
  }, []);

  const subscribe = async () => {
    await PremiumAPI.subscribe('premium-monthly');
    const s = await PremiumAPI.status();
    setStatus(s);
  };

  const cancel = async () => {
    await PremiumAPI.cancel();
    const s = await PremiumAPI.status();
    setStatus(s);
  };

  return (
    <AppShell>
      <Navbar />
      <main className="container">
        <div className="card">
          <h1>Premium</h1>
          <p>Unlock advanced meal planning, nutritional analysis, exclusive recipes, and ad-free experience.</p>
          {status.active ? (
            <div>
              <p>Status: Active</p>
              <button className="btn warn" onClick={cancel}>Cancel Subscription</button>
            </div>
          ) : (
            <div>
              <p>Status: Not active</p>
              <button className="btn" onClick={subscribe}>Subscribe</button>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
