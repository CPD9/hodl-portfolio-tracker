import "server-only";

import { StreamChat } from "stream-chat";

let cachedChat: StreamChat | null = null;

/**
 * Lazily initialize the Stream Chat client to avoid import-time env throws
 * during static analysis/build on platforms like Vercel. We only validate
 * required environment variables at the moment of first use.
 */
export function getStreamChat(): StreamChat {
  if (cachedChat) return cachedChat;

  const apiKey = process.env.STREAM_CHAT_API_KEY;
  const secret = process.env.STREAM_CHAT_SECRET_KEY;

  if (!apiKey || !secret) {
    throw new Error("Stream Chat environment variables missing: require STREAM_CHAT_API_KEY and STREAM_CHAT_SECRET_KEY");
  }

  cachedChat = StreamChat.getInstance(apiKey, secret);
  return cachedChat;
}

