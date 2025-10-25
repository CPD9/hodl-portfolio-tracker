import "server-only";

import { StreamClient } from "@stream-io/node-sdk";

let cachedVideo: StreamClient | null = null;

/**
 * Lazily initialize the Stream Video client to avoid import-time env throws.
 * We only validate required env vars when first used.
 */
export function getStreamVideo(): StreamClient {
  if (cachedVideo) return cachedVideo;

  // Prefer server-side variable; allow NEXT_PUBLIC_* for backwards compatibility
  const apiKey = process.env.STREAM_VIDEO_API_KEY || process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const secret = process.env.STREAM_VIDEO_SECRET_KEY;

  if (!apiKey || !secret) {
    throw new Error("Stream Video environment variables missing: require STREAM_VIDEO_API_KEY (or NEXT_PUBLIC_STREAM_VIDEO_API_KEY) and STREAM_VIDEO_SECRET_KEY");
  }

  cachedVideo = new StreamClient(apiKey, secret);
  return cachedVideo;
}

