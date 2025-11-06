import { Logo } from '@/components/Logo';

export const NavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="py-5">
      <div className="m-auto px-3 max-w-6xl flex justify-between items-center">
        <aside>
          <Logo />
        </aside>
        <nav>{children}</nav>
      </div>
    </div>
  );
};
