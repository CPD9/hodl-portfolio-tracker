'use server';

import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {inngest} from "@/lib/inngest/client";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        if(response) {
            await inngest.send({
                name: 'app/user.created',
                data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
            })
        }

        return { success: true, data: response }
    } catch (e: any) {
        console.error('Sign up failed:', e)
        
        // Parse error message
        let errorMessage = 'Sign up failed. Please try again.';
        
        if (e?.body?.message) {
            errorMessage = e.body.message;
        } else if (e?.message) {
            if (e.message.includes('duplicate') || e.message.includes('already exists')) {
                errorMessage = 'An account with this email already exists';
            } else if (e.message.includes('password')) {
                errorMessage = 'Password must be at least 8 characters';
            } else if (e.message.includes('email')) {
                errorMessage = 'Please enter a valid email address';
            } else {
                errorMessage = e.message;
            }
        }
        
        return { success: false, error: errorMessage }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (e: any) {
        console.error('Sign in failed:', e)
        
        // Parse error message
        let errorMessage = 'Sign in failed. Please check your credentials.';
        const rawMessage = e?.body?.message || e?.message || '';
        
        if (e?.body?.message) {
            errorMessage = e.body.message;
        } else if (rawMessage) {
            if (rawMessage.includes('Auth not available') || rawMessage.includes('Auth service unavailable')) {
                errorMessage = 'Authentication is temporarily unavailable. In development, start MongoDB locally or set MONGODB_URI in your .env. Then retry.';
            } else if (rawMessage.includes('credentials') || rawMessage.includes('password') || rawMessage.includes('incorrect')) {
                errorMessage = 'Incorrect email or password';
            } else if (rawMessage.includes('not found') || rawMessage.includes('user')) {
                errorMessage = 'No account found with this email';
            } else if (rawMessage.includes('email')) {
                errorMessage = 'Please enter a valid email address';
            } else {
                errorMessage = rawMessage;
            }
        }
        
        return { success: false, error: errorMessage }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
        return { success: true }
    } catch (e: any) {
        console.error('Sign out failed:', e)
        return { success: false, error: e?.message || 'Sign out failed' }
    }
}
