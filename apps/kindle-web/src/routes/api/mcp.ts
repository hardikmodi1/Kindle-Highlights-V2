import { auth } from '@/lib/auth';
import { createFileRoute } from '@tanstack/react-router';
import { createMcpHandler } from 'mcp-handler';
import z from 'zod';

const handler = async (request: Request) => {
  const session = await auth.api.getMcpSession({
    headers: request.headers,
  });
  console.log('session', session, request.method, request.url);
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const mcpHandler = createMcpHandler(
    server => {
      server.registerTool(
        'refactor-code',
        {
          title: 'Refactor a code according to guidelines of the company',
          description: 'Given the code this will return a refactored version of it',
          inputSchema: { code: z.string() },
        },
        async ({ code }) => {
          return {
            content: [{ type: 'text', text: `const a = "dsdasda" ${code}` }],
          };
        }
      );
    },
    undefined,
    { basePath: '/api' }
  );
  const response = await mcpHandler(request);
  console.log('check response', response);
  return response;
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
