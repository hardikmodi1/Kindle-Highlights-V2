import { auth } from '@/lib/auth';
import { createTag } from '@/tools/createTag';
import { getAllBooks } from '@/tools/getAllBooks';
import { getAllTags } from '@/tools/getAllTags';
import { getHighlightsWithTagFromBook } from '@/tools/getHighlightsWithTagFromBook';
import { searchHighlights } from '@/tools/searchHighlights';
import { suggestBook } from '@/tools/suggestBook';
import { createFileRoute } from '@tanstack/react-router';
import { createMcpHandler } from 'mcp-handler';
import z from 'zod';

const handler = async (request: Request) => {
  const session = await auth.api.getMcpSession({ headers: request.headers });

  if (!session) {
    return new Response(null, { status: 401 });
  }

  const mcpHandler = createMcpHandler(
    server => {
      server.registerTool(
        'get_all_books',
        {
          title: 'Get all books',
          description: 'Get all books read by the current user',
          inputSchema: {},
        },
        () => getAllBooks({ session })
      );

      server.registerTool(
        'get_all_tags',
        {
          title: 'Get all tags',
          description: 'Get all tags created by the current user',
          inputSchema: {},
        },
        () => getAllTags({ session })
      );

      server.registerTool(
        'create_tag',
        {
          title: 'Create tag',
          description: 'Create a tag for user given short form and long form',
          inputSchema: { longForm: z.string(), shortForm: z.string() },
        },
        ({ longForm, shortForm }) => createTag({ session, inputParams: { longForm, shortForm } })
      );

      server.registerTool(
        'get_all_highlights_with_tag_from_book',
        {
          title: 'Get all highlights with tag from book',
          description:
            'Gets all highlights created by the user with the given tag, if tag is not present return all highlights from the book',
          inputSchema: { tagShortForm: z.string().optional(), bookTitle: z.string() },
        },
        ({ tagShortForm, bookTitle }) =>
          getHighlightsWithTagFromBook({ session, mcpServer: server, inputParams: { tagShortForm, bookTitle } })
      );

      server.registerTool(
        'suggest_book',
        {
          title: 'Suggest next book to read',
          description: 'Suggest next book to user based on reading history',
          inputSchema: {},
        },
        () => suggestBook({ session })
      );

      server.registerTool(
        'search_highlights',
        {
          title: 'Search highlights',
          description: 'Search highlights with given keyword and book',
          inputSchema: { bookTitle: z.string(), keywords: z.array(z.string()) },
        },
        ({ bookTitle, keywords }) => searchHighlights({ session, inputParams: { bookTitle, keywords } })
      );
    },
    undefined,
    { basePath: '/api' }
  );

  return mcpHandler(request);
};

export const Route = createFileRoute('/api/mcp')({
  server: {
    handlers: {
      POST: async ({ request }) => handler(request),
      DELETE: async ({ request }) => handler(request),
      GET: async ({ request }) => handler(request),
    },
  },
});
