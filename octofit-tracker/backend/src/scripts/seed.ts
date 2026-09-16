import mongoose from 'mongoose';

import { connectionString } from '../config/database';
import { sampleActivities, sampleTeams, sampleUsers, sampleWorkoutPlans } from '../data/sampleData';
import Activity from '../models/Activity';
import LeaderboardEntry from '../models/LeaderboardEntry';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

/**
 * Seed the octofit_db database with test data
 */
function getBadge(role: string, rank: number) {
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
}

async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({})
    ]);

    const createdUsers = await User.insertMany(
      sampleUsers.map(({ id: _id, ...user }) => user)
    );

    const userIdBySampleId = new Map(sampleUsers.map((user, index) => [user.id, createdUsers[index]._id]));

    const createdTeams = await Team.insertMany(
      sampleTeams.map(({ id: _id, memberIds, ...team }) => ({
        ...team,
        points: 0,
        memberIds: memberIds.map((memberId) => userIdBySampleId.get(memberId))
      }))
    );

    await Activity.insertMany(
      sampleActivities.map(({ id: _id, userId, userName: _userName, ...activity }) => ({
        ...activity,
        userId: userIdBySampleId.get(userId)
      }))
    );

    await Workout.insertMany(sampleWorkoutPlans.map(({ id: _id, ...workout }) => workout));

    const totals = new Map<string, number>();

    for (const activity of sampleActivities) {
      totals.set(activity.userId, (totals.get(activity.userId) || 0) + activity.points);
    }

    const leaderboardEntries = sampleUsers
      .map((user) => ({
        userId: userIdBySampleId.get(user.id),
        userName: user.fullName,
        teamName: user.teamName || 'Independent',
        points: totals.get(user.id) || 0,
        rank: 0,
        badge: '',
        role: user.role
      }))
      .sort((left, right) => right.points - left.points)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        badge: getBadge(entry.role, index + 1)
      }));

    await LeaderboardEntry.insertMany(
      leaderboardEntries.map(({ role, ...entry }) => entry)
    );

    const teamTotals = new Map<string, number>();

    for (const entry of leaderboardEntries) {
      teamTotals.set(entry.teamName, (teamTotals.get(entry.teamName) || 0) + entry.points);
    }

    await Promise.all(
      createdTeams.map((team) =>
        Team.updateOne({ _id: team._id }, { points: teamTotals.get(team.name) || 0 })
      )
    );

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
