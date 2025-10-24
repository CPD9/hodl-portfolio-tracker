import "server-only";

import { StreamChat } from "stream-chat";

const CHAT_API_KEY = process.env.STREAM_CHAT_API_KEY;
const CHAT_SECRET_KEY = process.env.STREAM_CHAT_SECRET_KEY;

export const isStreamChatConfigured = Boolean(CHAT_API_KEY && CHAT_SECRET_KEY);

// Export a nullable client instead of throwing, so app can run without keys
export const streamChat = isStreamChatConfigured
  ? StreamChat.getInstance(CHAT_API_KEY as string, CHAT_SECRET_KEY as string)
  : null;

if (!isStreamChatConfigured) {
  console.warn(
    "[stream-chat] STREAM_CHAT_API_KEY/STREAM_CHAT_SECRET_KEY not set. Chat features are disabled."
  );
}

