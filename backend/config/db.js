const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('[db] No MongoDB URI found. Skipping connection for this environment.');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      family: 4,
    };

    cached.promise = mongoose.connect(mongoUri, opts)
      .then((conn) => {
        console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
        cached.conn = conn;
        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        console.error(`[db] Connection error: ${err.message}`);
        throw err;
      });
  }

  return cached.promise;
};

module.exports = connectDB;
