import { getAuth } from "@/lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

// Prevent static analysis during build
export const dynamic = 'force-dynamic';

// Lazy initialize handler to avoid DB connection during build
let handler: ReturnType<typeof toNextJsHandler> | null = null;

async function getHandlers() {
  if (!handler) {
    const auth = await getAuth();
    handler = toNextJsHandler(auth.handler);
  }
  return handler;
}

export async function GET(request: NextRequest) {
  const handlers = await getHandlers();
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  const handlers = await getHandlers();
  return handlers.POST(request);
}

