import { Book } from '@/generated/prisma/client';

export type BookData = {
  lastAccessedOn: string;
  book: Book;
};
