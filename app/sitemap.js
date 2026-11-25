import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-static';

const BASE = 'https://sahar-p.co.il';

export default async function sitemap() {
  const meta = JSON.parse(
    await readFile(path.join(process.cwd(), 'content', 'meta.json'), 'utf8'),
  );
  return Object.keys(meta.pages || {}).map((p) => ({
    url: p === '/' ? BASE + '/' : BASE + p + '/',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: p === '/' ? 1.0 : 0.7,
  }));
}
