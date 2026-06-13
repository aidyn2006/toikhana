// Static-site generation: render marketing routes to real HTML so crawlers and
// social scrapers get a populated <head> (title/description/OG/JSON-LD) and a
// visible shell before any JS runs. Dynamic routes (city/toikhana/blog post)
// stay client-rendered. Run after `vite build` + `vite build --ssr`.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROUTES = ['/', '/about', '/contacts', '/blog', '/add-toikhana', '/login', '/register'];

const distDir = path.resolve('dist');
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
const { render } = await import(pathToFileURL(path.resolve('dist-server/entry-server.js')).href);

function buildPage(url) {
  const { html, helmetContext } = render(url);
  const helmet = helmetContext.helmet;
  let page = template;

  if (helmet) {
    // Drop the static default SEO tags so we don't duplicate Helmet's output.
    page = page
      .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
      .replace(/\s*<meta\s+name="description"[^>]*>/gi, '')
      .replace(/\s*<meta\s+name="keywords"[^>]*>/gi, '')
      .replace(/\s*<meta\s+property="og:[^"]*"[^>]*>/gi, '')
      .replace(/\s*<meta\s+name="twitter:[^"]*"[^>]*>/gi, '');

    const headTags = [
      helmet.title.toString(),
      helmet.meta.toString(),
      helmet.link.toString(),
      helmet.script.toString()
    ]
      .filter(Boolean)
      .join('\n    ');
    page = page.replace('</head>', `    ${headTags}\n  </head>`);
  }

  return page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

for (const url of ROUTES) {
  const page = buildPage(url);
  const outDir = url === '/' ? distDir : path.join(distDir, url);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page);
  console.log(`prerendered ${url} -> ${path.relative(distDir, path.join(outDir, 'index.html')) || 'index.html'}`);
}

console.log(`\nDone: ${ROUTES.length} routes prerendered.`);
