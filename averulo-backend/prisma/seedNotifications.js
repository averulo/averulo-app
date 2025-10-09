import { prisma } from "../lib/prisma.js";

await prisma.notification.createMany({
  data: [
    {
      userId: "cmg85e1qx0000xn5rl8l0ldv2",
      type: "BOOKING_STATUS",
      title: "Booking Approved",
      body: "Your booking for The Hive Residence was approved."
    },
    {
      userId: "cmg87grhg0004xnjc4xm39vj8",
      type: "REVIEW_REPLY",
      title: "Guest left a review",
      body: "A guest just reviewed your property."
    }
  ]
});
console.log("Seeded notifications ✅");
process.exit(0);
