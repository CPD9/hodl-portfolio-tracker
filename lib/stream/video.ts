import "server-only";

import { StreamClient } from "@stream-io/node-sdk";

const VIDEO_API_KEY = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
const VIDEO_SECRET_KEY = process.env.STREAM_VIDEO_SECRET_KEY;

export const isStreamVideoConfigured = Boolean(VIDEO_API_KEY && VIDEO_SECRET_KEY);

// Export a nullable client instead of throwing, so app can run without keys
export const streamVideo = isStreamVideoConfigured
  ? new StreamClient(VIDEO_API_KEY as string, VIDEO_SECRET_KEY as string)
  : null;

if (!isStreamVideoConfigured) {
  console.warn(
    "[stream-video] NEXT_PUBLIC_STREAM_VIDEO_API_KEY/STREAM_VIDEO_SECRET_KEY not set. Video features are disabled."
  );
}

