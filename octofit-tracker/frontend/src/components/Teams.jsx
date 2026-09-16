import { useEffect, useState } from 'react'

const teamsEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/'

const normalizeList = (payload) => (Array.isArray(payload) ? payload : payload?.results ?? [])

function Teams() {
  const [teams, setTeams] = useState([])
  const [status, setStatus] = useState('Loading team standings...')
  const [submitStatus, setSubmitStatus] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coach: '',
    goal: '',
    memberIds: [],
  })

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetch(teamsEndpoint)
        const data = await response.json()
        setTeams(normalizeList(data))
        setStatus('')
      } catch {
        setStatus('Unable to load teams right now.')
      }
    }

    loadTeams()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitStatus('Saving team...')

    try {
      const response = await fetch(teamsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const createdTeam = await response.json()
      setTeams((currentTeams) => [...currentTeams, createdTeam])
      setFormData({
        name: '',
        description: '',
        coach: '',
        goal: '',
        memberIds: [],
      })
      setSubmitStatus('Team created successfully.')
    } catch {
      setSubmitStatus('Unable to save this team right now.')
    }
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 className="mb-1">Team management</h2>
          <p className="text-secondary mb-0">
            Create supportive groups, set shared goals, and celebrate collaborative progress.
          </p>
        </div>
        <span className="badge text-bg-primary metric-badge">{teams.length} active teams</span>
      </div>

      {status ? <div className="alert alert-info">{status}</div> : null}

      <form className="card border-0 shadow-sm mb-4" onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h3 className="h5 mb-0">Create a new team</h3>
            {submitStatus ? <span className="small text-secondary">{submitStatus}</span> : null}
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Team name"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Coach name"
                value={formData.coach}
                onChange={(event) => setFormData((current) => ({ ...current, coach: event.target.value }))}
                required
              />
            </div>
            <div className="col-12">
              <input
                className="form-control"
                placeholder="Short team description"
                value={formData.description}
                onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                required
              />
            </div>
            <div className="col-12">
              <input
                className="form-control"
                placeholder="Shared team goal"
                value={formData.goal}
                onChange={(event) => setFormData((current) => ({ ...current, goal: event.target.value }))}
                required
              />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" type="submit">Create team</button>
          </div>
        </div>
      </form>

      <div className="row g-3">
        {teams.map((team) => (
          <div className="col-md-6" key={team._id || team.id || team.name}>
            <article className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h3 className="h5 mb-1">{team.name}</h3>
                    <p className="text-secondary mb-0">{team.description}</p>
                  </div>
                  <span className="badge text-bg-warning">{team.points} pts</span>
                </div>
                <p className="mb-2"><strong>Coach:</strong> {team.coach}</p>
                <p className="mb-2"><strong>Goal:</strong> {team.goal}</p>
                <p className="mb-0"><strong>Members:</strong> {team.memberIds?.length ?? 0}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Teams
