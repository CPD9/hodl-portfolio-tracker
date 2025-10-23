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
        serverSelectionTimeoutMS: 7000,
    });

    if (!cached.promise) {
        cached.promise = connectWith(uriToUse);
    }

    try {
        cached.conn = await cached.promise;
    } catch (err: any) {
        // Retry with fallback on SRV/DNS failures in dev
        const message = String(err?.message || err);
        const isSrvDnsError = message.includes('querySrv ENOTFOUND') || message.includes('_mongodb._tcp');
        if (process.env.NODE_ENV !== 'production' && uriToUse !== FALLBACK_URI && isSrvDnsError) {
            console.warn('[DB] SRV/DNS lookup failed for MONGODB_URI. Retrying with local fallback:', FALLBACK_URI);
            try {
                cached.promise = connectWith(FALLBACK_URI);
                cached.conn = await cached.promise;
            } catch (fallbackErr) {
                cached.promise = null;
                throw fallbackErr;
            }
        } else {
            cached.promise = null;
            throw err;
        }
    }

    console.log(`[DB] Connected (${process.env.NODE_ENV}) -> ${cached.conn?.connection?.name || 'ok'}`);
    return cached.conn;
}
