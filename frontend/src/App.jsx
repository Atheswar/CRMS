// filepath: c:\Users\HP\Downloads\crms\frontend\src\App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Users from './components/Users'
import Resources from './components/Resources'
import Bookings from './components/Bookings'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>📅 CRMS</h1>
            <p className="subtitle">Conference Room Management System</p>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">👥 Users</Link>
            </li>
            <li>
              <Link to="/resources">🏛️ Resources</Link>
            </li>
            <li>
              <Link to="/bookings">📅 Bookings</Link>
            </li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </div>

        <footer className="footer">
          <p>© 2026 CRMS - Built with ❤️ using React & Spring Boot</p>
        </footer>
      </div>
    </Router>
  )
}

export default App