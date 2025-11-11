import { Loader2 } from 'lucide-react';

export const Loader = () => (
  <div className="h-full w-full flex items-center justify-center">
    <Loader2 size={48} className="animate-spin" />
  </div>
);
