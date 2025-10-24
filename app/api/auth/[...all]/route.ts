import { auth } from "@/lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Prevent static analysis during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const { GET, POST } = toNextJsHandler(auth.handler);

