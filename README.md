# Sahar-P — Next.js rebuild

שחזור נאמן של sahar-p.co.il (וורדפרס + Elementor) על Next.js, עם אותם נתיבים בדיוק, קידום משופר ותשתית מודרנית.

## ארכיטקטורה
- **`app/[[...slug]]/route.js`** — נתיב catch-all שמגיש כל דף כקובץ HTML סטטי (SSG), עם הזרקת SEO תכנותית.
- **`content/pages/`** — ה-HTML המעובד של כל דף (העתק נאמן של הפלט של וורדפרס).
- **`content/meta.json`** — רשומת כל דף + ה-SEO שלו (title/description/canonical/OG/JSON-LD).
- **`public/assets/`** — כל הנכסים (CSS/JS/תמונות/פונטים/וידאו) מוגשים מקומית.
- **`app/sitemap.js` / `app/robots.js`** — נוצרים אוטומטית מכל הדפים.

## הרצה
```bash
pnpm install
pnpm build   # מייצר את כל הדפים סטטית
pnpm start   # http://localhost:3000
```

## הוספת דף
1. הריץ `python3 ../migrate.py` (סורק את הסייטפ-מפ ומייצר את כל הדפים).
2. או הוסף ידנית קובץ ל-`content/pages/` + רשומה ב-`content/meta.json`.

## שיפורים לעומת המקור (SEO + ביצועים)
- meta description, Open Graph, Twitter Card, JSON-LD (Organization) — נוספו (היו חסרים).
- הסרת תגי `generator` שדלפו את הטכנולוגיה.
- ביטול delay-JS ו-lazy-load של WP Rocket (משפר LCP).
- יצירת דפים סטטית (SSG) — מהיר וניתן ל-CDN.
- sitemap.xml ו-robots.txt אוטומטיים.

## CMS עצמאי (Sanity)
שכבת התוכן נמצאת ב-`lib/cms.js`: קוראת מ-Sanity כשהיא מוגדרת, ונופלת ל-`content/meta.json` כברירת מחדל.

### חיבור Sanity (שלושה שלבים)
1. צור פרויקט Sanity (`https://sanity.io/manage`) + dataset בשם `production`.
2. העתק את Project ID ל-`.env` (ראה `.env.example`).
3. ייבא את התוכן הקיים:
   ```bash
   node scripts/export-sanity.mjs   # מייצר content/sanity-export.ndjson
   npx sanity dataset import content/sanity-export.ndjson production
   ```

### סכמת התוכן (`sanity/schema.js`)
- `settings` — הגדרות אתר (טלפון, אימייל, לוגו, רשתות).
- `page` — עמוד (title, slug, description, ogImage, schemaType).
- `post` — כתבת בלוג (title, slug, excerpt, תמונה, תאריך, קטגוריה).
- `category` — קטגוריה.

## הערות לפריסה ל-Vercel
- קבצי מדיה גדולים (וידאו 63MB + 18MB) ותמונות רבות — מומלץ להעביר ל-Vercel Blob / CDN במקום git.
- הדומיין sahar-p.co.il יחובר בחשבון Vercel (שינוי DNS אצל רשם הדומיין).
- Sanity (CMS עצמאי) יחובר בשלב הבא.
