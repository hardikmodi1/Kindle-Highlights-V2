import { createFileRoute } from '@tanstack/react-router';
import { auth } from '@/lib/auth';

export const Route = createFileRoute('/api/me')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const session = await auth.api.getSession(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        return new Response(JSON.stringify(session), { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
      },
    },
  },
});
