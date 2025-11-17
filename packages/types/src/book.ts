export type BookDTO = {
  coverImageUrl?: string | null | undefined;
  asin: string;
  title: string;
  authors?: string[];
  lastAccessedOn?: Date | null;
};
