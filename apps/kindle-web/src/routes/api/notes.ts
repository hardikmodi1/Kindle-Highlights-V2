import { createFileRoute } from '@tanstack/react-router';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { NoteDTO } from '@repo/types/note';
import { Tag } from '@/generated/prisma/client';

export const Route = createFileRoute('/api/notes')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const sessionData = await auth.api.getSession(request);
        const userId = sessionData?.session?.userId;
        if (userId) {
          const { notes: rawNotes, asin }: { asin: string; notes: NoteDTO[] } = await request.json();
          const book = await prisma.book.findUnique({ where: { asin } });

          if (!book) {
            return new Response(null, { status: 401 });
          }

          const userTags = await prisma.tag.findMany({ where: { userId }, select: { shortForm: true, id: true } });

          const notesData = rawNotes.map(({ highlightedText, note }) => {
            let matchedTags: Array<{ shortForm: string; id: string }> = [];
            let noteToSave: string | undefined;

            if (note) {
              noteToSave = note;
              matchedTags = userTags.filter(({ shortForm }) => note.includes(shortForm));
              for (const tag of matchedTags) {
                // use global replace with escape to avoid regex characters issue
                const escaped = tag.shortForm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                noteToSave = noteToSave.replace(new RegExp(escaped, 'g'), '').trim();
              }
            }

            return {
              userId,
              bookId: book?.id as string,
              highlightedText,
              note: note !== noteToSave ? noteToSave : undefined,
              originalNote: note,
            };
          });

          await prisma.$transaction(async tx => {
            const createdNotes = await tx.note.createManyAndReturn({
              skipDuplicates: true,
              data: notesData,
            });

            const tagsData: Array<{ noteId: string; tagId: string }> = [];
            createdNotes.forEach(({ originalNote, id }) => {
              let matchedTags: Array<{ shortForm: string; id: string }> = [];
              let noteToSave: string | undefined;

              if (originalNote) {
                noteToSave = originalNote;
                matchedTags = userTags.filter(({ shortForm }) => originalNote.includes(shortForm));
                for (const tag of matchedTags) {
                  // use global replace with escape to avoid regex characters issue
                  const escaped = tag.shortForm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                  noteToSave = noteToSave.replace(new RegExp(escaped, 'g'), '').trim();
                }
              }
              matchedTags.forEach(({ id: tagId }) => {
                tagsData.push({ noteId: id, tagId });
              });
            });

            await tx.tagsOnNotes.createMany({
              skipDuplicates: true,
              data: tagsData,
            });
          });

          return new Response(JSON.stringify({}));
        }

        return new Response(null, { status: 401 });
      },
    },
  },
});
