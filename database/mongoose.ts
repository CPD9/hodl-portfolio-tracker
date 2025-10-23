import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const FALLBACK_URI = process.env.MONGODB_URI_FALLBACK || 'mongodb://127.0.0.1:27017/hodl-portfolio-tracker';

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    // Choose URI with sensible dev fallback when missing/placeholder
    let uriToUse: string = MONGODB_URI as string;

    const isPlaceholder = !uriToUse || /xxxxx/.test(uriToUse) || uriToUse.includes('cluster0.xxxxx.mongodb.net');

    if (isPlaceholder) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[DB] MONGODB_URI missing or placeholder. Falling back to local MongoDB for development:', FALLBACK_URI);
            uriToUse = FALLBACK_URI;
        } else {
            throw new Error('MONGODB_URI must be set in production');
        }
    }

    if (cached.conn) return cached.conn;

    const connectWith = async (uri: string) => mongoose.connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
    });

    if (!cached.promise) {
        cached.promise = connectWith(uriToUse);
    }

    try {
        cached.conn = await cached.promise;
        console.log(`[DB] Connected (${process.env.NODE_ENV}) -> ${cached.conn?.connection?.name || 'ok'}`);
    } catch (err: any) {
        cached.promise = null;
        const message = String(err?.message || err);
        
        // In development, if local MongoDB is not running, warn but don't crash
        if (process.env.NODE_ENV !== 'production') {
            const isConnectionRefused = message.includes('ECONNREFUSED') || message.includes('connect failed');
            const isSrvDnsError = message.includes('querySrv ENOTFOUND') || message.includes('_mongodb._tcp');
            
            if (isConnectionRefused || isSrvDnsError) {
                console.warn('[DB] MongoDB connection failed in development. Some features may not work.');
                console.warn('[DB] To fix: Install and start MongoDB locally, or set MONGODB_URI in .env');
                console.warn('[DB] Error:', message);
                // Return a mock connection for development when DB is unavailable
                return null;
            }
        }
        
        throw err;
    }

    return cached.conn;
}
