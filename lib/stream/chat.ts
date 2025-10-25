import "server-only";

import { StreamChat } from "stream-chat";

if (!process.env.STREAM_CHAT_API_KEY) {
  throw new Error("STREAM_CHAT_API_KEY is not set");
}

if (!process.env.STREAM_CHAT_SECRET_KEY) {
  throw new Error("STREAM_CHAT_SECRET_KEY is not set");
}

export const streamChat = StreamChat.getInstance(
  process.env.STREAM_CHAT_API_KEY,
  process.env.STREAM_CHAT_SECRET_KEY
);

