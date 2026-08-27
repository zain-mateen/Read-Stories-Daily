# Deploying to GoDaddy (Node.js hosting + cPanel)

This project now stores blog posts in a MySQL database instead of code,
and ships an admin panel at `/admin` for adding, editing, and deleting
posts without touching code or redeploying. This guide covers the full
path from a fresh GoDaddy account to a live, editable site.

Read once through before starting — the order matters (database before
app, app before Monetag/DNS).

## What changed, in one paragraph

Posts used to live in `src/data/posts.ts` as a hardcoded array. They now
live in a MySQL `posts` table, read through `src/lib/db.ts` and
`src/data/posts.ts` (same function names, now async and DB-backed). The
site needs to run as a live Node.js process — not a static export —
because content can change at any time without a rebuild. `server.js` is
the entry point cPanel's Node.js hosting expects. `/admin` is a
password-gated dashboard (`src/proxy.ts` guards it) for managing posts.
Design, layout, and every page you've already seen are unchanged.

---

## 1. Local setup (do this first, to make sure everything works before touching GoDaddy)

1. Copy the env template and fill it in:
   ```bash
   cp .env.example .env.local
   ```
2. You need *some* MySQL server to point `DB_HOST` etc. at for local
   development — e.g. a local MySQL/MariaDB install, XAMPP/MAMP, or a
   free cloud MySQL dev instance. This is only needed if you want to run
   the app locally; you don't need it just to write blog posts once the
   site is deployed, since that happens through `/admin` on the live site.
3. Generate a session secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Paste the result into `ADMIN_SESSION_SECRET` in `.env.local`. Pick your
   own value for `ADMIN_PASSWORD`.
4. Create the schema and load the starter content into your local DB
   (any MySQL client works — command line, TablePlus, etc.):
   ```bash
   mysql -u root -p your_local_db < sql/schema.sql
   mysql -u root -p your_local_db < sql/seed.sql
   ```
5. `npm run dev` and confirm the site loads at `localhost:3000`, and
   `localhost:3000/admin/login` lets you sign in with `ADMIN_PASSWORD`.

## 2. Database setup on GoDaddy

All of this is in cPanel — no SSH required.

1. **cPanel → MySQL Databases.** Create a database (e.g. `readstories`;
   GoDaddy will prefix it with your cPanel username automatically, so
   the real name ends up something like `user_readstories`). Create a
   database user with a strong password, and add that user to the
   database with **All Privileges**.
2. **cPanel → phpMyAdmin.** Select your new database, go to the
   **Import** tab, and upload `sql/schema.sql`. Import it. Then repeat
   with `sql/seed.sql` to load the 12 starter posts (safe to import more
   than once — it uses `INSERT IGNORE`, so it won't duplicate rows).
3. Note down the database host (almost always `localhost` on GoDaddy
   shared hosting, since the app and MySQL live on the same box), the
   full database name, username, and password — you'll enter these as
   environment variables in the next step.

## 3. Node.js app setup on GoDaddy

1. **cPanel → Setup Node.js App → Create Application.**
   - Node version: pick the newest available (18+; this project targets
     current Node).
   - Application mode: **Production**.
   - Application root: the folder you'll upload the project into (e.g.
     `readstoriesdaily`).
   - Application URL: your domain (or subdomain).
   - **Application startup file: `server.js`** — this is the custom
     entry point that makes the app work under cPanel's Node hosting
     (Passenger); see the comment at the top of that file for why it's
     needed instead of the usual `next start`.
2. Upload the project into the application root — zip the project
   locally (excluding `node_modules` and `.next`, which get rebuilt on
   the server) and upload via **File Manager**, or FTP/SFTP with the
   credentials cPanel gives you.
3. Back in **Setup Node.js App**, open your app and add these
   **Environment Variables** (values from step 2, plus your own admin
   password and the secret you generated locally):
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=user_readstories
   DB_USER=user_readstories
   DB_PASSWORD=<your DB password>
   ADMIN_PASSWORD=<pick a strong password>
   ADMIN_SESSION_SECRET=<the random string you generated>
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```
   (Leave the Monetag variables out for now — see step 5.)
4. Click **Run NPM Install** in the same screen.
5. Run the production build. If your plan gives you terminal/SSH access
   via cPanel, run `npm run build` from the app's directory. If it
   doesn't, building locally and uploading the `.next` folder alongside
   the rest of the project works too — just make sure `.next` actually
   makes it into the upload (it's gitignored, so a zip made with `git
   archive` would skip it; a plain folder zip won't).
6. Click **Start App** (or **Restart**, if it auto-started).
7. Visit your domain. If it doesn't load, check the app's log file
   (linked from the Setup Node.js App screen) — see Troubleshooting
   below for the most common causes.

## 4. Using the admin panel

- Go to `https://yourdomain.com/admin/login` and sign in with
  `ADMIN_PASSWORD`.
- **New Post** creates a post; the list view lets you edit or delete any
  post. Changes appear on the live site immediately — no rebuild, no
  redeploy.
- The **Content** field is plain text, not a rich-text editor:
  - Separate paragraphs with a blank line.
  - Start a line with `## ` for a heading.
  - Start a line with `> ` for a pull quote.
  - Everything else becomes a normal paragraph.
- Bookmark the login page. Treat `ADMIN_PASSWORD` like any other
  password — it's the only thing standing between the public internet
  and your content.

## 5. Monetag

1. Sign up at Monetag and add your domain. They'll ask you to verify
   ownership — usually either a meta tag or an HTML file to upload to
   your site's root.
   - **File verification:** drop the file into the `public/` folder in
     the project (so it lands at `public/monetag-verify.html` →
     `yourdomain.com/monetag-verify.html`) and redeploy, or upload it
     directly into the app's root via File Manager if your Node app
     serves static files from there.
   - **Meta tag verification:** add it to the `metadata` export in
     `src/app/layout.tsx`.
2. Once approved, Monetag gives you a `<script>` snippet for your chosen
   ad format. Copy its `src` URL into the `NEXT_PUBLIC_MONETAG_SCRIPT_SRC`
   environment variable in cPanel (and `NEXT_PUBLIC_MONETAG_ZONE_ID` if
   your format uses one), then restart the app. The script only renders
   once these are set — nothing to do in code.
3. If Monetag gives you an `ads.txt` snippet, create `public/ads.txt`
   with that exact content and redeploy.
4. A `/privacy` page already exists and is linked from the footer,
   since ad networks require one — the placeholder text there is a
   starting point, not a substitute for real legal review if you want
   one.

## 6. SSL and DNS

- If your domain and hosting are on the same GoDaddy account, DNS is
  usually already pointed correctly, and cPanel's **AutoSSL** issues a
  free certificate automatically within a few minutes to hours of the
  domain resolving. Check **cPanel → SSL/TLS Status**.
- If the domain lives elsewhere, point its **A record** at your GoDaddy
  hosting IP (found in cPanel's home screen).

## Troubleshooting

- **App won't start / "Cannot find module 'next'":** the app's `npm
  install` didn't run inside the application root, or the Node version
  selected doesn't match what got installed. Re-run **Run NPM Install**
  from the Setup Node.js App screen.
- **500 error, log mentions ECONNREFUSED or Access denied for user:**
  a database env var is wrong — double-check `DB_HOST`/`DB_NAME`/
  `DB_USER`/`DB_PASSWORD` against what phpMyAdmin shows for that
  database.
- **500 error, log mentions ADMIN_SESSION_SECRET or ADMIN_PASSWORD is
  not set:** one of those environment variables is missing in cPanel —
  add it and restart the app.
- **Login works but every `/admin` page bounces back to login:**
  usually means the app is running over plain HTTP without SSL yet
  while `secure` cookies are expected, or two different app instances
  ended up with different `ADMIN_SESSION_SECRET` values. Confirm SSL is
  active and the env var is identical everywhere the app runs.
- **Posts don't show new content after editing:** confirm you didn't
  accidentally point the app at a different database than the one you
  imported `schema.sql`/`seed.sql` into.
- **Images not showing:** the site fetches images from whatever URL you
  paste into the post form; if the host you're linking to blocks
  hotlinking, use a different image host.

## Security notes

- Never commit `.env` or `.env.local` — `.gitignore` already excludes
  them (only `.env.example` is tracked).
- Rotate `ADMIN_PASSWORD` if you ever suspect it leaked; sessions
  created with the old `ADMIN_SESSION_SECRET` before a rotation stay
  valid until they expire (12 hours) — rotate the secret too if you need
  to invalidate sessions immediately.
- The database user only needs access to its own database — don't grant
  it broader MySQL privileges than that.
