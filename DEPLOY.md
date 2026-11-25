# מדריך פריסה — sahar-p.co.il החדש

הפרויקט מוכן. להשלמת ההעברה צריך שלושה שלבים (כל אחד חד־פעמי, ~10 דקות סה"כ).

---

## שלב 1 — Sanity (מערכת ניהול תוכן)

1. היכנס ל-`https://www.sanity.io/manage` → התחבר/הירשם (חינם).
2. לחץ **Create project** → שם: `sahar-p` → **Create**.
3. בפרויקט → **Datasets** → ודא שיש dataset בשם `production` (אם לא, צור).
4. העתק את ה-**Project ID** (מופיע בראש דף הפרויקט, נראה כמו `a1b2c3d4`).
5. בפרויקט המקומי: העתק את הערך ל-`.env`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=ה-PROJECT-ID-שלך
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
6. ייבא את התוכן הקיים:
   ```bash
   cd sahar-rebuild/site
   node scripts/export-sanity.mjs
   npx --yes @sanity/cli dataset import content/sanity-export.ndjson production
   ```
   (יתבקש להתחבר ל-Sanity — אישור חד־פעמי.)

> אחרי החיבור, ה-site יקרא את ה-SEO מה-CMS אוטומטית. עד אז — עובד עם `content/meta.json` המקומי (fallback).

---

## שלב 2 — Vercel (פריסה)

1. דחוף את הריפו ל-GitHub (או GitLab/Bitbucket):
   ```bash
   cd sahar-rebuild/site
   git remote add origin https://github.com/<שם-משתמש>/sahar-p.git
   git push -u origin main
   ```
2. היכנס ל-`https://vercel.com` → התחבר עם GitHub.
3. **Add New → Project** → בחר את הריפו `sahar-p` → **Import**.
4. בהגדרות:
   - Framework: `Next.js` (מזוהה אוטומטית).
   - Build Command: `pnpm build` (או `npm run build`).
   - **Environment Variables**: הוסף `NEXT_PUBLIC_SANITY_PROJECT_ID` ו-`NEXT_PUBLIC_SANITY_DATASET` (כמו בשלב 1).
5. לחץ **Deploy**. אחרי ~2 דקות תקבל כתובת זמנית (`https://sahar-p.vercel.app`).

---

## שלב 3 — DNS (החלפת הדומיין)

1. אצל רשם הדומיין שלך (איפה ש-`sahar-p.co.il` רשום) — מצא את הגדרות ה-DNS.
2. צור רשומות:
   - `A` → `76.76.21.21` (או מה ש-Vercel מציג)
   - `CNAME` `www` → `cname.vercel-dns.com`
3. ב-Vercel: **Project → Settings → Domains** → הוסף `sahar-p.co.il` ו-`www.sahar-p.co.il` → אישור.
4. Vercel ינפיק SSL אוטומטית (`https://`).

> ⚠️ בצע את החלפת ה-DNS **רק כשהאתר ב-Vercel נראה תקין**. ההחלפה גלובלית תוך דקות-שעות.

---

## הערות טכניות

- **מדיה**: 156MB (אחרי דחיסת תמונות ב-46% וסרטונים מ-4K ל-1080p). הסרטונים: 105MB→10MB.
- **אבטחה**: `vercel.json` מוסיף security headers + cache.
- **החנות (WooCommerce)**: לא הועברה (לפי בקשתך). כתובות `/shop`, `/cart`, `/checkout`, `/my-account` יחזירו 404.
- **סייטפ־מפ ורובוטס**: נוצרים אוטומטית (`/sitemap.xml`, `/robots.txt`).
