-- CreateEnum
CREATE TYPE "public"."KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "kycStatus" "public"."KycStatus" NOT NULL DEFAULT 'PENDING';
