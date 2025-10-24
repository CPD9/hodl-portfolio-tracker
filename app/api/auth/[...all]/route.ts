import { auth } from "@/lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const { GET, POST } = toNextJsHandler(auth.handler);

