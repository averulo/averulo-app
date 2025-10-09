import { prisma } from "../lib/prisma.js";
async function main() {
  const properties = [
    {
      title: "Eko Signature Suites",
      city: "Lagos",
      address: "1415 Adetokunbo Ademola St, Victoria Island",
      lat: 6.4282,
      lng: 3.4219,
      nightlyPrice: 65000,
      status: "ACTIVE",
      description: "Luxury 5-star hotel with ocean view suites and pool access."
    },
    {
      title: "Banana Island Shortlet",
      city: "Lagos",
      address: "Banana Island Road, Ikoyi",
      lat: 6.4445,
      lng: 3.4210,
      nightlyPrice: 85000,
      status: "ACTIVE",
      description: "Modern apartment with 24/7 security, gym, and ocean breeze."
    },
    {
      title: "Jabi Lake Apartments",
      city: "Abuja",
      address: "Jabi Lake Mall Area, Abuja",
      lat: 9.0765,
      lng: 7.3986,
      nightlyPrice: 40000,
      status: "ACTIVE",
      description: "Cozy lakeside shortlet with Wi-Fi and complimentary breakfast."
    },
    {
      title: "The Hive Residence",
      city: "Port Harcourt",
      address: "Old GRA, Port Harcourt",
      lat: 4.8156,
      lng: 7.0498,
      nightlyPrice: 30000,
      status: "ACTIVE",
      description: "Private shortlet near GRA, perfect for business travelers."
    },
    {
      title: "Victoria Crest Apartment",
      city: "Lekki",
      address: "Chevron Drive, Lekki",
      lat: 6.4682,
      lng: 3.6027,
      nightlyPrice: 50000,
      status: "ACTIVE",
      description: "Furnished apartment with balcony, kitchen, and free parking."
    }
  ];

  console.log("🌍 Seeding properties...");

  for (const prop of properties) {
    await prisma.property.create({
      data: {
        ...prop,
        host: { connect: { id: "cmg87grhg0004xnjc4xm39vj8" } } // 👈 your HOST user ID
      }
    });
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });