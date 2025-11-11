export {};

declare global {
  interface Request {
    userId?: string;
  }
}
