import prisma from '@/lib/prisma';
import { type McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createServerOnlyFn } from '@tanstack/react-start';
import { OAuthAccessToken } from 'better-auth/plugins';

export const getHighlightsWithTagFromBook = createServerOnlyFn(
  async ({
    session,
    mcpServer,
    inputParams: { tagShortForm, bookTitle },
  }: {
    session: OAuthAccessToken;
    mcpServer: McpServer;
    inputParams: { tagShortForm?: string; bookTitle: string };
  }) => {
    const userId = session.userId;

    try {
      const book = await prisma.book.findFirst({
        where: { AND: [{ users: { some: { userId } }, title: { contains: bookTitle, mode: 'insensitive' } }] },
        select: { id: true },
      });
      if (!book) {
        return {
          content: [
            { type: 'text' as const, text: `Not able to find any book with title ${bookTitle} in your library` },
          ],
        };
      }

      let tagId: string | undefined;
      if (tagShortForm) {
        const tag = await prisma.tag.findFirst({ where: { shortForm: tagShortForm, userId }, select: { id: true } });
        tagId = tag?.id;
      }
      if (tagShortForm && !tagId) {
        return {
          content: [{ type: 'text' as const, text: `Not able to find any tag with short form ${tagShortForm}` }],
        };
      }
      const highlights = await prisma.note.findMany({
        where: { bookId: book.id, ...(tagId ? { tags: { some: { tagId } } } : null) },
        select: { highlightedText: true, note: true },
      });
      return { content: [{ type: 'text' as const, text: JSON.stringify(highlights) }] };
    } catch (e) {
      return { content: [{ type: 'text' as const, text: `Something went wrong - ${e}` }] };
    }
  }
);
