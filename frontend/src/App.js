import React, { useState } from 'react';
import Users from './components/Users';
import Resources from './components/Resources';
import Bookings from './components/Bookings';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className="app">
      <header className="header">
        <h1>Conference Room Management System</h1>
        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button
            className={`nav-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </nav>
      </header>

      <main className="main">
        {activeTab === 'bookings' && <Bookings />}
        {activeTab === 'resources' && <Resources />}
        {activeTab === 'users' && <Users />}
      </main>

      <footer className="footer">
        <p>&copy; 2026 CRMS - Conference Room Management System</p>
      </footer>
    </div>
  );
}

export default App;
