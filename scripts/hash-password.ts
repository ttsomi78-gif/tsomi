import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: npx tsx scripts/hash-password.ts "<password>"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

// Next.js's .env loader expands `$name` references in env values, which
// would silently corrupt a bcrypt hash (it's full of `$` delimiters) unless
// each `$` is escaped as `\$`. Print the .env.local-safe line directly so
// there's nothing to get wrong by hand.
const escaped = hash.replace(/\$/g, "\\$");

console.log(`\nPaste this exact line into .env.local:\n`);
console.log(`ADMIN_PASSWORD_HASH=${escaped}`);
