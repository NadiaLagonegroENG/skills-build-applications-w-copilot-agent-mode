import { useEffect, useMemo, useState } from 'react'

const activitiesEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'
const usersEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

const normalizeList = (payload) => (Array.isArray(payload) ? payload : payload?.results ?? [])

function Activities() {
  const [activities, setActivities] = useState([])
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('Loading activity feed...')
  const [submitStatus, setSubmitStatus] = useState('')
  const [formData, setFormData] = useState({
    userId: '',
    type: 'running',
    durationMinutes: 20,
    points: 25,
    date: new Date().toISOString().slice(0, 10),
    note: '',
  })

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const [activitiesResponse, usersResponse] = await Promise.all([
          fetch(activitiesEndpoint),
          fetch(usersEndpoint),
        ])
        const [activitiesData, usersData] = await Promise.all([
          activitiesResponse.json(),
          usersResponse.json(),
        ])
        const loadedUsers = normalizeList(usersData)
        setActivities(normalizeList(activitiesData))
        setUsers(loadedUsers)
        setFormData((current) => ({
          ...current,
          userId: current.userId || loadedUsers[0]?.id || loadedUsers[0]?._id || '',
        }))
        setStatus('')
      } catch {
        setStatus('Unable to load activities right now.')
      }
    }

    loadActivities()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitStatus('Logging activity...')

    try {
      const response = await fetch(activitiesEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          durationMinutes: Number(formData.durationMinutes),
          points: Number(formData.points),
        }),
      })
      const createdActivity = await response.json()
      setActivities((currentActivities) => [createdActivity, ...currentActivities])
      setFormData((current) => ({ ...current, durationMinutes: 20, points: 25, note: '' }))
      setSubmitStatus('Activity logged successfully.')
    } catch {
      setSubmitStatus('Unable to log this activity right now.')
    }
  }

  const totalMinutes = useMemo(
    () => activities.reduce((sum, activity) => sum + Number(activity.durationMinutes || 0), 0),
    [activities],
  )

  return (
    <section>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 className="mb-1">Activity tracking</h2>
          <p className="text-secondary mb-0">
            Students can log workouts and teachers can monitor progress across the class.
          </p>
        </div>
        <span className="badge text-bg-primary metric-badge">{totalMinutes} total minutes logged</span>
      </div>

      {status ? <div className="alert alert-info">{status}</div> : null}

      <form className="card border-0 shadow-sm mb-4" onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h3 className="h5 mb-0">Log a new workout</h3>
            {submitStatus ? <span className="small text-secondary">{submitStatus}</span> : null}
          </div>
          <div className="row g-3">
            <div className="col-md-4">
              <select
                className="form-select"
                value={formData.userId}
                onChange={(event) => setFormData((current) => ({ ...current, userId: event.target.value }))}
                required
              >
                <option value="">Choose athlete</option>
                {users.map((user) => (
                  <option key={user._id || user.id || user.email} value={user._id || user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={formData.type}
                onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
              >
                <option value="running">Running</option>
                <option value="walking">Walking</option>
                <option value="strength">Strength</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                min="1"
                type="number"
                value={formData.durationMinutes}
                onChange={(event) => setFormData((current) => ({ ...current, durationMinutes: event.target.value }))}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                min="1"
                type="number"
                value={formData.points}
                onChange={(event) => setFormData((current) => ({ ...current, points: event.target.value }))}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                type="date"
                value={formData.date}
                onChange={(event) => setFormData((current) => ({ ...current, date: event.target.value }))}
                required
              />
            </div>
            <div className="col-12">
              <input
                className="form-control"
                placeholder="Add a short note"
                value={formData.note}
                onChange={(event) => setFormData((current) => ({ ...current, note: event.target.value }))}
              />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" type="submit">Log activity</button>
          </div>
        </div>
      </form>

      <div className="row g-3">
        {activities.map((activity) => (
          <div className="col-md-6 col-xl-4" key={activity._id || activity.id}>
            <article className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 mb-0 text-capitalize">{activity.type}</h3>
                  <span className="badge text-bg-success">{activity.points} pts</span>
                </div>
                <p className="mb-2"><strong>Athlete:</strong> {activity.userName || activity.userId}</p>
                <p className="mb-2"><strong>Duration:</strong> {activity.durationMinutes} minutes</p>
                <p className="mb-2"><strong>Date:</strong> {activity.date}</p>
                <p className="mb-0 text-secondary">{activity.note}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Activities
