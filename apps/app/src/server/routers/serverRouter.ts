import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const serverRouter = router({
  create: publicProcedure
    .input(
      z.object({
        token: z.string(),
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { name, token } = opts.input;
      console.log(name);
      

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

      if (decodedToken) {
        //@ts-ignore
        const userId = decodedToken.userId;

        const newServer = await prisma.server.create({
          data: {
            name: name,
            members: {
              connect: { id: userId },
            },
          },
        });

        const newChannel = await prisma.channel.create({
          data: {
            name: "general",
            type: "text",
            server: {
              connect: { id: newServer.id },
            },
          },
        });

        return {
          code: 201,
          message: "server created successfully",
          server: newServer,
        };
      } else {
        return {
          code: 403,
          message: "user not logged in",
          server: null,
        };
      }
    }),

  getServers: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { token } = opts.input;

      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

        //@ts-ignore
        const userId = decodedToken.userId;

        const allServers = await prisma.server.findMany({
          where: {
            members: {
              some: {
                id: userId,
              },
            },
          },
        });

        return {
          code: 201,
          message: "here are all the servers",
          data: allServers,
        };
      } catch (error) {
        return {
          code: 501,
          message: "An Error occured",
          data: null,
        };
      }
    }),

    
});
