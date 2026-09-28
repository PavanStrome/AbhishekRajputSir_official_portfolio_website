import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth";

async function main() {
  const args = process.argv.slice(2);
  
  let newEmail: string | undefined;
  let newPassword: string | undefined;
  let newName: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email" && args[i + 1]) {
      newEmail = args[i + 1].trim();
      i++;
    } else if (args[i] === "--password" && args[i + 1]) {
      newPassword = args[i + 1];
      i++;
    } else if (args[i] === "--name" && args[i + 1]) {
      newName = args[i + 1].trim();
      i++;
    }
  }

  console.log("==================================================");
  console.log("🛠️  FACULTY CMS ADMINISTRATOR CREDENTIALS MANAGER");
  console.log("==================================================\n");

  const currentAdmin = await prisma.user.findFirst();

  if (!currentAdmin) {
    console.error("❌ No admin user exists in the database. Run `npx tsx prisma/seed.ts` first.");
    process.exit(1);
  }

  console.log("Current Registered Admin Account:");
  console.log(`  • ID:    ${currentAdmin.id}`);
  console.log(`  • Name:  ${currentAdmin.name}`);
  console.log(`  • Email: ${currentAdmin.email}`);
  console.log(`  • Role:  ${currentAdmin.role}`);
  console.log("--------------------------------------------------\n");

  if (!newEmail && !newPassword && !newName) {
    console.log("ℹ️  Usage Instructions:");
    console.log("   To update your professor's real credentials from the terminal, run:");
    console.log('   npx tsx scripts/manage-admin.ts --email "real-email@iiti.ac.in" --password "NewPassword123" --name "Dr. Abhishek Rajput"\n');
    console.log("   You can also update only email or only password:");
    console.log('   npx tsx scripts/manage-admin.ts --email "abhishekrajput@iiti.ac.in"');
    console.log('   npx tsx scripts/manage-admin.ts --password "ProfSecurePass@2026"\n');
    await prisma.$disconnect();
    return;
  }

  const updateData: { email?: string; password?: string; name?: string } = {};

  if (newEmail) {
    updateData.email = newEmail.toLowerCase();
  }
  if (newName) {
    updateData.name = newName;
  }
  if (newPassword) {
    if (newPassword.length < 8) {
      console.error("❌ Password must be at least 8 characters long.");
      process.exit(1);
    }
    updateData.password = await hashPassword(newPassword);
  }

  const updated = await prisma.user.update({
    where: { id: currentAdmin.id },
    data: {
      ...updateData,
      failedLoginAttempts: 0,
      lockoutUntil: null,
      resetTokenHash: null,
      resetTokenExpiry: null,
    },
  });

  console.log("✅ ADMINISTRATOR CREDENTIALS UPDATED SUCCESSFULLY!");
  console.log(`  • Name:     ${updated.name}`);
  console.log(`  • Email:    ${updated.email}`);
  if (newPassword) {
    console.log(`  • Password: [Updated to new password]`);
  }
  console.log("\nYou can now sign in at http://localhost:3000/admin/login with these credentials.");
  console.log("==================================================");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Error managing admin:", err);
  process.exit(1);
});
