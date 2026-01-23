import { db } from "../lib/db";
import { users, projects } from "../lib/schema";
import { whopUniversityTemplate } from "../lib/templates/whop-university-template";
import { eq } from "drizzle-orm";

async function seedWhopDemo() {
  console.log("Seeding Whop University demo...");

  // Check if demo user exists
  let demoUser = await db.query.users.findFirst({
    where: eq(users.whopId, "demo-whop-university"),
  });

  if (!demoUser) {
    console.log("Creating demo user...");
    const [newUser] = await db
      .insert(users)
      .values({
        whopId: "demo-whop-university",
        email: "demo@whop.com",
        username: "whop-demo",
        name: "Whop Demo",
        plan: "pro",
      })
      .returning();
    demoUser = newUser;
    console.log("Demo user created:", demoUser.id);
  } else {
    console.log("Demo user exists:", demoUser.id);
  }

  // Check if demo project exists
  let demoProject = await db.query.projects.findFirst({
    where: eq(projects.slug, "whop-university-demo"),
  });

  if (!demoProject) {
    console.log("Creating Whop University demo project...");
    const [newProject] = await db
      .insert(projects)
      .values({
        userId: demoUser.id,
        name: "Whop University Demo",
        slug: "whop-university-demo",
        pageData: whopUniversityTemplate,
        isPublished: "true",
      })
      .returning();
    demoProject = newProject;
    console.log("Demo project created:", demoProject.id);
  } else {
    // Update existing project with latest template
    console.log("Updating existing demo project...");
    await db
      .update(projects)
      .set({
        pageData: whopUniversityTemplate,
        isPublished: "true",
        updatedAt: new Date(),
      })
      .where(eq(projects.id, demoProject.id));
    console.log("Demo project updated:", demoProject.id);
  }

  console.log("\n✅ Whop University demo is ready!");
  console.log(`\nView live at: https://onwhop.com/s/whop-university-demo`);
  console.log(`Or locally at: http://localhost:3000/s/whop-university-demo`);
}

seedWhopDemo()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
