import { useEffect, useState } from 'react'

const workoutsEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

const normalizeList = (payload) => (Array.isArray(payload) ? payload : payload?.results ?? [])

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [status, setStatus] = useState('Loading workout suggestions...')
  const [targetLevel, setTargetLevel] = useState('beginner')

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const requestUrl = targetLevel
          ? `${workoutsEndpoint}?targetLevel=${encodeURIComponent(targetLevel)}`
          : workoutsEndpoint
        const response = await fetch(requestUrl)
        const data = await response.json()
        setWorkouts(normalizeList(data))
        setStatus('')
      } catch {
        setStatus('Unable to load workout suggestions right now.')
      }
    }

    loadWorkouts()
  }, [targetLevel])

  return (
    <section>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 className="mb-1">Personalized workout suggestions</h2>
          <p className="text-secondary mb-0">
            Recommendations are tailored by fitness level and role so everyone can keep improving.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="small text-secondary" htmlFor="targetLevel">Level</label>
          <select
            id="targetLevel"
            className="form-select form-select-sm"
            value={targetLevel}
            onChange={(event) => setTargetLevel(event.target.value)}
          >
            <option value="">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <span className="badge text-bg-primary metric-badge">{workouts.length} plans available</span>
        </div>
      </div>

      {status ? <div className="alert alert-info">{status}</div> : null}

      <div className="row g-3">
        {workouts.map((workout) => (
          <div className="col-md-6 col-xl-4" key={workout._id || workout.id || workout.title}>
            <article className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h3 className="h5 mb-1">{workout.title}</h3>
                    <p className="text-secondary mb-0">{workout.focus}</p>
                  </div>
                  <span className="badge text-bg-info text-dark">{workout.targetLevel}</span>
                </div>
                <p className="mb-2"><strong>Duration:</strong> {workout.durationMinutes} minutes</p>
                <p className="mb-2"><strong>Designed for:</strong> {(workout.assignedRoles ?? []).join(', ')}</p>
                <p className="mb-0 text-secondary">{workout.description}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Workouts
