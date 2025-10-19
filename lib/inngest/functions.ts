import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendNewsSummaryEmail, sendWelcomeEmail} from "@/lib/nodemailer";

import AIAdvisor from "@/database/models/ai-advisor.model";
import Consultation from "@/database/models/consultation.model";
import JSONL from "jsonl-parse-stringify";
import { connectToDatabase } from "@/database/mongoose";
import {getAllUsersForNewsEmail} from "@/lib/actions/user.actions";
import { getFormattedTodayDate } from "@/lib/utils";
import { getNews } from "@/lib/actions/finnhub.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import {inngest} from "@/lib/inngest/client";

export const sendSignUpEmail = inngest.createFunction(
    { id: 'sign-up-email' },
    { event: 'app/user.created'},
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt }
                        ]
                    }]
            }
        })

        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) ||'Thanks for joining HODL. You now have the tools to track markets and make smarter moves.'

            const { data: { email, name } } = event;

            return await sendWelcomeEmail({ email, name, intro: introText });
        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
)

export const sendDailyNewsSummary = inngest.createFunction(
    { id: 'daily-news-summary' },
    [ { event: 'app/send.daily.news' }, { cron: '0 12 * * *' } ],
    async ({ step }) => {
        // Step #1: Get all users for news delivery
        const users = await step.run('get-all-users', getAllUsersForNewsEmail)

        if(!users || users.length === 0) return { success: false, message: 'No users found for news email' };

        // Step #2: For each user, get watchlist symbols -> fetch news (fallback to general)
        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
            for (const user of users as UserForNewsEmail[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    // Enforce max 6 articles per user
                    articles = (articles || []).slice(0, 6);
                    // If still empty, fallback to general
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles });
                } catch (e) {
                    console.error('daily-news: error preparing user news', user.email, e);
                    perUser.push({ user, articles: [] });
                }
            }
            return perUser;
        });

        // Step #3: (placeholder) Summarize news via AI
        const userNewsSummaries: { user: UserForNewsEmail; newsContent: string | null }[] = [];

        for (const { user, articles } of results) {
                try {
                    const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

                    const response = await step.ai.infer(`summarize-news-${user.email}`, {
                        model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                        body: {
                            contents: [{ role: 'user', parts: [{ text:prompt }]}]
                        }
                    });

                    const part = response.candidates?.[0]?.content?.parts?.[0];
                    const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'

                    userNewsSummaries.push({ user, newsContent });
                } catch (e) {
                    console.error('Failed to summarize news for : ', user.email);
                    userNewsSummaries.push({ user, newsContent: null });
                }
            }

        // Step #4: (placeholder) Send the emails
        await step.run('send-news-emails', async () => {
                await Promise.all(
                    userNewsSummaries.map(async ({ user, newsContent}) => {
                        if(!newsContent) return false;

                        return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent })
                    })
                )
            })

        return { success: true, message: 'Daily news summary emails sent successfully' }
    }
)

// AI Consultation Processing
export const processConsultation = inngest.createFunction(
    { id: 'consultation-processing' },
    { event: 'consultation/processing' },
    async ({ event, step }) => {
        // Step 1: Fetch the transcript from Stream
        const response = await step.run('fetch-transcript', async () => {
            return fetch(event.data.transcriptUrl).then((res) => res.text());
        });

        // Step 2: Parse the transcript
        const transcript = await step.run('parse-transcript', async () => {
            return JSONL.parse(response);
        });

        // Step 3: Add speaker names to transcript
        const transcriptWithSpeakers = await step.run('add-speakers', async () => {
            await connectToDatabase();

            const speakerIds = [...new Set(transcript.map((item: any) => item.speaker_id))];

            // Get consultation to find advisor
            const consultation = await Consultation.findById(event.data.consultationId);
            if (!consultation) {
                throw new Error('Consultation not found');
            }

            const advisor = await AIAdvisor.findById(consultation.advisorId);

            return transcript.map((item: any) => {
                let speakerName = 'Unknown';

                if (advisor && item.speaker_id === advisor._id.toString()) {
                    speakerName = advisor.name;
                } else if (item.speaker_id === consultation.userId.toString()) {
                    speakerName = 'User';
                }

                return {
                    ...item,
                    speaker: speakerName,
                };
            });
        });

        // Step 4: Generate AI summary using Gemini
        const summary = await step.ai.infer('generate-summary', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: `You are an expert financial consultation summarizer. You write clear, actionable summaries of financial advisory sessions.

Analyze the following consultation transcript and create a comprehensive summary using this markdown structure:

### Overview
Provide a detailed, engaging summary of the consultation. Focus on major discussion points, financial advice given, and key takeaways. Highlight specific recommendations or concerns discussed.

### Key Discussion Points
Break down the consultation into thematic sections. Each section should summarize key advice, actions recommended, or concerns addressed.

Example:
#### Portfolio Allocation
- Current allocation: 70% stocks, 30% cash
- Recommendation: Increase diversification with bonds
- Suggested rebalancing strategy

#### Risk Management
- Discussed current risk tolerance
- Recommended position sizing strategies
- Suggested stop-loss levels for volatile positions

### Action Items
List concrete next steps the user should take based on the consultation.

### Follow-up Recommendations
Suggest when the user should schedule the next consultation and what topics to prepare.

---

Transcript:
${JSON.stringify(transcriptWithSpeakers, null, 2)}`,
                            },
                        ],
                    },
                ],
            },
        });

        // Step 5: Save summary to database
        await step.run('save-summary', async () => {
            await connectToDatabase();

            const part = summary.candidates?.[0]?.content?.parts?.[0];
            const summaryText =
                (part && 'text' in part ? part.text : null) || 'Summary generation failed.';

            await Consultation.updateOne(
                { _id: event.data.consultationId },
                {
                    summary: summaryText,
                    status: 'completed',
                }
            );
        });

        return { success: true, message: 'Consultation processed successfully' };
    }
);
