import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash("123456", 10);
  await prisma.user.upsert({
    where: { email: "demo@lunaria.beauty" },
    update: {},
    create: {
      name: "Minh Anh",
      email: "demo@lunaria.beauty",
      password,
      role: "CUSTOMER",
    },
  });
  console.log("   • demo user: demo@lunaria.beauty / 123456");

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
