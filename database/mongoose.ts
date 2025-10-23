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
                console.warn('[DB] MongoDB connection failed in development. Attempting in-memory fallback...');
                console.warn('[DB] To fix permanently: Install and start MongoDB locally, or set MONGODB_URI in .env');
                console.warn('[DB] Error:', message);

                // Try in-memory MongoDB fallback for development
                try {
                    const memPkg: any = await import('mongodb-memory-server');
                    const MongoMemoryServer = memPkg.MongoMemoryServer || memPkg.default?.MongoMemoryServer;
                    if (!MongoMemoryServer) throw new Error('mongodb-memory-server not available');

                    const memServer = await MongoMemoryServer.create();
                    const memUri = memServer.getUri();
                    console.warn('[DB] Started in-memory MongoDB instance');

                    cached.promise = mongoose.connect(memUri, {
                        bufferCommands: false,
                        serverSelectionTimeoutMS: 5000,
                        connectTimeoutMS: 5000,
                    });
                    cached.conn = await cached.promise;
                    console.warn('[DB] Connected to in-memory MongoDB for development');
                    return cached.conn;
                } catch (memErr: any) {
                    console.warn('[DB] Failed to start in-memory MongoDB fallback:', String(memErr?.message || memErr));
                    return null;
                }
            }
        }
        
        throw err;
    }

    return cached.conn;
}
