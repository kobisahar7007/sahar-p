// Content access layer (CMS abstraction).
// Reads page metadata from Sanity when configured, else falls back to local content/meta.json.
import { readFile } from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();

function sanityConfigured() {
  return !!(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID);
}

let _local = null;
async function localMeta() {
  if (!_local) {
    try {
      _local = JSON.parse(await readFile(path.join(ROOT, 'content', 'meta.json'), 'utf8'));
    } catch {
      _local = { pages: {} };
    }
  }
  return _local;
}

async function sanityPageSEO(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  try {
    const { createClient } = await import('@sanity/client');
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      useCdn: false,
    });
    const doc = await client.fetch(
      `*[_type in ["page","post"] && slug.current == $slug][0]{
         title, description, canonical,
         "ogImage": ogImage.asset->url
       }`,
      { slug },
    );
    if (doc && (doc.title || doc.description)) {
      return {
        title: doc.title,
        description: doc.description,
        canonical: doc.canonical,
        ...(doc.ogImage ? { og: { image: doc.ogImage } } : {}),
      };
    }
  } catch {
    // fall through to local
  }
  return null;
}

export async function getPageSEO(pathname) {
  if (sanityConfigured()) {
    const remote = await sanityPageSEO(pathname);
    if (remote) return remote;
  }
  const meta = await localMeta();
  const entry = (meta.pages || {})[pathname];
  return entry ? entry.seo : null;
}

export async function getPageFile(pathname) {
  const meta = await localMeta();
  const entry = (meta.pages || {})[pathname];
  return entry ? entry.file : null;
}

export async function getAllPaths() {
  const meta = await localMeta();
  return Object.keys(meta.pages || {});
}
