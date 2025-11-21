import { auth } from '@/lib/auth';
import { createTag } from '@/tools/createTag';
import { getAllBooks } from '@/tools/getAllBooks';
import { getAllTags } from '@/tools/getAllTags';
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
