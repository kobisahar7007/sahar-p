# מדריך החלפת DNS — sahar-p.co.il → Vercel

## מצב נוכחי (נמדד עכשיו)
| סוג | ערך | משמעות |
|---|---|---|
| Nameservers | `carla.ns.cloudflare.com`, `arch.ns.cloudflare.com` | DNS מנוהל ב-**Cloudflare** |
| A (apex) | `188.114.97.7`, `188.114.96.7` | Cloudflare proxy (האתר הנוכחי) |
| www | `188.114.96.7`, `188.114.97.7` | Cloudflare proxy |
| **MX** | `0 saharp-co-il01c.mail.protection.outlook.com` | **מייל על Microsoft 365** ⚠️ |
| TXT (SPF) | `v=spf1 ... include:spf.protection.outlook.com -all` | SPF של Microsoft 365 ⚠️ |
| TXT | `MS=ms16218563` | אימות דומיין Microsoft 365 ⚠️ |
| TXT | `facebook-domain-verification=...` | אימות Facebook |

## ⚠️ הכי חשוב: אל תיגע במייל!
הרשומות **MX, TXT (SPF), TXT (MS=...)** חייבות להישאר **ללא שינוי** — אחרת המייל `@sahar-p.co.il` יפסיק לעבוד. נשנה **רק** את רשומות האתר.

## מה לשנות (רק 2–3 רשומות)

בפאנל Cloudflare (או אצל רשם הדומיין), שנה/צור:

### 1. דומיין ראשי (apex)
| סוג | שם | ערך | Proxy |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | **DNS only** (ענן אפור) |

### 2. תת-דומיין www
| סוג | שם | ערך | Proxy |
|---|---|---|---|
| `CNAME` | `www` | `cname.vercel-dns.com` | **DNS only** |

> יש גם רשומות AAAA ישנות של Cloudflare (`2a06:98c1:...`) — אפשר למחוק אותן, או להשאיר (Vercel יטפל ב-IPv6). להסרה נקייה — מחק את ה-AAAA הישנות.

## מה להשאיר ללא שינוי
- `MX` (מייל M365)
- `TXT` SPF (`v=spf1 ...`)
- `TXT` `MS=ms16218563` (אימות M365)
- `TXT` facebook-domain-verification
- כל שאר הרשומות (DKIM, DMARC וכו' אם קיימות)

## שלבים בפועל
1. **קודם** פרסו לאתר ב-Vercel וקבלו את הכתובת הזמנית (`https://<project>.vercel.app`).
2. **אמתו** שהאתר החדש נראה תקין בכתובת הזמנית.
3. ב-Vercel: **Settings → Domains → Add** את `sahar-p.co.il` ו-`www.sahar-p.co.il`.
4. ב-Cloudflare: שנה את A/CNAME כנ"ל ל-**DNS only**.
5. Vercel ינפיק SSL אוטומטית. ההחלפה נכנסת לתוקף תוך דקות-שעות.
6. **בדקו מייל**: שלחו מייל לכתובת `@sahar-p.co.il` לוודא שהמייל ממשיך לעבוד.

> 💡 אם אתם מעדיפים להשאיר את Cloudflare כפרוקסי (ענן כתום), אפשר — אבל מומלץ DNS only כדי להימנע מ-double CDN. Vercel כבר מספק CDN + SSL.
