import { ErrorScreen } from '@/components/ErrorScreen';
import { TypographyH1, TypographyH2, TypographyMuted } from '@/components/ui/typography';
import { isomorphicFetch } from '@/lib/isomorphicFetch';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { ScrollText } from 'lucide-react';
import { format } from 'date-fns/format';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchXIcon } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

export const Route = createFileRoute('/_auth/notes/$bookId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      const [bookResponse, notesResponse] = await Promise.all([
        isomorphicFetch(`/api/books/${params.bookId}`),
        isomorphicFetch(`/api/notes/${params.bookId}`),
      ]);
      const book = await bookResponse.json();
      const notes = await notesResponse.json();
      return { data: { book, notes } };
    } catch (e) {
      console.log(e);
      return { error: 'Failed to fetch books' };
    }
  },
});

function RouteComponent() {
  const { data, error } = Route.useLoaderData();
  const book = data?.book?.book;
  const notes = data?.notes;

  if (error) {
    return <ErrorScreen error={error} />;
  }
  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <div className="flex items-center gap-2">
        <ScrollText size={40} />
        <TypographyH1>Notes</TypographyH1>
      </div>
      <div className="flex gap-4 pb-4 border-b">
        <img src={book.coverImageUrl} />
        <div className="flex flex-col gap-2">
          <TypographyH2>{book.title}</TypographyH2>
          {book.authors ? <TypographyMuted>{book.authors?.join(', ')}</TypographyMuted> : null}
          <TypographyMuted>Last accessed on {format(data?.book.lastAccessedOn, 'MMM dd, yyyy')}</TypographyMuted>
          <TypographyMuted>{notes.length} Notes</TypographyMuted>
        </div>
      </div>
      {notes ? (
        notes.map(({ note, highlightedText, originalNote, tags }) => (
          <Card>
            <CardHeader>{highlightedText}</CardHeader>
            {note || originalNote ? (
              <CardContent>
                <CardDescription>
                  <TypographyMuted>Note: {note || originalNote}</TypographyMuted>
                </CardDescription>
              </CardContent>
            ) : null}
            {tags?.length > 0 ? (
              <CardFooter className="flex gap-2">
                <TypographyMuted>Tags:</TypographyMuted>
                {tags.map(({ tagId, tag: { longForm } }) => (
                  <Badge key={tagId} variant="outline">
                    {longForm}
                  </Badge>
                ))}
              </CardFooter>
            ) : null}
          </Card>
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
