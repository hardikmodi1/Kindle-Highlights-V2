import { createFileRoute, Navigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { replaceAmazonImageSize } from '@/utils/replaceAmazonImageSize';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatAuthors } from '@/utils/formatAuthors';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { BookData } from '@/types/book';

const fetchBooks = createIsomorphicFn()
  .server<
    [],
    Promise<{
      books?: BookData[];
      error?: string;
    }>
  >(async () => {
    try {
      const headers = getRequestHeaders();
      const response = await fetch('/api/books', {
        headers,
      });
      const booksReadByUsers: BookData[] = await response.json();
      return { books: booksReadByUsers };
    } catch (e) {
      return { error: 'Failed to fetch books' };
    }
  })
  .client<
    Promise<{
      books?: BookData[];
      error?: string;
    }>
  >(async () => {
    try {
      const response = await fetch('/api/books', { credentials: 'include' });
      const booksReadByUsers = await response.json();
      return { books: booksReadByUsers };
    } catch (e) {
      return { books: [], error: 'Failed to fetch books' };
    }
  });

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
  loader: fetchBooks,
});

function RouteComponent() {
  const { books, error } = Route.useLoaderData();

  if (error || !books) {
    return <div>{error}</div>;
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {books.map(({ book, lastAccessedOn }) => (
        <Card className="py-4 max-w-2xs">
          <CardContent className="px-4 flex flex-col items-center gap-2">
            {book.coverImageUrl ? (
              <img className="rounded-lg" src={replaceAmazonImageSize(book.coverImageUrl)} alt={book.title} />
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <h2 className="text-lg font-semibold truncate w-full">{book.title}</h2>
              </TooltipTrigger>
              <TooltipContent className="w-60 text-center">
                <p>{book.title}</p>
              </TooltipContent>
            </Tooltip>

            <div className="w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground text-sm w-fit">{formatAuthors(book.authors)}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{formatAuthors(book.authors)}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
