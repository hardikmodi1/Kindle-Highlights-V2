import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <button
      type="button"
      onClick={() => {
        console.log('Hello World');
      }}
    >
      Hello World
    </button>
  );
}
