import { createAuthClient } from "better-auth/react";

export const auth = createAuthClient({
  baseURL: typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

