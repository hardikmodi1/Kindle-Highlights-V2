import prisma from '@/lib/prisma';
import { createServerOnlyFn } from '@tanstack/react-start';
import { OAuthAccessToken } from 'better-auth/plugins';

export const getAllTags = createServerOnlyFn(async ({ session }: { session: OAuthAccessToken }) => {
  const userId = session.userId;

  const tags = await prisma.tag.findMany({
    where: { userId },
    select: { shortForm: true, longForm: true },
  });

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(tags) }],
  };
});
