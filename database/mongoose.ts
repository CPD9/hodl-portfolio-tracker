import mongoose from 'mongoose';

// Prefer explicit var so we can compute a safe fallback in development
const MONGODB_URI = process.env.MONGODB_URI;
const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/hodl';

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  // Skip actual connection during Next.js build (when NEXT_PHASE is 'phase-production-build')
  // This allows the build to complete without a running database
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.SKIP_DB_CONNECTION === 'true';
  
  if (isBuildTime) {
    console.log('Skipping database connection during build phase');
    // Return a mock connection that won't be used
    return mongoose as typeof mongoose;
  }

  // In production, require an explicit MONGODB_URI.
  // In development, fall back to a local Mongo instance if available.
  const uri = MONGODB_URI || (process.env.NODE_ENV !== 'production' ? DEFAULT_LOCAL_URI : undefined);

  if (!uri) {
    // Still no URI (e.g., production without env var)
    throw new Error('MONGODB_URI must be set within .env');
  }

  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    // Optional: stricter parsing and query behavior
    mongoose.set('strictQuery', true);

    cached!.promise = mongoose.connect(uri, { bufferCommands: false }).catch((err) => {
      cached!.promise = null;
      throw err;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (err) {
    cached!.promise = null;
    if (process.env.NODE_ENV !== 'production' && !MONGODB_URI) {
      // Helpful guidance in dev when local Mongo isn't running
      console.error('MongoDB connection failed. Start MongoDB locally or set MONGODB_URI in .env');
      throw new Error('Unable to connect to local MongoDB. Start MongoDB or set MONGODB_URI.');
    }
    throw err;
  }

  if (!MONGODB_URI && process.env.NODE_ENV !== 'production') {
    console.warn(`Connected to local MongoDB at ${DEFAULT_LOCAL_URI} (dev fallback).`);
  } else {
    console.log(`Connected to database (${process.env.NODE_ENV})`);
  }

  return cached!.conn;
};
