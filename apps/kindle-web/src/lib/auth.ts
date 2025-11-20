import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';
import { mcp } from 'better-auth/plugins';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  advanced: { cookiePrefix: 'highlight' },
  plugins: [mcp({ loginPage: '/login' })],
});
