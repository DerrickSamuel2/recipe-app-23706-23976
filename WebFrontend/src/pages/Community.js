import React, { useEffect, useState } from 'react';
import AppShell from '../App';
import Navbar from '../components/Navbar';
import { SocialAPI } from '../api/client';

export default function Community() {
  const [feed, setFeed] = useState([]);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    SocialAPI.feed().then((d) => setFeed(d?.items || [])).catch(() => setFeed([]));
    SocialAPI.communities().then((d) => setCommunities(d?.items || [])).catch(() => setCommunities([]));
  }, []);

  return (
    <AppShell>
      <Navbar />
      <main className="container">
        <div className="grid grid-2">
          <div className="card">
            <h2>Activity Feed</h2>
            <ul>
              {feed.map((f) => (
                <li key={f.id}>
                  <strong>{f.userName}</strong> {f.action} <em>{f.recipeTitle}</em>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h2>Communities</h2>
            <ul>
              {communities.map((c) => (
                <li key={c.id}>
                  {c.name} ({c.membersCount})
                  <button className="btn secondary" style={{ marginLeft: 8 }} onClick={async () => { await SocialAPI.joinCommunity(c.id); alert('Joined'); }}>
                    Join
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
