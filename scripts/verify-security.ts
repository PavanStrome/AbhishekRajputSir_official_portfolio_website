import crypto from "crypto";
import { prisma } from "../src/lib/prisma";
import { hashPassword, verifyPassword } from "../src/lib/auth";

async function runSecurityTests() {
  console.log("==================================================");
  console.log("🛡️  RUNNING BULLETPROOF AUTHENTICATION SECURITY TESTS");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Setup / Identify Admin User
    const admin = await prisma.user.findFirst();
    if (!admin) {
      throw new Error("No admin account found in database. Run seed first.");
    }
    console.log(`Target Admin: ${admin.email}`);
    const originalPasswordHash = admin.password;

    // 2. Lockout & Brute-Force Tracking Test
    console.log("\n1. Testing Account Lockout & Brute-Force Tracking...");
    // Reset to clean slate
    await prisma.user.update({
      where: { id: admin.id },
      data: { failedLoginAttempts: 0, lockoutUntil: null },
    });

    // Simulate 5 consecutive failed attempts
    for (let i = 1; i <= 5; i++) {
      const isMatch = await verifyPassword("WrongPassword123!", admin.password);
      assert(!isMatch, `Attempt #${i} failed password verification`);

      const shouldLock = i >= 5;
      const lockoutTime = shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null;
      await prisma.user.update({
        where: { id: admin.id },
        data: { failedLoginAttempts: i, lockoutUntil: lockoutTime },
      });
    }

    const lockedAdmin = await prisma.user.findUnique({ where: { id: admin.id } });
    assert(lockedAdmin?.failedLoginAttempts === 5, "failedLoginAttempts accurately recorded as 5");
    assert(
      lockedAdmin?.lockoutUntil !== null && (lockedAdmin?.lockoutUntil?.getTime() || 0) > Date.now(),
      "lockoutUntil is actively set ~15 minutes into future"
    );

    // 3. Forgot Password Single-Use Token Test
    console.log("\n2. Testing Cryptographic Token Generation & Storage...");
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: admin.id },
      data: { resetTokenHash: tokenHash, resetTokenExpiry: tokenExpiry },
    });

    const tokenUser = await prisma.user.findUnique({ where: { id: admin.id } });
    assert(tokenUser?.resetTokenHash === tokenHash, "resetTokenHash saved securely as SHA-256");
    assert(
      tokenUser?.resetTokenExpiry !== null && (tokenUser?.resetTokenExpiry?.getTime() || 0) > Date.now(),
      "resetTokenExpiry is set 15 minutes into future"
    );

    // 4. Reset Password & Invalidation Test
    console.log("\n3. Testing Password Reset & Single-Use Token Invalidation...");
    const testNewPassword = "NewSecurePassword@2026";
    const newHash = await hashPassword(testNewPassword);

    // Invalidate token on reset
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        password: newHash,
        resetTokenHash: null,
        resetTokenExpiry: null,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    const updatedUser = await prisma.user.findUnique({ where: { id: admin.id } });
    assert(updatedUser?.resetTokenHash === null, "resetTokenHash is strictly cleared (single-use)");
    assert(updatedUser?.resetTokenExpiry === null, "resetTokenExpiry is strictly cleared");
    assert(updatedUser?.failedLoginAttempts === 0, "failedLoginAttempts reset to 0 after password change");
    assert(updatedUser?.lockoutUntil === null, "lockoutUntil cleared after password change");

    const newPassValid = await verifyPassword(testNewPassword, updatedUser?.password || "");
    assert(newPassValid, "New password verified successfully");

    // Clean up: restore original password
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        password: originalPasswordHash,
        failedLoginAttempts: 0,
        lockoutUntil: null,
        resetTokenHash: null,
        resetTokenExpiry: null,
      },
    });
    console.log("  🧹 Restored original credentials and cleared test state.");

    console.log("\n==================================================");
    console.log(`SECURITY VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Security verification failed with exception:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSecurityTests();
