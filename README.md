# TSOMI — ცომი

Storefront + admin panel for TSOMI, a Georgian streetwear brand. Next.js 15
(App Router), Tailwind CSS 4, Drizzle ORM + Postgres, Supabase Storage for
product photos, GSAP/Motion for animation. Four locales: en, ru, ka, ja.

## Local development

```bash
# 1. Start the local Postgres (port 5433)
docker compose up -d

# 2. Configure env
cp .env.example .env.local   # then fill in the values

# 3. Create the schema and seed the catalog
npm run db:push
npm run db:seed

# 4. Run the app
npm run dev
```

Open http://localhost:3000 — the admin panel lives at `/admin`.

- `ADMIN_PASSWORD_HASH` comes from `npx tsx scripts/hash-password.ts "<password>"`.
- Product photo uploads need `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
  (a Supabase project with a public `products` storage bucket).

## Production deploy (DigitalOcean VPS, Docker)

The production stack is defined in [docker-compose.prod.yml](docker-compose.prod.yml):
`db` (Postgres 16 + volume) → `migrate` (one-shot, applies `./drizzle`
migrations) → `web` (standalone Next.js server on port 3000).

On a fresh droplet (Ubuntu):

```bash
# 1. Install Docker (includes the compose plugin)
curl -fsSL https://get.docker.com | sh

# 2. Get the code
git clone <your-repo-url> tsomi && cd tsomi

# 3. Configure production env
cp .env.production.example .env.production
nano .env.production   # fill in every value (see comments in the file)

# 4. Build and start everything
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

# 5. (first deploy only) seed the starter catalog
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm migrate npx tsx scripts/seed.ts
```

The site is now on `http://<droplet-ip>:3000`.

### HTTPS (required for the admin panel)

The admin session cookie is `Secure`, so **logging in only works over
HTTPS**. Point your domain's DNS A record at the droplet, then put Caddy in
front for automatic Let's Encrypt certificates:

```bash
sudo apt install -y caddy
```

`/etc/caddy/Caddyfile`:

```
tsomi.ge {
    reverse_proxy localhost:3000
}
```

```bash
sudo systemctl reload caddy
```

Set `SITE_URL=https://tsomi.ge` in `.env.production` so sitemap/OG URLs use
the real domain (restart with the compose command above after changing env).

### Updating the site

```bash
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Pending migrations run automatically before the new web container starts.

### Notes

- **Schema changes**: edit `src/db/schema.ts`, run `npm run db:generate`
  locally, commit the new files in `drizzle/`. Production applies them on the
  next deploy. (Local dev can keep using `npm run db:push`.)
- **Managed DB instead of the bundled one**: remove the `db`/`migrate`
  services from the compose file and set `DATABASE_URL` in `.env.production`.
- **Backups**: the catalog lives in the `tsomi_pgdata` volume —
  `docker exec <db-container> pg_dump -U tsomi tsomi > backup.sql` on a cron
  is the minimum; photos live in Supabase Storage.
