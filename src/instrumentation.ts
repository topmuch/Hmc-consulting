/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts — seeds admin users if they don't exist.
 * This is more reliable than the external create-admin.cjs script
 * because it runs in the same process with the same DATABASE_URL.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("[instrumentation] Seeding admin users...");

    try {
      const { db } = await import("@/lib/db");
      const bcrypt = await import("bcryptjs");

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

      for (const u of DEFAULT_USERS) {
        try {
          const existing = await db.user.findUnique({ where: { email: u.email } });

          if (existing) {
            // Always update the password so env var changes take effect
            const hashedPassword = await bcrypt.hash(u.password, 10);
            await db.user.update({
              where: { id: existing.id },
              data: { password: hashedPassword, active: u.active },
            });
            console.log(`[instrumentation] ✓ Updated: ${u.email} (role=${existing.role})`);
          } else {
            const hashedPassword = await bcrypt.hash(u.password, 10);
            const created = await db.user.create({
              data: {
                email: u.email,
                name: u.name,
                password: hashedPassword,
                role: u.role,
                active: u.active,
              },
            });
            console.log(`[instrumentation] ✓ Created: ${created.email} (${created.role})`);
          }
        } catch (err) {
          console.error(`[instrumentation] ✗ Error with ${u.email}:`, err);
        }
      }

      const count = await db.user.count();
      console.log(`[instrumentation] Done. Total users: ${count}`);
    } catch (err) {
      console.error("[instrumentation] Fatal error seeding users:", err);
    }
  }
}
