import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/notes/$bookId')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const sessionData = await auth.api.getSession(request);
        const userId = sessionData?.session?.userId;
        if (userId) {
          const notesByUser = await prisma.note.findMany({
            where: { userId, bookId: params.bookId },
            include: { tags: { include: { tag: true } } },
          });
          return new Response(JSON.stringify(notesByUser));
        }
        return new Response(null, { status: 401 });
      },
    },
  },
});
