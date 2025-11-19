import { type ReactNode } from 'react';

export function TypographyH1({ children }: { children: ReactNode }) {
  return <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{children}</h1>;
}

export function TypographyH2({ children }: { children: ReactNode }) {
  return <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">{children}</h2>;
}

export function TypographyMuted({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}
