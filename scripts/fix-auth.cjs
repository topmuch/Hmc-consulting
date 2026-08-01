// Script to verify and fix admin users in the database
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
  console.log("=== Auth Diagnostic & Fix ===");
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL || "(not set)"}`);

  // Check total users
  const count = await prisma.user.count();
  console.log(`\nTotal users in DB: ${count}`);

  if (count > 0) {
    const all = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, active: true, password: true },
    });
    for (const u of all) {
      console.log(`  - ${u.email} | role=${u.role} | active=${u.active} | password_hash_length=${u.password.length}`);
    }
  }

  // Create or update default users
  console.log("\n--- Ensuring default users exist ---");
  for (const u of DEFAULT_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });

    if (existing) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await prisma.user.update({
        where: { id: existing.id },
        data: { password: hashedPassword, active: u.active },
      });
      console.log(`✓ Updated: ${u.email} (password reset to env/default)`);
    } else {
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
      console.log(`✓ Created: ${created.email} (${created.role})`);
    }
  }

  // Verify by attempting a bcrypt compare
  console.log("\n--- Verification ---");
  for (const u of DEFAULT_USERS) {
    const user = await prisma.user.findUnique({ where: { email: u.email } });
    if (user) {
      const valid = await bcrypt.compare(u.password, user.password);
      console.log(`  ${u.email}: password "${u.password}" ${valid ? "✓ MATCHES" : "✗ DOES NOT MATCH"}`);
    }
  }

  const finalCount = await prisma.user.count();
  console.log(`\nFinal user count: ${finalCount}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
