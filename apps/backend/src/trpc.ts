import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import superjson from "superjson";
import { dbClient } from "@ucr/db-client";

export const createTRPCContext = async () => {
  return { dbClient };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
