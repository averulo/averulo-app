-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookingId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "public"."Review"("bookingId");

-- CreateIndex
CREATE INDEX "Review_propertyId_idx" ON "public"."Review"("propertyId");

-- CreateIndex
CREATE INDEX "Review_guestId_idx" ON "public"."Review"("guestId");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
