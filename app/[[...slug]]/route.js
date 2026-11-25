import { readFile } from 'fs/promises';
import path from 'path';
import { getPageSEO, getPageFile, getAllPaths } from '../../lib/cms.js';

const ROOT = process.cwd();
const PAGES_DIR = path.join(ROOT, 'content', 'pages');

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function seoBlock(seo = {}) {
  const out = [];
  if (seo.description) out.push(`<meta name="description" content="${esc(seo.description)}">`);
  if (seo.og) {
    const og = seo.og;
    out.push(`<meta property="og:type" content="${esc(og.type || 'website')}">`);
    out.push(`<meta property="og:locale" content="he_IL">`);
    if (og.site_name) out.push(`<meta property="og:site_name" content="${esc(og.site_name)}">`);
    if (og.title) out.push(`<meta property="og:title" content="${esc(og.title)}">`);
    if (og.description) out.push(`<meta property="og:description" content="${esc(og.description)}">`);
    if (og.url) out.push(`<meta property="og:url" content="${esc(og.url)}">`);
    if (og.image) out.push(`<meta property="og:image" content="${esc(og.image)}">`);
  }
  if (seo.twitter) {
    out.push(`<meta name="twitter:card" content="summary_large_image">`);
    if (seo.twitter.title) out.push(`<meta name="twitter:title" content="${esc(seo.twitter.title)}">`);
    if (seo.twitter.description) out.push(`<meta name="twitter:description" content="${esc(seo.twitter.description)}">`);
    if (seo.twitter.image) out.push(`<meta name="twitter:image" content="${esc(seo.twitter.image)}">`);
  }
  if (seo.schema) {
    out.push(`<script type="application/ld+json">${JSON.stringify(seo.schema)}</script>`);
  }
  return out.join('\n');
}

function applySEO(html, seo = {}) {
  html = html.replace(/<meta name="generator"[^>]*>\s*/g, '');
  if (seo.title) {
    const t = `<title>${esc(seo.title)}</title>`;
    html = /<title[^>]*>[\s\S]*?<\/title>/.test(html)
      ? html.replace(/<title[^>]*>[\s\S]*?<\/title>/, t)
      : html.replace('</head>', t + '\n</head>');
  }
  if (seo.canonical) {
    const c = `<link rel="canonical" href="${esc(seo.canonical)}">`;
    html = /<link[^>]*rel=["']canonical["'][^>]*>/.test(html)
      ? html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/, c)
      : html.replace('</head>', c + '\n</head>');
  }
  const block = seoBlock(seo);
  if (block) html = html.replace('</head>', block + '\n</head>');
  return html;
}

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const paths = await getAllPaths();
  return paths.map((p) => ({ slug: p === '/' ? [] : p.split('/').filter(Boolean) }));
}

export async function GET(_request, { params }) {
  const slug = (params.slug || []).map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  });
  const pathname = slug.length === 0 ? '/' : '/' + slug.join('/');
  const file = await getPageFile(pathname);
  if (!file) {
    return new Response('Not Found', { status: 404 });
  }
  const seo = (await getPageSEO(pathname)) || {};
  const html = await readFile(path.join(PAGES_DIR, file), 'utf8');
  return new Response(applySEO(html, seo), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=86400',
    },
  });
}
