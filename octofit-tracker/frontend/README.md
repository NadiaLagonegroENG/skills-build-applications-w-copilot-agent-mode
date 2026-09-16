# OctoFit Tracker frontend

This React 19 + Vite app consumes the OctoFit Tracker API.

## Codespaces configuration

Create `/home/runner/work/skills-build-applications-w-copilot-agent-mode/skills-build-applications-w-copilot-agent-mode/octofit-tracker/frontend/.env.local` with:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

When `VITE_CODESPACE_NAME` is defined, the app uses URLs like:

```text
https://your-codespace-name-8000.app.github.dev/api/users/
```

If `VITE_CODESPACE_NAME` is unset, the frontend safely falls back to `http://localhost:8000`.
