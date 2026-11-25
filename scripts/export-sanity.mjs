// Export current content (meta.json + pages) to Sanity NDJSON for one-command import.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.join(process.cwd());
const META = JSON.parse(await readFile(path.join(ROOT, 'content', 'meta.json'), 'utf8'));
const PAGES_DIR = path.join(ROOT, 'content', 'pages');

function slugObj(s) {
  return { _type: 'slug', current: s.replace(/^\/+|\/+$/g, '') };
}

async function classify(htmlPath) {
  const h = await readFile(htmlPath, 'utf8');
  if (/data-elementor-type="single-post"/.test(h)) return 'post';
  if (/data-elementor-type="wp-page"/.test(h)) return 'page';
  return 'page'; // archives/category treated as page (or category)
}

const docs = [];

// settings
docs.push({
  _id: 'settings',
  _type: 'settings',
  siteName: 'סהר פרסום ותקשורת',
  phone: '077-5439142',
  fax: '08-643-9142',
  email: 'kobi@sahar-p.co.il',
});

// category (blog)
docs.push({
  _id: 'category-blog',
  _type: 'category',
  title: 'בלוג',
  slug: slugObj('/category/בלוג'),
  description: 'כל הכתבות, המאמרים והעדכונים של סהר פרסום ותקשורת.',
});

let pageN = 0, postN = 0;
for (const [key, entry] of Object.entries(META.pages)) {
  const seo = entry.seo || {};
  const filePath = path.join(PAGES_DIR, entry.file);
  const isRoot = key === '/';
  const type = isRoot ? 'page' : await classify(filePath);
  const slug = isRoot ? slugObj('/') : slugObj(key);
  const doc = {
    _id: `${type}-${(isRoot ? 'home' : key.replace(/[^a-zA-Z0-9א-ת\-_]/g, '-'))}`,
    _type: type === 'post' ? 'post' : 'page',
    title: seo.title || '',
    slug,
    description: seo.description || '',
    canonical: seo.canonical || '',
    schemaType: type === 'post' ? 'Article' : 'WebPage',
  };
  docs.push(doc);
  if (type === 'post') postN++; else pageN++;
}

const out = docs.map((d) => JSON.stringify(d)).join('\n') + '\n';
const outPath = path.join(ROOT, 'content', 'sanity-export.ndjson');
await writeFile(outPath, out, 'utf8');
console.log(`exported ${docs.length} documents -> ${outPath}`);
console.log(`  settings: 1, category: 1, pages: ${pageN}, posts: ${postN}`);
