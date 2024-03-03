import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// export const 