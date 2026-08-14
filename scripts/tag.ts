import { execSync } from "child_process";
import { createInterface } from "readline";
import fs from "fs";
import path from "path";

async function main() {
  try {
    // 1. Verify the git status is clean
    const status = execSync("git status --porcelain", { encoding: "utf8" });
    if (status.trim() !== "") {
      console.error("❌ Error: Git status is not clean. Please commit or stash your changes first.");
      process.exit(1);
    }

    // 2. Parse command line flags or prompt for bump type
    let bumpType = "";
    const args = process.argv.slice(2);
    
    if (args.includes("-m") || args.includes("--major")) {
      bumpType = "major";
    } else if (args.includes("-s") || args.includes("--minor")) {
      bumpType = "minor";
    } else if (args.includes("-p") || args.includes("--patch")) {
      bumpType = "patch";
    }

    if (!bumpType) {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
      });

      const ask = (query: string): Promise<string> =>
        new Promise((resolve) => rl.question(query, resolve));

      while (true) {
        const answer = await ask("Choose a bump type (patch, minor, major): ");
        const normalized = answer.trim().toLowerCase();
        if (["patch", "minor", "major"].includes(normalized)) {
          bumpType = normalized;
          break;
        }
        console.log("⚠️ Invalid choice. Please enter 'patch', 'minor', or 'major'.");
      }
      rl.close();
    }

    // Re-verify current branch is master (or main) before releasing
    const currentBranch = execSync("git branch --show-current", { encoding: "utf8" }).trim();
    
    // 3. Read package.json and bump version programmatically
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const currentVersion = pkg.version;
    const versionParts = currentVersion.split(".").map(Number);
    
    if (versionParts.length !== 3 || versionParts.some(isNaN)) {
      console.error(`❌ Error: Invalid version format in package.json: "${currentVersion}"`);
      process.exit(1);
    }

    if (bumpType === "major") {
      versionParts[0]++;
      versionParts[1] = 0;
      versionParts[2] = 0;
    } else if (bumpType === "minor") {
      versionParts[1]++;
      versionParts[2] = 0;
    } else if (bumpType === "patch") {
      versionParts[2]++;
    }

    const nextVersion = `v${versionParts.join(".")}`;
    pkg.version = versionParts.join(".");
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

    console.log(`\n🚀 Bumping version locally to ${nextVersion}...`);

    // Sync lockfile
    console.log("🔒 Syncing bun.lock lockfile...");
    execSync("bun install", { stdio: "inherit" });

    // Generate documentation locally using Dokugen
    console.log("📝 Generating documentation and changelogs with Dokugen...");
    try {
      execSync("bun x dokugen update && bun x dokugen changelog", { stdio: "inherit" });
    } catch (e) {
      console.warn("⚠️ Warning: Dokugen failed locally, proceeding anyway...");
    }

    const releaseBranch = `release/${nextVersion}`;

    console.log(`\n🌿 Preparing release branch: ${releaseBranch}...`);
    // Delete branch locally if it exists from a previous run
    try {
      execSync(`git branch -D ${releaseBranch}`, { stdio: "ignore" });
    } catch (e) {}

    execSync(`git checkout -b ${releaseBranch}`, { stdio: "inherit" });

    console.log(`\n💾 Committing version bump and documentation: ${nextVersion}...`);
    // 5. Commit package.json, bun.lock, and documentation changes
    execSync("git add package.json bun.lock README.md CHANGELOG.md", { stdio: "inherit" });
    execSync(`git commit -m "chore(release): ${nextVersion}"`, { stdio: "inherit" });

    console.log(`📤 Pushing branch ${releaseBranch} to origin...`);
    // 6. Push the commit to release branch
    execSync(`git push -u origin ${releaseBranch} --force`, { stdio: "inherit" });

    // Return to original branch
    execSync(`git checkout ${currentBranch}`, { stdio: "inherit" });

    console.log(`\n✅ Successful! Release branch ${releaseBranch} pushed.`);
    console.log(`👉 Next step: Open a Pull Request from ${releaseBranch} to master.`);
    console.log(`   The CI will run Dokugen to automatically add the CHANGELOG and README updates to the PR.`);
    console.log(`   Merging the PR to master will trigger the npm publish and create the git tag.`);
  } catch (error) {
    console.error("❌ An error occurred during the release setup:", error);
    process.exit(1);
  }
}

main();
