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
  watcher_count: z.number().int(),
});

export const repositoryRouter = createTRPCRouter({
  getUserRepository: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const repositories = await fetchGithubRepository(ctx, input.username);
        const ownerRepositories = repositories?.filter(
          (repo) => repo.owner.login === input.username && !repo.fork
        );

        return ownerRepositories.map(mapGithubReposisotryToProject);
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
        cursor: z.number().int().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 10;
        const { cursor } = input;

        const repositories = await ctx.prisma.repository.findMany({
          take: limit + 1,
          where: {
            published: true,
          },
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
        // check if repository exists
        const repository = await getRepository(ctx, input.repository.id);
        // update repository with published true
        if (repository) {
          await ctx.prisma.repository.update({
            where: { id: input.repository.id },
            data: { published: true },
          });
        }

        if (!repository) {
          await ctx.prisma.repository.create({
            data: {
              ...input.repository,
              published: true,
            },
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error publishing repository",
        });
      }
    }),

  unpublish: protectedProcedure
    .input(
      z.object({
        id: z.number().int().nullish(),
        ownerName: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.ownerName) {
          await ctx.prisma.repository.updateMany({
            data: { published: false },
            where: {
              owner_name: input.ownerName,
            },
          });
        }
        if (input.id) {
          await ctx.prisma.repository.update({
            data: { published: false },
            where: {
              id: input.id,
            },
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error unpublishing repository",
        });
      }
    }),
});

const getRepository = async (ctx: Context, id: number) => {
  return await ctx.prisma.repository.findFirst({
    where: {
      id,
    },
  });
};

export const fetchGithubRepository = async (ctx: Context, username: string) => {
  const token = await getGithubToken(ctx);
  const repositories = await fetchGithubUserRepositoryWithToken(
    token,
    username
  );
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

const fetchGithubUserRepositoryWithToken = async (
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
