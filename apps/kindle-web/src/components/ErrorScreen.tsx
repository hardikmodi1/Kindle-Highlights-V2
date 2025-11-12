import { XCircle } from 'lucide-react';

export const ErrorScreen = ({ error }: { error?: string }) => (
  <div className="h-full w-full flex justify-center items-center flex-col gap-4">
    <div className="flex justify-center items-center relative">
      <div className="h-20 w-20 rounded-full bg-primary opacity-12"></div>
      <XCircle className="absolute ring-primary text-primary" size={40} />
    </div>
    <p className="text-xl">We're sorry, something went wrong on our end</p>
    {error ? <p className="text-muted-foreground text-base">{error}</p> : null}
  </div>
);
