import prisma from '@/lib/prisma';
import { createServerOnlyFn } from '@tanstack/react-start';
import { isAfter } from 'date-fns/isAfter';
import { startOfDay } from 'date-fns/startOfDay';

const HIGHLIGHT_METADATA = {
  include: {
    highlight: {
      select: {
        highlightedText: true,
        note: true,
        originalNote: true,
        book: { select: { authors: true, title: true } },
      },
    },
  },
};

export const generateReminders = createServerOnlyFn(async (userId: string) => {
  const reminderNote = await prisma.reminder.findFirst({ where: { userId }, select: { updatedAt: true } });

  console.log(reminderNote);
  if (!reminderNote || (reminderNote && isAfter(startOfDay(new Date()), startOfDay(reminderNote.updatedAt)))) {
    await prisma.reminder.deleteMany({ where: { userId } });

    const randomBooks: Array<{ bookId: string }> = await prisma.$queryRaw`
      SELECT "bookId" FROM books_read_by_users where "userId" = ${userId}
      ORDER BY random() 
      LIMIT 3
    `;
    console.log(randomBooks, 'found Books');

    let randomHighlights: Array<{ id: string }> = [];

    for (let i = 0; i < randomBooks.length; i++) {
      const randomHighlightsFromBook: Array<{ id: string }> =
        (await prisma.$queryRaw`
        SELECT "id" FROM note where "bookId" = ${randomBooks[i].bookId}
        ORDER BY random()
        LIMIT 2
      `) || [];
      randomHighlights.push(...randomHighlightsFromBook);
    }

    return prisma.reminder.createManyAndReturn({
      data: randomHighlights.map(({ id }) => ({ highlightId: id, userId })),
      ...HIGHLIGHT_METADATA,
    });
  }
  return prisma.reminder.findMany({ where: { userId }, ...HIGHLIGHT_METADATA });
});
