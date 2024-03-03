import jwt from "jsonwebtoken";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { isLoggedIn } from "../middlewares/isLoggedIn";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // You can adjust the salt rounds as per your requirement
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
}

export const userRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      console.log("first");
      const { username, email, password } = opts.input;

      const hashedPassword = await hashPassword(password);

      try {
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (user) {
          return {
            code: 401,
            message: "user already registered",
            user: user,
          };
        }

        const createUser = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });

        return {
          code: 201,
          message: "Created New User",
          user: createUser,
        };
      } catch (error) {
        return {
          code: 501,
          message: "an error occured",
          user: null,
        };
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async (opt) => {
      const { email, password } = opt.input;

      try {
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (!user) {
          return {
            code: 404,
            message: "user not found",
            user: null,
            token: null,
          };
        }

        const passwordMatch = await comparePasswords(password, user.password);

        if (!passwordMatch) {
          return {
            code: 402,
            message: "wrong user credentials",
            user: null,
            token: null,
          };
        }

        const payload = {
          email: user.email,
          password: user.password,
          userId: user.id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET as string);

        return {
          code: 201,
          message: "logged in successfully",
          user: user,
          token: token,
        };
      } catch (error) {
        return {
          code: 501,
          message: "an error occured",
        };
      }
    }),

  getAllUsers: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { token } = opts.input;

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

      try {
        if (decodedToken) {
          const users = await prisma.user.findMany({});
          //@ts-ignore
          const allUsers = users.filter((user) => user.id !== decodedToken.id);

          console.log(allUsers);
        }
      } catch (error) {
        console.log(error);
      }
    }),

  searchUsers: publicProcedure
    .input(
      z.object({
        token: z.string(),
        searchParams: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { token, searchParams } = opts.input;

      if(!searchParams){
        return{
          code:403,
          data:null
        }
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

      try {
        if (decodedToken) {
          const users = await prisma.user.findMany({
            where: {
              username: {
                contains: searchParams,
              },
            },
          });

          if(!users){
            return{
              code:400,
              data:null
            }
          }

          //@ts-ignore
          const allUsers = users.filter((user) => user.id !== decodedToken.id);

          console.log(allUsers);

          return{
            code:201,
            data:allUsers,
          }
        }
      } catch (error) {
        console.log(error);
      }
    }),
});
