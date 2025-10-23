import { NextRequest, NextResponse } from 'next/server';

import OpenAI from 'openai';

// Log a short fingerprint of the configured OpenAI API key to verify which key is active
console.log('OPENAI key fingerprint:', process.env.OPENAI_API_KEY);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
  const { messages, userContext } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Extract optional realtime price context injected as a special assistant message
    let extractedPriceContext: string | null = null;
    const cleanedMessages = Array.isArray(messages)
      ? messages.filter((m: any) => {
          if (typeof m?.content === 'string' && m.content.startsWith('REALTIMES_PRICES_JSON:')) {
            extractedPriceContext = m.content.replace('REALTIMES_PRICES_JSON:\n', '').trim();
            return false; // remove from chat history
          }
          return true;
        })
      : messages;

    // Create a system message to give context about the HODL portfolio tracker
  let systemContent = `You are an AI assistant for HODL called Hodlini, an advanced portfolio tracking platform with the purpose of helping users that are new to crypto, but have experience with stock investments to navigate the world of crypto. 
      The USP of this system is to help users making the steps toward crypto, by showing cryptos, that are related to stocks in terms of topic and past movements, so users better understand the coins. You help users with:

        - Provide personalized crypto recommendations related with their stock interests
        - Portfolio management advice
        - Trading insights and strategies
        - Base blockchain and DeFi information
        - General financial questions
        - Platform navigation and features

  Keep your responses helpful, concise, and focused on financial markets and portfolio management.

  RESPONSE STYLE: Output plain text only. Do not use Markdown formatting, no bold/italics/code blocks/lists. Avoid asterisks, underscores, backticks, hash signs, dashes as formatting. Use simple sentences and line breaks only.`;

    // Add user context if available
    if (userContext) {
      systemContent += `\n\n--- USER PROFILE & CONTEXT ---\n${userContext}\n\nUse this information to provide personalized advice tailored to the user's investment style, holdings, and interests.`;
    }

    // Add realtime prices context if provided
    if (extractedPriceContext) {
      systemContent += `\n\n--- REALTIME PRICES (JSON) ---\n${extractedPriceContext}\n\nUse these prices for calculations and keep numbers consistent with them.`;
    }

    const systemMessage = {
      role: 'system',
      content: systemContent,
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
  messages: [systemMessage, ...cleanedMessages],
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

    // Sanitize any residual markdown-like syntax to ensure plain text output
    const toPlainText = (text: string) => {
      if (!text) return text;
      let out = text;
      // Remove code fences and inline backticks
      out = out.replace(/```/g, '');
      out = out.replace(/`/g, '');
      // Remove bold/italic markers
      out = out.replace(/\*\*|__/g, '');
      // Remove leading markdown headings and list markers
      out = out.replace(/^#{1,6}\s+/gm, '');
      out = out.replace(/^\s*[-*+]\s+/gm, '');
      // Convert markdown links [text](url) to "text (url)"
      out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
      return out;
    };

    const sanitized = { ...assistantMessage, content: toPlainText(assistantMessage.content || '') };
    return NextResponse.json({ message: sanitized });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Return more specific error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        apiKeyConfigured: !!process.env.OPENAI_API_KEY 
      },
      { status: 500 }
    );
  }
}