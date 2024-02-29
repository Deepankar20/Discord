import { string, z } from "zod";
import { publicProcedure, router } from "../trpc";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import { generate } from "otp-generator";

const prisma = new PrismaClient();

export const emailRouter = router({
  sendEmail: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async (opt) => {
      try {
        const { email } = opt.input;
        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const digits = "0123456789";
        let otp = "";
        for (let i = 0; i < 6; i++) {
          otp += digits[Math.floor(Math.random() * 10)];
        }

        const info = await transporter.sendMail({
          from: "From <Discord>", // sender address
          to: email, // list of receivers
          subject: "Verification Code", // Subject line
          html: `<h1>Here is your OTP : </h1><p>${otp}</p>`, // html body
        });

        return {
          message: info,
          code: otp,
        };
      } catch (error) {
        console.log(error);

        return {
          message: "an error occured",
          code: 501,
        };
      }
    }),

  verifyEmail: publicProcedure
    .input(
      z.object({
        correct: z.boolean(),
        email: z.string(),
      })
    )
    .mutation(async (opt) => {
      const { correct, email } = opt.input;

      try {
        if (correct) {
          const verified = await prisma.user.update({
            where: { email: email },
            data: { emailVerified: true },
          });

          return {
            message: 'Email verifed',
            data: verified
        }
        }
      } catch (error) {
        console.log(error);
        
      }
    }),
});
