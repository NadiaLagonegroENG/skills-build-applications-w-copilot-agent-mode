import { useEffect, useState } from 'react'

const leaderboardEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

const normalizeList = (payload) => (Array.isArray(payload) ? payload : payload?.results ?? [])

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('Loading leaderboard...')

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const response = await fetch(leaderboardEndpoint)
        const data = await response.json()
        setEntries(normalizeList(data))
        setStatus('')
      } catch {
        setStatus('Unable to load leaderboard right now.')
      }
    }

    loadLeaderboard()
  }, [])

  return (
    <section>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 className="mb-1">Competitive leaderboard</h2>
          <p className="text-secondary mb-0">
            Friendly competition helps students stay motivated while teachers spotlight progress.
          </p>
        </div>
        <span className="badge text-bg-primary metric-badge">Top {entries.length} athletes tracked</span>
      </div>

      {status ? <div className="alert alert-info">{status}</div> : null}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped mb-0 align-middle">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Athlete</th>
                <th scope="col">Team</th>
                <th scope="col">Badge</th>
                <th scope="col" className="text-end">Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id || entry.id || entry.userId}>
                  <td>#{entry.rank}</td>
                  <td>{entry.userName}</td>
                  <td>{entry.teamName}</td>
                  <td>{entry.badge}</td>
                  <td className="text-end fw-semibold">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Leaderboard
