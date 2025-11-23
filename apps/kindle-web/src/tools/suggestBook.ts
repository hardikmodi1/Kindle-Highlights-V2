import prisma from '@/lib/prisma';
import { createServerOnlyFn } from '@tanstack/react-start';
import { mastra } from '@/lib/mastra';

import { OAuthAccessToken } from 'better-auth/plugins';

const bookAgent = mastra.getAgent('bookRecommenderAgent');

export const suggestBook = createServerOnlyFn(async ({ session }: { session: OAuthAccessToken }) => {
  const userId = session.userId;

  try {
    const books = await prisma.book.findMany({
      where: { users: { some: { userId } } },
      select: { title: true, authors: true },
    });

    const headerLine = 'Book Title|Authors';

    const response = await bookAgent.generate([
      {
        role: 'system',
        content: `
          Based on the reading history of user, what books would you recommend to read next? Please analyze 
          these reading patterns and suggest books that would interest user.
          First highlight my current reading pattern and then directly give recommendations in the mentioned format without any other things
          `,
      },
      {
        role: 'user',
        content: `
          ${headerLine}\n
          ${books.map(({ authors, title }) => `${title}|${authors}\n`)}
        `,
      },
    ]);
    return { content: [{ type: 'text' as const, text: response.text }] };
  } catch (e) {
    return { content: [{ type: 'text' as const, text: `Something went wrong - ${e}` }] };
  }
});
