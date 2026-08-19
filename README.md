# TSOMI — ცომი

Storefront + admin panel for TSOMI, a Georgian streetwear brand. Next.js 15
(App Router), Tailwind CSS 4, Drizzle ORM + Postgres, GSAP/Motion for
animation, Bank of Georgia for card payments. Four locales: en, ru, ka, ja.

Everything runs on one server — database, product photos and app alike. There
is no external storage or database service to depend on.

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
- Product photos uploaded from the admin panel are written to `UPLOADS_DIR`
  (`./uploads` locally, gitignored) and served back from `/uploads/<name>`. No
  external storage service is involved.

## Production deploy (VPS, Docker)

The production stack is defined in [docker-compose.prod.yml](docker-compose.prod.yml):
`db` (Postgres 16 + volume) → `migrate` (one-shot, applies `./drizzle`
migrations) → `web` (standalone Next.js server, bound to loopback) → `caddy`
(TLS terminator on 80/443, config in [Caddyfile](Caddyfile)).

**Point DNS at the server first.** Caddy requests the certificate on startup via
an HTTP-01 challenge on port 80, so the domain has to resolve to this machine
before you bring the stack up:

| Type | Name | Value |
| ---- | ---- | ----- |
| A    | `@`  | `<server-ip>` |
| A    | `www` | `<server-ip>` |

Then, on a fresh Ubuntu server:

```bash
# 1. Install Docker (includes the compose plugin)
curl -fsSL https://get.docker.com | sh

# 2. Open only what's needed
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable

# 3. Get the code
git clone <your-repo-url> tsomi && cd tsomi

# 4. Configure production env
cp .env.production.example .env.production
nano .env.production   # fill in every value (see comments in the file)

# 5. Build and start everything
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

# 6. (first deploy only) seed the starter catalog
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm migrate npx tsx scripts/seed.ts
```

The site is then live on `https://<your-domain>` with a real certificate.

`SITE_URL` (with scheme) and `SITE_DOMAIN` (without) must both be set and must
agree — `SITE_URL` builds the BOG callback and redirect URLs, `SITE_DOMAIN` is
what Caddy requests the certificate for.

On a 2 GB server, add swap before the first build or `next build` will be
OOM-killed:

```bash
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Backups

[scripts/backup-db.sh](scripts/backup-db.sh) dumps Postgres to
`/var/backups/tsomi` and prunes anything older than 14 days. Install it as a
nightly cron job — the volume holds every order, not just the catalog:

```bash
sudo crontab -e   # 15 3 * * * /root/tsomi/scripts/backup-db.sh >> /var/log/tsomi-backup.log 2>&1
```

### Updating the site

```bash
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Pending migrations run automatically before the new web container starts.

## Payments (Bank of Georgia)

Checkout takes card payments through BOG's hosted e-commerce page. The flow:

1. `/[locale]/checkout` posts the cart to `startCheckout`, which **re-prices
   every line from the database** — the browser cart only ever supplies product
   ids and quantities.
2. A `pending` row is written to `orders` + `order_items` (line names and prices
   snapshotted, so later edits to a product don't rewrite history), then a BOG
   order is created and the customer is redirected to BOG.
3. BOG POSTs the result to `/api/bog/callback`, which verifies the RSA-SHA256
   `Callback-Signature` against the raw request body before trusting anything.
4. On a confirmed payment of the **exact** order total, stock is decremented
   once (guarded by `orders.stock_applied`) and the order becomes `paid`.

`/[locale]/order/<id>` is the customer-facing status page. It never infers the
outcome from which redirect URL fired — if the row is still `pending` it asks
BOG directly, so a dropped callback heals itself rather than stranding a paid
order.

### Setup checklist

- Set `BOG_CLIENT_ID` / `BOG_CLIENT_SECRET` from your **own** BOG merchant
  account (they are per-merchant).
- Register `https://<your-domain>/api/bog/callback` with BOG as the callback URL.
- Set `SITE_URL` to the real HTTPS origin — the callback and redirect URLs are
  built from it, so a wrong value silently breaks every payment.
- Adjust `DELIVERY_FEE_TETRI` (in tetri; `500` = 5.00 ₾).

Local testing needs a public HTTPS tunnel to receive callbacks — without one,
orders sit `pending` until the status page reconciles them.

### Notes

- **Schema changes**: edit `src/db/schema.ts`, run `npm run db:generate`
  locally, commit the new files in `drizzle/`. Production applies them on the
  next deploy. (Local dev can keep using `npm run db:push`.)
- **Managed DB instead of the bundled one**: remove the `db`/`migrate`
  services from the compose file and set `DATABASE_URL` in `.env.production`.
- **Backups**: two volumes matter — `tsomi_pgdata` (catalog + every order) and
  `tsomi_uploads` (product photos). [scripts/backup-db.sh](scripts/backup-db.sh)
  captures both; see the Backups section above.
