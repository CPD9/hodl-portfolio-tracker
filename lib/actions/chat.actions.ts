// Client-safe chat actions. Do not mark this file as 'use server'.

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
    const response = await fetch(`/api/chat`, {
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
      let details: string | undefined;
      try {
        const err = await response.json();
        details = err?.details || err?.error;
      } catch {}
      throw new Error(`Failed to send message (HTTP ${response.status} ${response.statusText})${details ? `: ${details}` : ''}`);
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
    return null;
  }
}