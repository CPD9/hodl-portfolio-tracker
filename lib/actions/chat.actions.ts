'use server';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  userContext?: string | null
): Promise<ChatMessage | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
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
      throw new Error('Failed to send message');
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