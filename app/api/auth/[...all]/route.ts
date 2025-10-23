import { getAuth } from "@/lib/better-auth/auth";

export async function GET(req: Request) {
  const authInstance = await getAuth();
  if (!authInstance) {
    return new Response('Auth service unavailable', { status: 503 });
  }
  return authInstance.handler(req);
}

export async function POST(req: Request) {
  const authInstance = await getAuth();
  if (!authInstance) {
    return new Response('Auth service unavailable', { status: 503 });
  }
  return authInstance.handler(req);
}

