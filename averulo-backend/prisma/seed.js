// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a HOST user
  const host = await prisma.user.upsert({
    where: { email: 'host@averulo.test' },
    update: {},
    create: {
      email: 'host@averulo.test',
      password: 'hashedpassword',  // replace with bcrypt later
      role: 'HOST'
    },
  });

  // Create a GUEST user
  const guest = await prisma.user.upsert({
    where: { email: 'guest@averulo.test' },
    update: {},
    create: {
      email: 'guest@averulo.test',
      password: 'hashedpassword',
      role: 'GUEST'
    },
  });

  // Create a PROPERTY for the host
  const property = await prisma.property.upsert({
    where: { id: 'property_seed_1' }, // hack: stable ID for seed reruns
    update: {},
    create: {
      id: 'property_seed_1',
      title: 'Cozy 1BR near Eko Hotel',
      description: 'Walk to venue. AC. WiFi.',
      price: 350000, // in kobo
      city: 'Lagos',
      lat: 6.4281,
      lng: 3.4219,
      photos: ['https://picsum.photos/800/600?random=1'],
      status: 'ACTIVE',
      hostId: host.id,
    },
  });

  // Create a BOOKING by the guest for that property
  await prisma.booking.create({
    data: {
      propertyId: property.id,
      guestId: guest.id,
      checkIn: new Date('2025-09-15'),
      checkOut: new Date('2025-09-20'),
      amount: 350000,
      currency: 'NGN',
      status: 'PAID',
      paystackRef: 'TEST_REF_12345'
    },
  });

  console.log('✅ Seeded: Host, Guest, Property, Booking');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });