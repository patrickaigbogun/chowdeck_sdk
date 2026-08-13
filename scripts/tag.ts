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

    // 2. Prompt the user to choose a bump type
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    const ask = (query: string): Promise<string> =>
      new Promise((resolve) => rl.question(query, resolve));

    let bumpType = "";
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

    // Re-verify current branch is master (or main) before releasing
    const currentBranch = execSync("git branch --show-current", { encoding: "utf8" }).trim();
    
    console.log(`\n🚀 Bumping version locally using npm version ${bumpType}...`);
    // Bump version locally in package.json (no commit or tag created yet)
    execSync(`npm version ${bumpType} --no-git-tag-version`, { stdio: "inherit" });

    // Sync lockfile
    console.log("🔒 Syncing bun.lock lockfile...");
    execSync("bun install", { stdio: "inherit" });

    // Fetch the new version number
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const nextVersion = `v${pkg.version}`;
    const releaseBranch = `release/${nextVersion}`;

    console.log(`\n🌿 Creating new release branch: ${releaseBranch}...`);
    execSync(`git checkout -b ${releaseBranch}`, { stdio: "inherit" });

    console.log(`\n💾 Committing version bump: ${nextVersion}...`);
    execSync("git add package.json bun.lock", { stdio: "inherit" });
    execSync(`git commit -m "chore(release): ${nextVersion}"`, { stdio: "inherit" });

    console.log(`📤 Pushing branch ${releaseBranch} to origin...`);
    execSync(`git push -u origin ${releaseBranch}`, { stdio: "inherit" });

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
