'use server';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  // Optional trade proposal attached to assistant responses
  tradeProposal?: {
    orders: Array<{
      side: 'BUY' | 'SELL';
      from: { type: 'STOCK' | 'CRYPTO' | 'CASH'; symbol: string; amount: number };
      to: { type: 'STOCK' | 'CRYPTO' | 'CASH'; symbol: string; amount: number };
    }>;
    note?: string;
  };
}

export async function sendChatMessage(
  messages: ChatMessage[],
  userContext?: string | null
): Promise<ChatMessage | null> {
  try {
    // Determine a robust base URL that works in both dev and production (Vercel)
    // Precedence: NEXT_PUBLIC_BASE_URL > VERCEL_URL > localhost
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        userContext: userContext || undefined,
      }),
    });

    if (!response.ok) {
      let bodyText: string | undefined;
      let bodyJson: any = undefined;
      try {
        bodyText = await response.text();
        try {
          bodyJson = bodyText ? JSON.parse(bodyText) : undefined;
        } catch {
          // not JSON, keep as text
        }
      } catch {}

      const richError = {
        message: 'Failed to send message to /api/chat',
        status: response.status,
        statusText: response.statusText,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`,
        response: bodyJson ?? bodyText ?? null,
        hint: 'Check server logs for OpenAI key fingerprint and detailed error.',
      };
      throw new Error(JSON.stringify(richError));
    }

    const data = await response.json();
    
    if (data.message) {
      return {
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error sending chat message:', error);
    // Re-throw to allow UI to surface detailed error information
    throw error;
  }
}