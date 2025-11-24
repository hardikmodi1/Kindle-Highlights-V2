import { mastra } from '@/lib/mastra';
import prisma from '@/lib/prisma';
import { createServerOnlyFn } from '@tanstack/react-start';
import { OAuthAccessToken } from 'better-auth/plugins';
import z from 'zod';

const classifierAgent = mastra.getAgent('classifierAgent');

export const searchHighlights = createServerOnlyFn(
  async ({
    session,
    inputParams: { bookTitle, keywords },
  }: {
    session: OAuthAccessToken;
    inputParams: { bookTitle: string; keywords: Array<string> };
  }) => {
    const userId = session.userId;

    try {
      const book = await prisma.booksReadByUsers.findFirst({
        where: { userId, book: { title: { contains: bookTitle, mode: 'insensitive' } } },
      });

      if (!book) {
        return {
          content: [
            { type: 'text' as const, text: `Not able to find any book with title - ${bookTitle} in your library` },
          ],
        };
      }

      const highlightsFromBook = await prisma.note.findMany({
        where: { bookId: book.bookId },
        select: { highlightedText: true, originalNote: true },
      });

      const headerLine = 'Highlight|Note';
      const response = await classifierAgent.generate(
        [
          {
            role: 'system',
            content: `Given the highlights, corresponding note added by user and keywords. Find out the highlights
        that matches with the given keywords`,
          },
          {
            role: 'user',
            content: `
        ${headerLine}\n
        ${highlightsFromBook.map(({ highlightedText, originalNote }) => `${highlightedText}|${originalNote}\n`)}
        \n\n
        Given keywords are ${keywords.join(',')}
      `,
          },
        ],
        {
          structuredOutput: {
            schema: z.object({ keyword: z.array(z.object({ highlight: z.string(), note: z.string() })) }),
          },
        }
      );
      return { content: [{ type: 'text' as const, text: response.text }] };
    } catch (e) {
      return { content: [{ type: 'text' as const, text: `Something went wrong - ${e}` }] };
    }
  }
);
