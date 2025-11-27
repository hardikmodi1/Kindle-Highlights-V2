/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-side environment variables
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Server-side environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly BETTER_AUTH_SECRET: string;
      readonly BETTER_AUTH_URL: string;
      readonly SERVER_URL: string;
    }
  }
}

export {};
