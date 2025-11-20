import { auth } from '@/lib/auth';
import { getAllBooks } from '@/tools/getAllBooks';
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
        async () => getAllBooks({ session })
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
