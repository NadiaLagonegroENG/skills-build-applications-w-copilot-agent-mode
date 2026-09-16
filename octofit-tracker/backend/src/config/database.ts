import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

export const isDatabaseConnected = () => db.readyState === 1;

export async function connectDatabase() {
  if (isDatabaseConnected()) {
    return db;
  }

  try {
    await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 3000 });
    console.log('Connected to octofit_db');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Unable to connect to octofit_db, using fallback data: ${message}`);
  }

  return db;
}

db.on('error', (error) => {
  console.warn(`connection error: ${error.message}`);
});

export { connectionString };
export default db;
