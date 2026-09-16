import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import { connectDatabase, isDatabaseConnected } from './config/database';
import { sampleActivities, sampleLeaderboardEntries, sampleTeams, sampleUsers, sampleWorkoutPlans } from './data/sampleData';
import Activity from './models/Activity';
import LeaderboardEntry from './models/LeaderboardEntry';
import Team from './models/Team';
import User from './models/User';
import Workout from './models/Workout';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : `http://localhost:${port}`;
const activityTypes = ['running', 'walking', 'strength'] as const;
const fitnessLevels = ['beginner', 'intermediate', 'advanced'] as const;

connectDatabase();

app.use(cors());
app.use(express.json());

const memoryStore = {
  users: [...sampleUsers],
  teams: [...sampleTeams],
  activities: [...sampleActivities],
  workouts: [...sampleWorkoutPlans],
  leaderboard: [...sampleLeaderboardEntries]
};

const respondWithResults = (response: express.Response, results: unknown[]) => {
  response.json({ count: results.length, results });
};

const getBadge = (role: string, rank: number) => {
  if (role === 'teacher') {
    return 'Coach Mentor';
  }

  if (rank === 1) {
    return 'Goal Getter';
  }

  if (rank === 2) {
    return 'Rising Runner';
  }

  return 'Step Streak';
};

const readRateLimit = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

const writeRateLimit = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

const sanitizeMemberIds = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(
        (memberId): memberId is string =>
          typeof memberId === 'string' && mongoose.Types.ObjectId.isValid(memberId)
      )
    : [];

const getTargetLevel = (value: unknown) =>
  typeof value === 'string' && fitnessLevels.includes(value as (typeof fitnessLevels)[number])
    ? value
    : undefined;

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const refreshDatabaseLeaderboard = async () => {
  const [users, activities, teams] = await Promise.all([
    User.find().lean(),
    Activity.find().lean(),
    Team.find().lean()
  ]);

  const totals = new Map<string, number>();

  for (const activity of activities) {
    const userId = String(activity.userId);
    totals.set(userId, (totals.get(userId) || 0) + Number(activity.points || 0));
  }

  const entries = users
    .map((user) => ({
      userId: user._id,
      userName: user.fullName,
      teamName: user.teamName || 'Independent',
      points: totals.get(String(user._id)) || 0,
      rank: 0,
      badge: ''
    }))
    .sort((left, right) => right.points - left.points)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      badge: getBadge(
        users.find((user) => String(user._id) === String(entry.userId))?.role || 'student',
        index + 1
      )
    }));

  await LeaderboardEntry.deleteMany({});

  if (entries.length > 0) {
    await LeaderboardEntry.insertMany(entries);
  }

  const teamTotals = new Map<string, number>();

  for (const entry of entries) {
    teamTotals.set(entry.teamName, (teamTotals.get(entry.teamName) || 0) + entry.points);
  }

  await Promise.all(
    teams.map((team) =>
      Team.updateOne({ _id: team._id }, { points: teamTotals.get(team.name) || 0 })
    )
  );
};

const refreshInMemoryLeaderboard = () => {
  const totals = new Map<string, number>();

  for (const activity of memoryStore.activities) {
    totals.set(activity.userId, (totals.get(activity.userId) || 0) + activity.points);
  }

  memoryStore.leaderboard = memoryStore.users
    .map((user) => ({
      id: `l-${user.id}`,
      userId: user.id,
      userName: user.fullName,
      teamName: user.teamName,
      points: totals.get(user.id) || 0,
      rank: 0,
      badge: user.role === 'teacher' ? 'Coach Mentor' : 'Goal Getter'
    }))
    .sort((left, right) => right.points - left.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  memoryStore.teams = memoryStore.teams.map((team) => ({
    ...team,
    points: memoryStore.leaderboard
      .filter((entry) => entry.teamName === team.name)
      .reduce((total, entry) => total + entry.points, 0)
  }));
};

refreshInMemoryLeaderboard();

app.get('/api', (_request, response) => {
  response.json({
    application: 'OctoFit Tracker',
    baseUrl,
    endpoints: ['/api/users/', '/api/teams/', '/api/activities/', '/api/leaderboard/', '/api/workouts/'],
    databaseConnected: isDatabaseConnected()
  });
});

app.get('/api/users/', readRateLimit, async (_request, response) => {
  if (isDatabaseConnected()) {
    const users = await User.find().sort({ fullName: 1 }).lean();
    return respondWithResults(response, users);
  }

  return respondWithResults(response, memoryStore.users);
});

app.post('/api/users/', writeRateLimit, async (request, response) => {
  const payload = {
    fullName: normalizeText(request.body.fullName),
    email: normalizeText(request.body.email),
    role: request.body.role === 'teacher' ? 'teacher' : 'student',
    fitnessLevel: getTargetLevel(request.body.fitnessLevel) || 'beginner',
    goal: normalizeText(request.body.goal),
    teamName: normalizeText(request.body.teamName)
  };

  if (isDatabaseConnected()) {
    const user = await User.create(payload);
    return response.status(201).json(user);
  }

  const user = { id: `u${memoryStore.users.length + 1}`, ...payload };
  memoryStore.users.push(user);
  refreshInMemoryLeaderboard();
  return response.status(201).json(user);
});

app.get('/api/teams/', readRateLimit, async (_request, response) => {
  if (isDatabaseConnected()) {
    const teams = await Team.find().sort({ points: -1, name: 1 }).lean();
    return respondWithResults(response, teams);
  }

  return respondWithResults(response, memoryStore.teams);
});

app.post('/api/teams/', writeRateLimit, async (request, response) => {
  const memberIds = sanitizeMemberIds(request.body.memberIds);
  const payload = {
    name: normalizeText(request.body.name),
    description: normalizeText(request.body.description),
    coach: normalizeText(request.body.coach),
    goal: normalizeText(request.body.goal),
    memberIds
  };

  if (isDatabaseConnected()) {
    const team = await Team.create(payload);

    if (memberIds.length > 0) {
      await User.updateMany({ _id: { $in: memberIds } }, { teamName: payload.name });
    }

    await refreshDatabaseLeaderboard();

    return response.status(201).json(team);
  }

  const team = { id: `t${memoryStore.teams.length + 1}`, points: 0, ...payload, memberIds };
  memoryStore.teams.push(team);
  if (memberIds.length > 0) {
    memoryStore.users = memoryStore.users.map((user) =>
      memberIds.includes(user.id) ? { ...user, teamName: payload.name } : user
    );
  }
  refreshInMemoryLeaderboard();
  return response.status(201).json(team);
});

app.get('/api/activities/', readRateLimit, async (_request, response) => {
  if (isDatabaseConnected()) {
    const [activities, users] = await Promise.all([
      Activity.find().sort({ createdAt: -1 }).lean(),
      User.find().lean()
    ]);
    const userNames = new Map(users.map((user) => [String(user._id), user.fullName]));

    return respondWithResults(
      response,
      activities.map((activity) => ({
        ...activity,
        userName: userNames.get(String(activity.userId)) || String(activity.userId)
      }))
    );
  }

  return respondWithResults(response, memoryStore.activities);
});

app.post('/api/activities/', writeRateLimit, async (request, response) => {
  const userId = normalizeText(request.body.userId);
  const type = activityTypes.includes(request.body.type) ? request.body.type : 'running';
  const payload = {
    userId,
    type,
    durationMinutes: Number(request.body.durationMinutes),
    points: Number(request.body.points),
    date: normalizeText(request.body.date),
    note: normalizeText(request.body.note)
  };

  if (!payload.userId) {
    return response.status(400).json({ message: 'A userId is required.' });
  }

  if (!Number.isFinite(payload.durationMinutes) || !Number.isFinite(payload.points)) {
    return response.status(400).json({ message: 'Duration and points must be numeric values.' });
  }

  if (isDatabaseConnected()) {
    if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
      return response.status(400).json({ message: 'The userId must be a valid ObjectId.' });
    }

    const activity = await Activity.create(payload);
    const user = await User.findById(payload.userId).lean();
    await refreshDatabaseLeaderboard();
    return response.status(201).json({
      ...activity.toObject(),
      userName: user?.fullName || String(payload.userId)
    });
  }

  const matchingUser = memoryStore.users.find((user) => user.id === payload.userId);
  const activity = {
    id: `a${memoryStore.activities.length + 1}`,
    ...payload,
    userName: matchingUser?.fullName || 'Unknown athlete'
  };

  memoryStore.activities.unshift(activity);
  refreshInMemoryLeaderboard();
  return response.status(201).json(activity);
});

app.get('/api/leaderboard/', readRateLimit, async (_request, response) => {
  if (isDatabaseConnected()) {
    const entries = await LeaderboardEntry.find().sort({ rank: 1 }).lean();
    return respondWithResults(response, entries);
  }

  return respondWithResults(response, memoryStore.leaderboard);
});

app.get('/api/workouts/', readRateLimit, async (request, response) => {
  const targetLevel = getTargetLevel(request.query.targetLevel);

  if (isDatabaseConnected()) {
    const filter = targetLevel ? { targetLevel } : {};
    const workouts = await Workout.find(filter).sort({ durationMinutes: 1 }).lean();
    return respondWithResults(response, workouts);
  }

  const workouts = targetLevel
    ? memoryStore.workouts.filter((workout) => workout.targetLevel === targetLevel)
    : memoryStore.workouts;

  return respondWithResults(response, workouts);
});

app.listen(port, () => {
  console.log(`OctoFit Tracker API listening on ${baseUrl}`);
});
