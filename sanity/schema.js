// Sanity content model — imported by Sanity Studio / CLI.
// Plain-object schema (no `sanity` package needed to read it).
export const schemaTypes = [
  {
    name: 'settings',
    title: 'הגדרות האתר',
    type: 'document',
    fields: [
      { name: 'siteName', title: 'שם האתר', type: 'string' },
      { name: 'tagline', title: 'תגית', type: 'string' },
      { name: 'phone', title: 'טלפון', type: 'string' },
      { name: 'phone2', title: 'טלפון נוסף', type: 'string' },
      { name: 'fax', title: 'פקס', type: 'string' },
      { name: 'email', title: 'אימייל', type: 'string' },
      { name: 'address', title: 'כתובת', type: 'text' },
      { name: 'logo', title: 'לוגו', type: 'image' },
      { name: 'socials', title: 'רשתות חברתיות', type: 'array', of: [{ type: 'object', fields: [
        { name: 'network', title: 'רשת', type: 'string' },
        { name: 'url', title: 'קישור', type: 'url' },
      ]}]},
    ],
  },
  {
    name: 'page',
    title: 'עמוד',
    type: 'document',
    fields: [
      { name: 'title', title: 'כותרת SEO', type: 'string' },
      { name: 'slug', title: 'נתיב (slug)', type: 'slug', options: { source: 'title', maxLength: 200 } },
      { name: 'description', title: 'meta description', type: 'text', rows: 3 },
      { name: 'ogImage', title: 'תמונת OG', type: 'image' },
      { name: 'canonical', title: 'canonical', type: 'url' },
      { name: 'schemaType', title: 'סוג schema', type: 'string', options: { list: ['WebPage', 'Article', 'Organization', 'Service'] } },
      { name: 'bodyHtml', title: 'תוכן HTML (אופציונלי — גובר על הקובץ הסטטי)', type: 'text' },
    ],
  },
  {
    name: 'post',
    title: 'כתבת בלוג',
    type: 'document',
    fields: [
      { name: 'title', title: 'כותרת', type: 'string' },
      { name: 'slug', title: 'נתיב (slug)', type: 'slug', options: { source: 'title', maxLength: 200 } },
      { name: 'excerpt', title: 'תקציר (description)', type: 'text', rows: 3 },
      { name: 'featuredImage', title: 'תמונת כותרת', type: 'image' },
      { name: 'publishedAt', title: 'תאריך פרסום', type: 'datetime' },
      { name: 'category', title: 'קטגוריה', type: 'reference', to: [{ type: 'category' }] },
      { name: 'bodyHtml', title: 'תוכן HTML', type: 'text' },
    ],
  },
  {
    name: 'category',
    title: 'קטגוריה',
    type: 'document',
    fields: [
      { name: 'title', title: 'שם', type: 'string' },
      { name: 'slug', title: 'נתיב (slug)', type: 'slug', options: { source: 'title' } },
      { name: 'description', title: 'תיאור', type: 'text' },
    ],
  },
];
