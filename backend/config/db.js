const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('[db] No MongoDB URI found. Skipping connection for this environment.');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[db] Connection error: ${err.message}`);
    return null;
  }
};

module.exports = connectDB;
