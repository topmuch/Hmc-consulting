// scripts/create-admin.cjs
// Creates initial admin + manager users if they don't exist.
// Called by the Docker CMD on first boot.
// Usage: node scripts/create-admin.cjs

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEFAULT_USERS = [
  {
    email: "admin@hmc-consulting.pro",
    name: "Admin HMC",
    password: process.env.ADMIN_PASSWORD || "hmc2024",
    role: "admin",
    active: true,
  },
  {
    email: "cheikh@hmc-consulting.pro",
    name: "Cheikh Lam",
    password: process.env.MANAGER_PASSWORD || "hmc2024",
    role: "manager",
    active: true,
  },
];

async function main() {
  console.log("[create-admin] Seeding users...");

  for (const u of DEFAULT_USERS) {
    try {
      const existing = await prisma.user.findUnique({ where: { email: u.email } });

      if (existing) {
        console.log(`[create-admin] ✓ User already exists: ${u.email} (${existing.role})`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(u.password, 10);

      const created = await prisma.user.create({
        data: {
          email: u.email,
          name: u.name,
          password: hashedPassword,
          role: u.role,
          active: u.active,
        },
      });

      console.log(`[create-admin] ✓ Created user: ${created.email} (${created.role})`);
    } catch (err) {
      console.error(`[create-admin] ✗ Error creating ${u.email}:`, err.message);
    }
  }

  // Also set adminPassword in SiteSetting for backwards compatibility
  try {
    const adminPwd = process.env.ADMIN_PASSWORD || "hmc2024";
    await prisma.siteSetting.upsert({
      where: { id: "singleton" },
      update: { adminPassword: adminPwd },
      create: { id: "singleton", adminPassword: adminPwd },
    });
    console.log("[create-admin] ✓ SiteSetting.adminPassword set");
  } catch (err) {
    console.error("[create-admin] ✗ Error setting SiteSetting:", err.message);
  }

  const count = await prisma.user.count();
  console.log(`[create-admin] Done. Total users: ${count}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("[create-admin] Fatal:", e);
  process.exit(1);
});
