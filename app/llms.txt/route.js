import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-static';

const BASE = 'https://www.sahar-p.co.il';

export async function GET() {
  const meta = JSON.parse(
    await readFile(path.join(process.cwd(), 'content', 'meta.json'), 'utf8'),
  );
  const lines = [
    '# סהר פרסום ותקשורת',
    '> משרד פרסום ותקשורת מוביל בבאר שבע והנגב — מיתוג, עיצוב, שיווק דיגיטלי, הפקות דפוס, יחסי ציבור, ייבוא מסין ויצירת תוכן. החברה מספקת פתרונות שיווק ותקשורת מקיפים לעסקים בכל הגדלים.',
    '',
    'פרטי קשר: טלפון 077-5439142, מייל kobi@sahar-p.co.il',
    '',
  ];
  for (const [key, e] of Object.entries(meta.pages || {})) {
    const title = (e.seo && e.seo.title) || key;
    const desc = (e.seo && e.seo.description) || '';
    const url = key === '/' ? `${BASE}/` : `${BASE}${key}/`;
    lines.push(`- [${title}](${url}): ${desc}`);
  }
  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
