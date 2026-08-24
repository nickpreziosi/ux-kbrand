/**
 * One-time backfill: pre-links the Microsoft (Entra ID) provider to existing
 * password accounts in the shared core-dev Firebase pool, so staff whose
 * @k-lab.ai email already exists don't hit
 * auth/account-exists-with-different-credential on first Microsoft sign-in.
 *
 * Input: a JSON file mapping work emails to Entra object IDs (from a Graph
 * export — `id` on the user object):
 *
 *   [
 *     { "email": "nelson.reina@k-lab.ai", "microsoftObjectId": "00000000-0000-..." }
 *   ]
 *
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT_JSON='...' node scripts/backfill-link-microsoft-provider.mjs mapping.json --dry-run
 *   FIREBASE_SERVICE_ACCOUNT_JSON='...' node scripts/backfill-link-microsoft-provider.mjs mapping.json
 *
 * Accounts that don't exist yet are skipped (they'll be created cleanly on
 * first Microsoft sign-in). Accounts already linked are skipped. Personal-email
 * accounts can't be linked to Entra identities — leave them out of the mapping.
 */
import { readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const MICROSOFT_PROVIDER_ID = "microsoft.com";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const mappingPath = args.find((a) => !a.startsWith("--"));

if (!mappingPath) {
  console.error(
    "Usage: node scripts/backfill-link-microsoft-provider.mjs <mapping.json> [--dry-run]",
  );
  process.exit(1);
}

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    return initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
  }
  // Falls back to GOOGLE_APPLICATION_CREDENTIALS / ADC.
  return initializeApp();
}

const mapping = JSON.parse(readFileSync(mappingPath, "utf8"));
if (!Array.isArray(mapping)) {
  console.error("Mapping file must be a JSON array of { email, microsoftObjectId }.");
  process.exit(1);
}

const auth = getAuth(getAdminApp());
const summary = { linked: 0, alreadyLinked: 0, noAccount: 0, failed: 0 };

for (const entry of mapping) {
  const email = entry?.email?.trim();
  const microsoftObjectId = entry?.microsoftObjectId?.trim();
  if (!email || !microsoftObjectId) {
    console.error(`SKIP invalid entry: ${JSON.stringify(entry)}`);
    summary.failed += 1;
    continue;
  }

  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch (e) {
    if (e?.code === "auth/user-not-found") {
      console.log(`SKIP ${email} — no existing account (will be created on first sign-in)`);
      summary.noAccount += 1;
      continue;
    }
    console.error(`FAIL ${email} — lookup error: ${e?.message ?? e}`);
    summary.failed += 1;
    continue;
  }

  const alreadyLinked = user.providerData.some(
    (p) => p.providerId === MICROSOFT_PROVIDER_ID,
  );
  if (alreadyLinked) {
    console.log(`SKIP ${email} — Microsoft already linked`);
    summary.alreadyLinked += 1;
    continue;
  }

  if (dryRun) {
    console.log(`DRY-RUN would link ${email} (uid ${user.uid}) → ${microsoftObjectId}`);
    summary.linked += 1;
    continue;
  }

  try {
    await auth.updateUser(user.uid, {
      providerToLink: {
        providerId: MICROSOFT_PROVIDER_ID,
        uid: microsoftObjectId,
        email,
      },
    });
    console.log(`LINKED ${email} (uid ${user.uid}) → ${microsoftObjectId}`);
    summary.linked += 1;
  } catch (e) {
    console.error(`FAIL ${email} — link error: ${e?.message ?? e}`);
    summary.failed += 1;
  }
}

console.log(
  `\nDone${dryRun ? " (dry run)" : ""}: ${summary.linked} linked, ` +
    `${summary.alreadyLinked} already linked, ${summary.noAccount} without accounts, ` +
    `${summary.failed} failed.`,
);
process.exit(summary.failed > 0 ? 1 : 0);
