import mongoose from 'mongoose';

import { connectionString } from '../config/database';
import { sampleActivities, sampleLeaderboardEntries, sampleTeams, sampleUsers, sampleWorkoutPlans } from '../data/sampleData';
import Activity from '../models/Activity';
import LeaderboardEntry from '../models/LeaderboardEntry';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

/**
 * Seed the octofit_db database with test data
 */
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

    await Team.insertMany(
      sampleTeams.map(({ id: _id, memberIds, ...team }) => ({
        ...team,
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

    await LeaderboardEntry.insertMany(
      sampleLeaderboardEntries.map(({ id: _id, userId, ...entry }) => ({
        ...entry,
        userId: userIdBySampleId.get(userId)
      }))
    );

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
