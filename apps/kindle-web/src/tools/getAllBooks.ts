import prisma from '@/lib/prisma';
import { createServerOnlyFn } from '@tanstack/react-start';
import { OAuthAccessToken } from 'better-auth/plugins';

export const getAllBooks = createServerOnlyFn(async ({ session }: { session: OAuthAccessToken }) => {
  const userId = session.userId;

  const books = await prisma.book.findMany({
    where: { users: { some: { userId } } },
    select: { title: true, authors: true },
  });

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(books) }],
  };
});
