import { Prisma } from "@prisma/client";

/** True when the DB (or Prisma `prisma+` HTTP bridge) is not reachable — safe to use built-in fallbacks. */
export function isUnreachableDbError(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientInitializationError) return true;
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    // P5010: Prisma Accelerate / prisma+ URL "fetch failed" (bridge not running or wrong URL)
    // P1001: TCP cannot reach database server
    // P2024: pool timeout
    return e.code === "P5010" || e.code === "P1001" || e.code === "P2024";
  }
  return false;
}

export async function readOrFallback<T>(context: string, fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (!isUnreachableDbError(e)) throw e;
    if (process.env.NODE_ENV === "development") {
      const code =
        e instanceof Prisma.PrismaClientKnownRequestError
          ? e.code
          : e instanceof Prisma.PrismaClientInitializationError
            ? "init"
            : "?";
      console.warn(
        `[db] ${context}: cannot reach database (${code}). Using fallback content. ` +
          `Use DATABASE_URL=postgresql://user:pass@host:5432/db with a running Postgres, ` +
          `or run the Prisma Postgres dev server if you use prisma+postgres://.`,
      );
    }
    return fallback;
  }
}
