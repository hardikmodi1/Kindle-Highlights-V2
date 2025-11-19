import { SearchXIcon } from 'lucide-react';
import { TypographyH2 } from './ui/typography';

export const EmptyState = ({ message }: { message?: string }) => (
  <div className="h-full w-full flex justify-center items-center flex-col gap-4">
    <SearchXIcon size={42} />
    <TypographyH2>{message || 'No results found'}</TypographyH2>
  </div>
);
