import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/books/$bookId')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const sessionData = await auth.api.getSession(request);
        const userId = sessionData?.session?.userId;
        if (userId) {
          const book = await prisma.booksReadByUsers.findUnique({
            where: { bookId_userId: { bookId: params.bookId, userId } },
            include: { book: true },
          });
          return new Response(JSON.stringify(book));
        }
        return new Response(null, { status: 401 });
      },
    },
  },
});
