import { Tag } from '@/generated/prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns/format';

export const columns: ColumnDef<Tag>[] = [
  {
    accessorKey: 'shortForm',
    header: 'Short Form',
  },
  {
    accessorKey: 'longForm',
    header: 'Long Form',
  },
  {
    // accessorKey: 'createdAt',
    accessorFn: row => format(row.createdAt, 'MMM d, yyyy h:mm a'),
    header: 'Date Created',
  },
];
