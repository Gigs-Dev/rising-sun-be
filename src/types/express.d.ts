
declare namespace Express {
  interface Request {
    user: {
      id: string;
      role?: string;
      tokenVersion?: number;
      isBanned?: boolean;
      tokenVersion?: number
    };
  }
}
