import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Create a system message to give context about the HODL portfolio tracker
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant for HODL called Hodlini, an advanced portfolio tracking platform with the purpose of helping users that are new to crypto, but have experience with stock investments to navigate the world of crypto. 
      The USP of this system is to help users making the steps toward crypto, by showing cryptos, that are related to stocks in terms of topic and past movements, so users better understand the coins. You help users with:

        - Provide personalized crypto recommendations related with their stock interests
        - Portfolio management advice
        - Trading insights and strategies
        - Base blockchain and DeFi information
        - General financial questions
        - Platform navigation and features

        Keep your responses helpful, concise, and focused on financial markets and portfolio management. `,
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}