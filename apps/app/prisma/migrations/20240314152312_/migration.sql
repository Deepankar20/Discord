/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_name_key" ON "Server"("name");
