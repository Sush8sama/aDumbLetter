import React from 'react';

export default function Home({ onStart }) {
  return (
    <div className="home">
      <div className="home-content">
        <h1 className="home-title">dumb letter</h1>
        <button className="home-open" onClick={onStart}>see envelope</button>
      </div>
    </div>
  );
}


