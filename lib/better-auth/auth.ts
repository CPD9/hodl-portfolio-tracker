import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;
let initPromise: Promise<ReturnType<typeof betterAuth> | null> | null = null;

export const getAuth = async () => {
    // If already initialized, return it
    if(authInstance) return authInstance;
    
    // If initialization is in progress, wait for it
    if(initPromise) return initPromise;
    
    // Start initialization
    initPromise = (async () => {
        try {
            const mongoose = await connectToDatabase();
            
            // If DB connection failed in development, return null
            if (!mongoose && process.env.NODE_ENV !== 'production') {
                console.warn('[Auth] Running without database connection in development mode');
                return null;
            }
            
            const db = mongoose?.connection?.db;

            if(!db) {
                console.error('[Auth] MongoDB connection not found');
                return null;
            }

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
        } catch (error) {
            console.error('[Auth] Initialization error:', error);
            return null;
        } finally {
            initPromise = null;
        }
    })();
    
    return initPromise;
}

// Export auth with proper typing and method forwarding
export const auth = {
    get handler() {
        return async (req: Request) => {
            const instance = await getAuth();
            if (!instance) {
                return new Response('Auth not available', { status: 503 });
            }
            return instance.handler(req);
        };
    },
    api: {
        getSession: async (options?: any) => {
            const instance = await getAuth();
            if (!instance) return null;
            return instance.api.getSession(options);
        },
        signUpEmail: async (options: any) => {
            const instance = await getAuth();
            if (!instance) throw new Error('Auth not available');
            return instance.api.signUpEmail(options);
        },
        signInEmail: async (options: any) => {
            const instance = await getAuth();
            if (!instance) throw new Error('Auth not available');
            return instance.api.signInEmail(options);
        },
        signOut: async (options?: any) => {
            const instance = await getAuth();
            if (!instance) throw new Error('Auth not available');
            return instance.api.signOut(options);
        }
    }
};
