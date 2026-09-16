import { NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

const navItems = [
  { to: '/', label: 'Profiles' },
  { to: '/activities', label: 'Activities' },
  { to: '/teams', label: 'Teams' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
]

function App() {
  return (
    <div className="app-shell bg-body-tertiary min-vh-100">
      <header className="bg-primary text-white shadow-sm">
        <div className="container py-4">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <img src={logo} alt="OctoFit Tracker" className="app-logo rounded-circle bg-white p-1" />
              <div>
                <p className="text-uppercase mb-1 small fw-semibold letter-spaced">Mergington High School</p>
                <h1 className="h2 mb-1">OctoFit Tracker</h1>
                <p className="mb-0 text-white-50">
                  Social fitness tracking for students and physical education teachers.
                </p>
              </div>
            </div>
            <div className="alert alert-light py-2 px-3 mb-0 small env-note">
              Define <code>VITE_CODESPACE_NAME</code> in <code>.env.local</code> for Codespaces.
              The app safely falls back to <code>http://localhost:8000</code> when it is unset.
            </div>
          </div>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container">
          <ul className="navbar-nav flex-row flex-wrap gap-2 py-2">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link px-3 rounded-pill ${isActive ? 'active bg-primary text-white' : 'text-primary'}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
