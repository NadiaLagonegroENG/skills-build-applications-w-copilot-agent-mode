import { useEffect, useState } from 'react'

const usersEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

const normalizeList = (payload) => (Array.isArray(payload) ? payload : payload?.results ?? [])

function Users() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('Loading profiles...')
  const [submitStatus, setSubmitStatus] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'student',
    fitnessLevel: 'beginner',
    goal: '',
    teamName: '',
  })

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch(usersEndpoint)
        const data = await response.json()
        setUsers(normalizeList(data))
        setStatus('')
      } catch {
        setStatus('Unable to load user profiles right now.')
      }
    }

    loadUsers()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitStatus('Saving profile...')

    try {
      const response = await fetch(usersEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const createdUser = await response.json()
      setUsers((currentUsers) =>
        [...currentUsers, createdUser].sort((left, right) => left.fullName.localeCompare(right.fullName)),
      )
      setFormData({
        fullName: '',
        email: '',
        role: 'student',
        fitnessLevel: 'beginner',
        goal: '',
        teamName: '',
      })
      setSubmitStatus('Profile created successfully.')
    } catch {
      setSubmitStatus('Unable to save this profile right now.')
    }
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 className="mb-1">User profiles</h2>
          <p className="text-secondary mb-0">
            Students and PE teachers can track goals, fitness levels, and team participation.
          </p>
        </div>
        <span className="badge text-bg-primary metric-badge">{users.length} active profiles</span>
      </div>

      {status ? <div className="alert alert-info">{status}</div> : null}

      <form className="card border-0 shadow-sm mb-4" onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h3 className="h5 mb-0">Add a student or teacher profile</h3>
            {submitStatus ? <span className="small text-secondary">{submitStatus}</span> : null}
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Full name"
                value={formData.fullName}
                onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="School email"
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={formData.role}
                onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={formData.fitnessLevel}
                onChange={(event) => setFormData((current) => ({ ...current, fitnessLevel: event.target.value }))}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Team name"
                value={formData.teamName}
                onChange={(event) => setFormData((current) => ({ ...current, teamName: event.target.value }))}
              />
            </div>
            <div className="col-12">
              <input
                className="form-control"
                placeholder="Primary fitness goal"
                value={formData.goal}
                onChange={(event) => setFormData((current) => ({ ...current, goal: event.target.value }))}
                required
              />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" type="submit">Create profile</button>
          </div>
        </div>
      </form>

      <div className="card-grid">
        {users.map((user) => (
          <article key={user._id || user.id || user.email} className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between gap-3 align-items-start mb-3">
                <div>
                  <h3 className="h5 mb-1">{user.fullName}</h3>
                  <p className="text-secondary mb-0">{user.email}</p>
                </div>
                <span className={`badge ${user.role === 'teacher' ? 'text-bg-warning' : 'text-bg-success'}`}>
                  {user.role}
                </span>
              </div>
              <p className="mb-2"><strong>Fitness level:</strong> {user.fitnessLevel}</p>
              <p className="mb-2"><strong>Goal:</strong> {user.goal}</p>
              <p className="mb-0"><strong>Team:</strong> {user.teamName || 'Not assigned yet'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Users
