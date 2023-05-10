import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  type Context,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { mapGithubReposisotryToProject } from "@/utils/helper";
import { type RepositoryResponse } from "@/types/github";

const RepositorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  url: z.string().url(),
  star_count: z.number().int(),
  owner_id: z.number().int(),
  owner_name: z.string(),
});

export const repositoryRouter = createTRPCRouter({
  getUserRepository: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const repository = await fetchGithubRepository(ctx, input.username);

        return repository.map(mapGithubReposisotryToProject);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error get user repository",
        });
      }
    }),
  getPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.number().int(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 10;
        const { cursor } = input;

        const repositories = await ctx.prisma.repository.findMany({
          take: limit + 1, // get an extra item at the end which we'll use as next cursor
          orderBy: { star_count: "desc" },
          cursor: cursor ? { id: cursor } : undefined,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (repositories.length > limit) {
          const nextRepository = repositories.pop();
          nextCursor = nextRepository?.id;
        }
        return {
          repositories,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error getting repositories",
        });
      }
    }),

  publish: protectedProcedure
    .input(z.object({ repository: RepositorySchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.repository.create({
          data: {
            ...input.repository,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error publishing repository",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ ownerName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.repository.delete({
          where: {
            owner_name: input.ownerName,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error unpublishing repository",
        });
      }
    }),
  update: protectedProcedure
    .input(z.object({ repository: RepositorySchema, ownerName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.repository.update({
          where: {
            owner_name: input.ownerName,
          },
          data: {
            ...input.repository,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating repository",
        });
      }
    }),
});

export const fetchGithubRepository = async (ctx: Context, username: string) => {
  const token = await getGithubToken(ctx);
  const repositories = await fetchGithubUserRepositories(token, username);
  if (!repositories) throw new Error("Error fetching github user");

  return repositories;
};

const getGithubToken = async (ctx: Context) => {
  const { access_token: token } = await ctx.prisma.account.findFirstOrThrow({
    where: {
      userId: ctx.session?.user?.id,
    },
  });
  if (!token) throw new Error("Token not found");
  return token;
};

const fetchGithubUserRepositories = async (
  token: string,
  username: string
): Promise<RepositoryResponse[] | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return (await response.json()) as RepositoryResponse[];
  } catch (error) {
    return null;
  }
};
