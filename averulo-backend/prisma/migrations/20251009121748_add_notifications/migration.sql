/*
  Warnings:

  - You are about to drop the column `isRead` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('BOOKING_STATUS', 'REVIEW_REPLY', 'KYC_UPDATE');

-- DropIndex
DROP INDEX "public"."Notification_userId_isRead_idx";

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "isRead",
DROP COLUMN "message",
ADD COLUMN     "body" TEXT,
ADD COLUMN     "data" JSONB,
ADD COLUMN     "readAt" TIMESTAMP(3),
DROP COLUMN "type",
ADD COLUMN     "type" "public"."NotificationType" NOT NULL;

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "public"."Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "public"."Notification"("userId", "readAt");
