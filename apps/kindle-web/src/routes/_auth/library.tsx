import { createFileRoute } from '@tanstack/react-router';

import { Card, CardContent } from '@/components/ui/card';
import { replaceAmazonImageSize } from '@/utils/replaceAmazonImageSize';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatAuthors } from '@/utils/formatAuthors';
import { isomorphicFetch } from '@/lib/isomorphicFetch';
import { ErrorScreen } from '@/components/ErrorScreen';

export const Route = createFileRoute('/_auth/library')({
  component: RouteComponent,
  loader: async () => {
    try {
      const response = await isomorphicFetch('/api/books');
      const booksReadByUsers = await response.json();
      return { books: booksReadByUsers };
    } catch (e) {
      return { error: 'Failed to fetch books' };
    }
  },
});

function RouteComponent() {
  const { books, error } = Route.useLoaderData();

  if (error) {
    return <ErrorScreen error={error} />;
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {books.map(({ book, lastAccessedOn }) => (
        <Card key={book.id} className="py-4 max-w-2xs hover:shadow-lg hover:cursor-pointer">
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
