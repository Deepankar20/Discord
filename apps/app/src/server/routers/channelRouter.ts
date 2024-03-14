import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const channelRouter = router({
  create: publicProcedure
    .input(
      z.object({
        token: z.string(),
        serverId: z.number(),
        cname: z.string(),
        type: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { token, serverId, cname, type } = opts.input;
      console.log("hi");

      try {
        if (!token) {
          return {
            message: "login again",
            code: 403,
            data: null,
          };
        }

        const newChannel = await prisma.channel.create({
          data: {
            name: cname,
            type,
            serverId,
          },
        });

        return {
          message: "channel created successfully!",
          code: 201,
          data: newChannel,
        };
      } catch (error) {
        return {
          message: "an error occured",
          code: 501,
          data: null,
        };
      }
    }),

  get: publicProcedure
    .input(
      z.object({
        token: z.string(),
        serverId: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { token, serverId } = opts.input;

      if (!token) {
        return {
          message: "login again",
          code: 403,
          data: null,
        };
      }

      const channels = await prisma.channel.findMany({
        where: {
          serverId,
        },
      });

      return {
        message: "channel created successfully!",
        code: 201,
        data: channels,
      };
    }),
});
