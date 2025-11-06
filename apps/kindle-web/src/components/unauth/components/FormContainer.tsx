export const FormContainer = ({ children, header }: { children: React.ReactNode; header: string }) => (
  <main className="mt-2 max-w-xl m-auto p-4">
    <div className="text-3xl pb-2 border-b border-gray-300">{header}</div>
    <div className="mt-8">{children}</div>
  </main>
);
