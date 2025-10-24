import { betterAuth } from "better-auth";
import { connectToDatabase } from "@/database/mongoose";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/lib/nodemailer";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if(authInstance) return authInstance;

    // Skip database connection during Next.js build
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
            sendResetPassword: async ({ user, url }) => {
                try {
                    await sendEmail({
                        to: user.email,
                        subject: 'Reset Your HODL Password',
                        html: `
                            <h1>Password Reset Request</h1>
                            <p>Hello ${user.name || 'there'},</p>
                            <p>You requested to reset your password. Click the link below to proceed:</p>
                            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                            <p>If you didn't request this, please ignore this email.</p>
                            <p>Thanks,<br>HODL Team</p>
                        `
                    });
                } catch (error) {
                    console.error('Failed to send password reset email:', error);
                    // Surface a cleaner error while keeping auth flow predictable
                    throw new Error('Failed to send password reset email. Please try again later.');
                }
            },
        },
        plugins: [nextCookies()],
    });

    return authInstance;
}

// Lazy proxy to avoid top-level await during build
export const auth = new Proxy({} as Awaited<ReturnType<typeof getAuth>>, {
    get(target, prop) {
        return async function(...args: any[]) {
            const authInstance = await getAuth();
            const value = (authInstance as any)[prop];
            if (typeof value === 'function') {
                return value.apply(authInstance, args);
            }
            return value;
        };
    }
});
