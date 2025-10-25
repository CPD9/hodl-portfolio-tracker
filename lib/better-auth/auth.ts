import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if(authInstance) return authInstance;

    // Skip database connection during Next.js build phase
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        console.warn('[BUILD] Skipping auth initialization during build');
        return {} as ReturnType<typeof betterAuth>;
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if(!db) throw new Error('MongoDB connection not found');

    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });

    return authInstance;
}

// Helper to create a recursive proxy that wraps nested objects
function createAsyncProxy(getValue: () => Promise<any>, path: string[] = []): any {
    return new Proxy(() => {}, {
        get(target, prop) {
            if (prop === 'then' || prop === 'catch' || prop === 'finally') {
                // Don't intercept promise methods
                return undefined;
            }

            // Return a proxy for the nested property
            return createAsyncProxy(getValue, [...path, prop as string]);
        },
        apply(target, thisArg, args) {
            // When called as a function, resolve the full path and call the final method
            return (async () => {
                const instance = await getValue();

                // Navigate to the nested property
                let current = instance;
                for (const key of path) {
                    current = current[key];
                }

                // Call the final method if it's a function
                if (typeof current === 'function') {
                    return current.apply(instance, args);
                }
                return current;
            })();
        }
    });
}

// Lazy proxy to avoid top-level await during build
export const auth = createAsyncProxy(getAuth);
