import { prisma } from "../lib/prisma.js";

async function main() {
  console.log("📦 Seeding demo bookings & reviews...");

  // 🧑 Guest user (replace if needed)
  const guest = await prisma.user.findUnique({
    where: { email: "guest@example.com" },
  });
  const host = await prisma.user.findUnique({
    where: { email: "host@example.com" },
  });

  if (!guest || !host) {
    console.error("❌ Guest or host user not found. Please ensure both exist.");
    process.exit(1);
  }

  // 🏠 Get all properties owned by the host
  const properties = await prisma.property.findMany({
    where: { hostId: host.id },
    take: 5,
  });

  const now = new Date();
  const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // Create a few demo bookings
  for (const [i, prop] of properties.entries()) {
    const booking = await prisma.booking.create({
      data: {
        propertyId: prop.id,
        guestId: guest.id,
        startDate: addDays(i * 3),
        endDate: addDays(i * 3 + 2),
        status: i % 2 === 0 ? "APPROVED" : "PENDING",
        paymentStatus: i % 2 === 0 ? "SUCCESS" : "PENDING",
        totalAmount: 35000 * (i + 1),
        currency: "NGN",
        feesJson: {
          tax: 2000,
          service: 3000,
          cleaning: 1000,
          total: 35000 * (i + 1),
          nights: 2,
          currency: "NGN",
        },
      },
    });

    // Add reviews for some bookings
    if (i % 2 === 0) {
      await prisma.review.create({
        data: {
          bookingId: booking.id,
          propertyId: prop.id,
          guestId: guest.id,
          rating: 4 + (i % 2),
          comment: `Really nice stay at ${prop.title}!`,
        },
      });
    }
  }

  console.log("✅ Seeded demo bookings & reviews successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });