import { createFileRoute } from '@tanstack/react-router';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

import type { BookDTO } from '@repo/types/book';
import type { Book as PrismaBook } from '@/generated/prisma/client';

export const Route = createFileRoute('/api/books')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const sessionData = await auth.api.getSession(request);
        const userId = sessionData?.session?.userId;
        if (userId) {
          const booksReadByUsers = await prisma.booksReadByUsers.findMany({
            where: { userId },
            select: {
              lastAccessedOn: true,
              book: true,
            },
          });
          return new Response(JSON.stringify(booksReadByUsers));
        }
        return new Response(null, { status: 401 });
      },
      POST: async ({ request }: { request: Request }) => {
        const sessionData = await auth.api.getSession(request);
        const userId = sessionData?.session?.userId;
        if (userId) {
          const { books }: { books: BookDTO[] } = await request.json();

          await prisma.$transaction(async tx => {
            const createdBooks = await tx.book.createManyAndReturn({
              skipDuplicates: true,
              data: books.map((book: BookDTO) => ({
                asin: book.asin,
                title: book.title,
                authors: book.authors,
                coverImageUrl: book.coverImageUrl,
              })),
            });
            await tx.booksReadByUsers.createMany({
              skipDuplicates: true,
              data: createdBooks.map((book: PrismaBook, index: number) => ({
                bookId: book.id,
                userId: userId,
                lastAccessedOn: books[index].lastAccessedOn,
              })),
            });
          });
          return new Response(JSON.stringify({}), { headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        return new Response(null, { status: 401 });
      },
    },
  },
});
