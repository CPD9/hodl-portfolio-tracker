'use server';

import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {inngest} from "@/lib/inngest/client";
import {sendEmail} from "@/lib/nodemailer";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        if(response) {
            // Send welcome email
            try {
                await sendEmail({
                    to: email,
                    subject: 'Welcome to HODL Portfolio Tracker! 🚀',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                                .button { display: inline-block; padding: 12px 30px; background-color: #f59e0b; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
                                .features { background: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f59e0b; }
                                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1 style="margin: 0; font-size: 32px;">🎉 Welcome to HODL!</h1>
                                </div>
                                <div class="content">
                                    <h2>Hello ${fullName}!</h2>
                                    <p>Thank you for joining <strong>HODL Portfolio Tracker</strong> - your all-in-one platform for tracking stocks and crypto with Base blockchain integration.</p>
                                    
                                    <div class="features">
                                        <h3 style="color: #f59e0b; margin-top: 0;">✨ What you can do now:</h3>
                                        <ul style="list-style: none; padding: 0;">
                                            <li>📊 Track your stock and crypto portfolio in real-time</li>
                                            <li>🤖 Get AI-powered trading insights</li>
                                            <li>⚡ Trade on Base L2 with $0.01 fees</li>
                                            <li>📈 Set custom price alerts</li>
                                            <li>💼 Paper trade with $100K virtual money</li>
                                        </ul>
                                    </div>
                                    
                                    <p style="text-align: center;">
                                        <a href="${process.env.BETTER_AUTH_URL}/dashboard" class="button">Go to Dashboard →</a>
                                    </p>
                                    
                                    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
                                        <p style="margin: 0;"><strong>💡 Pro Tip:</strong> Start by connecting your wallet on the Base page to unlock DeFi features!</p>
                                    </div>
                                    
                                    <div class="footer">
                                        <p>Your Profile:</p>
                                        <p style="color: #4b5563;">
                                            📍 Country: ${country}<br>
                                            🎯 Investment Goal: ${investmentGoals}<br>
                                            ⚖️ Risk Tolerance: ${riskTolerance}<br>
                                            🏭 Preferred Industry: ${preferredIndustry}
                                        </p>
                                        <p style="margin-top: 30px;">Happy trading!<br><strong>Team HODL</strong></p>
                                        <p style="font-size: 12px; color: #9ca3af;">Built on Base L2 | START HACK 2025</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // Don't fail the signup if email fails
            }

            // Send event to Inngest for additional processing
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

        // Send login notification email (optional)
        if(response) {
            try {
                await sendEmail({
                    to: email,
                    subject: 'New Login to Your HODL Account',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .content { background: #f9fafb; padding: 30px; border-radius: 10px; }
                                .alert { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="content">
                                    <h2>🔐 New Login Detected</h2>
                                    <p>Hello!</p>
                                    <p>We detected a new login to your HODL account.</p>
                                    <div class="alert">
                                        <p style="margin: 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                                    </div>
                                    <p style="margin-top: 20px;">If this was you, you can safely ignore this email.</p>
                                    <p>If you didn't log in, please change your password immediately and contact support.</p>
                                    <p style="margin-top: 30px;">Thanks,<br><strong>Team HODL</strong></p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send login notification:', emailError);
                // Don't fail the signin if email fails
            }
        }

        return { success: true, data: response }
    } catch (e: any) {
        console.error('Sign in failed:', e)
        
        // Parse error message
        let errorMessage = 'Sign in failed. Please check your credentials.';
        
        if (e?.body?.message) {
            errorMessage = e.body.message;
        } else if (e?.message) {
            if (e.message.includes('credentials') || e.message.includes('password') || e.message.includes('incorrect')) {
                errorMessage = 'Incorrect email or password';
            } else if (e.message.includes('not found') || e.message.includes('user')) {
                errorMessage = 'No account found with this email';
            } else if (e.message.includes('email')) {
                errorMessage = 'Please enter a valid email address';
            } else {
                errorMessage = e.message;
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
