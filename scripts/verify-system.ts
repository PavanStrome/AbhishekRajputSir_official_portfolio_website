import { prisma } from "../src/lib/prisma";
import {
  getPublicProfile,
  getPublicPublications,
  getPublicProjects,
  getPublicCourses,
  getPublicResearchAreas,
  getPublicStudents,
  getPublicAwards,
  getPublicNews,
  getPublicSiteSettings,
} from "../src/services/academic-service";
import { verifyPassword, hashPassword, encryptToken, decryptToken } from "../src/lib/auth";

async function runVerification() {
  console.log("==================================================");
  console.log("🧪 STARTING ACADEMIC PORTFOLIO SYSTEM VERIFICATION");
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
    // 1. Database Connection & Seed Data Check
    console.log("1. Checking Database Connectivity & Core Records...");
    const userCount = await prisma.user.count();
    assert(userCount >= 1, `At least 1 admin user exists (found: ${userCount})`);

    const adminUser = await prisma.user.findFirst();
    assert(adminUser !== null, `Admin user '${adminUser?.email}' found in database`);

    const profile = await prisma.profile.findFirst();
    assert(profile !== null && profile.name.includes("Abhishek Rajput"), "Profile exists for Dr. Abhishek Rajput");

    // 2. Authentication Utilities Test
    console.log("\n2. Testing Authentication & JWT System...");
    if (adminUser) {
      const isInvalidPasswordRejected = await verifyPassword("WrongPassword!", adminUser.password);
      assert(!isInvalidPasswordRejected, "Password verification rejects incorrect password");

      const token = await encryptToken({
        userId: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      });
      assert(typeof token === "string" && token.length > 20, "JWT token generation successful");

      const payload = await decryptToken(token);
      assert(payload !== null && payload.email === adminUser.email, "JWT verification correctly decodes payload");
    }

    // 3. Academic Service & Public Data Isolation Test
    console.log("\n3. Testing Public Data Isolation (Draft vs Published)...");
    const pubProfile = await getPublicProfile();
    assert(pubProfile.profile !== null, "getPublicProfile() returns faculty profile");
    assert(pubProfile.education.length > 0, `getPublicProfile() returns education records (${pubProfile.education.length})`);
    assert(pubProfile.positions.length > 0, `getPublicProfile() returns academic positions (${pubProfile.positions.length})`);

    const publicPubs = await getPublicPublications();
    assert(publicPubs.length > 0, `getPublicPublications() returns published papers (${publicPubs.length})`);
    const allPublished = publicPubs.every((p) => p.status === "PUBLISHED");
    assert(allPublished, "All returned publications have status === 'PUBLISHED'");

    // 4. Draft Isolation Integrity Verification
    console.log("\n4. Verifying Draft State Isolation...");
    // Create a temporary draft publication
    const draftPub = await prisma.publication.create({
      data: {
        title: "AUTOMATED_TEST_DRAFT_PUBLICATION_CRASH_TEST",
        authors: "Rajput, A., and Test Co-Author",
        venue: "International Journal of Testing",
        year: 2026,
        publicationType: "JOURNAL",
        status: "DRAFT",
      },
    });

    const publicPubsAfterDraft = await getPublicPublications();
    const draftLeaked = publicPubsAfterDraft.some((p) => p.title === draftPub.title);
    assert(!draftLeaked, "Draft publication is NOT visible in getPublicPublications()");

    // Update draft to published
    await prisma.publication.update({
      where: { id: draftPub.id },
      data: { status: "PUBLISHED" },
    });
    const publicPubsAfterPublish = await getPublicPublications();
    const publishedFound = publicPubsAfterPublish.some((p) => p.title === draftPub.title);
    assert(publishedFound, "Publication becomes visible in getPublicPublications() after publishing");

    // Clean up test publication
    await prisma.publication.delete({ where: { id: draftPub.id } });
    console.log("  🧹 Test publication cleaned up.");

    // 5. Checking other academic service entities
    console.log("\n5. Testing Other Academic Service Entities...");
    const projects = await getPublicProjects();
    assert(projects.length > 0, `getPublicProjects() returns projects (${projects.length})`);

    const courses = await getPublicCourses();
    assert(courses.length > 0, `getPublicCourses() returns courses (${courses.length})`);

    const researchAreas = await getPublicResearchAreas();
    assert(researchAreas.length > 0, `getPublicResearchAreas() returns research themes (${researchAreas.length})`);

    const students = await getPublicStudents();
    assert(students.length > 0, `getPublicStudents() returns students (${students.length})`);

    const awards = await getPublicAwards();
    assert(awards.length > 0, `getPublicAwards() returns awards & honors (${awards.length})`);

    const news = await getPublicNews();
    assert(news.length > 0, `getPublicNews() returns announcements (${news.length})`);

    const settings = await getPublicSiteSettings();
    assert(settings !== null, "SiteSettings record loaded successfully");

    console.log("\n==================================================");
    console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Verification failed with exception:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
