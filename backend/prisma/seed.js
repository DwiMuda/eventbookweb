// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventbook.id' },
    update: {},
    create: {
      name: 'Admin EventBook',
      email: 'admin@eventbook.id',
      password: adminPass,
      role: 'ADMIN',
    },
  });

  // Create organizer
  const orgPass = await bcrypt.hash('organizer123', 10);
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@eventbook.id' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'organizer@eventbook.id',
      password: orgPass,
      role: 'ORGANIZER',
    },
  });

  // Create sample events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Vue.js Workshop — Bali Tech Meetup',
        description: 'Workshop intensif Vue 3 Composition API untuk developer yang ingin upgrade skill. Materi mencakup reactivity system, composables, Pinia, dan deployment best practice.',
        date: new Date('2025-03-15T09:00:00+08:00'),
        location: 'Dojo Bali, Canggu, Bali',
        quota: 30,
        status: 'ACTIVE',
        createdBy: organizer.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Digital Nomad Networking Night',
        description: 'Malam networking untuk para digital nomad dan remote worker di Bali. Kesempatan bertemu komunitas, berbagi pengalaman, dan membangun kolaborasi.',
        date: new Date('2025-03-22T18:00:00+08:00'),
        location: 'Outpost Ubud, Bali',
        quota: 50,
        status: 'ACTIVE',
        createdBy: organizer.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Product Design Bootcamp',
        description: 'Bootcamp 2 hari untuk belajar UI/UX design dari nol sampai siap portfolio. Menggunakan Figma dan design thinking framework.',
        date: new Date('2025-04-05T08:00:00+08:00'),
        location: 'Dojo Bali, Seminyak, Bali',
        quota: 20,
        status: 'ACTIVE',
        createdBy: admin.id,
      },
    }),
  ]);

  console.log(`✅ Created ${events.length} events`);
  console.log('✅ Seed complete!');
  console.log('\n📋 Login credentials:');
  console.log('  Admin:     admin@eventbook.id / admin123');
  console.log('  Organizer: organizer@eventbook.id / organizer123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
