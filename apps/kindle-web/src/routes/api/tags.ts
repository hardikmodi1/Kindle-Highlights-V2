import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/tags')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const sessionData = await auth.api.getSession(request);
        const userId = sessionData?.session?.userId;

        if (userId) {
          const tag = await request.json();
          await prisma.tag.create({
            data: { shortForm: tag.shortForm, longForm: tag.longForm, userId },
          });
          return new Response(JSON.stringify({ ok: true }));
        }

        return new Response(null, { status: 401 });
      },
      GET: async ({ request }: { request: Request }) => {
        const sessionData = await auth.api.getSession(request);
        const userId = sessionData?.session?.userId;

        if (userId) {
          const tags = await prisma.tag.findMany({
            where: { userId },
          });
          return new Response(JSON.stringify(tags));
        }

        return new Response(null, { status: 401 });
      },
    },
  },
});
