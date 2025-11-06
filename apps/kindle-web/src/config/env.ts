import { z } from 'zod';

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
});

const clientEnvSchema = z.object({});

// Validate server environment
export const serverEnv = envSchema.parse(process.env);

// Validate client environment
export const clientEnv = clientEnvSchema.parse(import.meta.env);
