# justin.software Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a professional personal website for Justin Helmer at justin.software — dark, architectural, keyboard-driven, deployed to Cloudflare Pages.

**Architecture:** Astro v5 static site with content collections for markdown blog posts. Shell-style command palette and vim keybindings provide an IDE-like navigation layer. Cloudflare Pages for hosting with zero server-side logic.

**Tech Stack:** Astro 5, TypeScript, CSS custom properties (no framework), Fontsource for self-hosted fonts, Cloudflare Pages

**Design Spec:** `docs/superpowers/specs/2026-04-10-justin-software-design.md`

---

## File Map

```
justin-software/
├── astro.config.mjs              # Astro config: site URL, sitemap integration, view transitions
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript config (Astro strict preset)
├── .gitignore                    # Node, Astro, Cloudflare ignores
├── src/
│   ├── layouts/
│   │   └── Base.astro            # HTML shell: head, meta, OG tags, grid bg, nav, view transitions
│   ├── components/
│   │   ├── Nav.astro             # Mark (justin.software) + path-style nav links
│   │   ├── PostList.astro        # Reusable post row list (homepage latest + writing index)
│   │   ├── ShellPalette.astro    # Bottom-anchored command palette (client:idle)
│   │   ├── KeyboardNav.astro     # Vim-style keybindings: g+key chords, j/k (client:idle)
│   │   └── HelpOverlay.astro     # ? keybinding reference panel (client:idle)
│   ├── pages/
│   │   ├── index.astro           # Homepage: role label, name, bio, latest 2 posts
│   │   ├── about.astro           # About: 3 sentences
│   │   ├── writing/
│   │   │   ├── index.astro       # Blog index: flat chronological post list
│   │   │   └── [...slug].astro   # Individual post: rendered markdown
│   │   ├── links.astro           # Links: GitHub, LinkedIn, email
│   │   └── feed.xml.ts           # RSS feed
│   ├── content/
│   │   ├── config.ts             # Content collection schema (title, date, description)
│   │   └── writing/
│   │       └── hello-world.md    # Seed post for development
│   └── styles/
│       └── global.css            # CSS reset, custom properties, grid bg, prose styles
├── public/
│   └── favicon.svg               # Minimal favicon
└── docs/                         # Specs and plans (already exists)
```

---

### Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialize the project**

```bash
cd /Users/justin/projects/justin-software
npm init -y
npm install astro@latest @astrojs/sitemap @astrojs/rss
npm install @fontsource-variable/inter @fontsource/fira-code
```

- [ ] **Step 2: Create astro.config.mjs**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://justin.software',
  integrations: [sitemap()],
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 4: Create .gitignore**

```gitignore
node_modules/
dist/
.astro/
.superpowers/
.DS_Store
```

- [ ] **Step 5: Add scripts to package.json**

Replace the `"scripts"` block in `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 6: Create a minimal index page to verify the build**

Create `src/pages/index.astro`:

```astro
---
---
<html>
  <head><title>justin.software</title></head>
  <body><h1>scaffold works</h1></body>
</html>
```

- [ ] **Step 7: Verify the build**

```bash
npx astro build
```

Expected: Build succeeds, `dist/index.html` exists.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/pages/index.astro
git commit -m "scaffold: initialize Astro project with sitemap and font deps"
```

---

### Task 2: Global Styles and Design Tokens

**Files:**
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create global.css with tokens, reset, grid, and typography**

```css
/* src/styles/global.css */
@import '@fontsource-variable/inter';
@import '@fontsource/fira-code/400.css';
@import '@fontsource/fira-code/500.css';

:root {
  --bg: #0c0c0c;
  --text: #f5f5f5;
  --text-secondary: #666;
  --text-tertiary: #333;
  --text-muted: #444;
  --text-link: #bbb;
  --border: #1a1a1a;
  --surface: #161616;
  --grid: rgba(255, 255, 255, 0.025);

  --font-body: 'Inter Variable', -apple-system, system-ui, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', monospace;

  --grid-size: 40px;
  --max-width: 720px;
  --page-padding: 40px;
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  color: var(--text);
}

::selection {
  background: rgba(255, 255, 255, 0.12);
}

/* Mono label utility */
.mono-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.mono-date {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
}

/* Prose styles for blog post content */
.prose {
  max-width: 640px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.prose h1,
.prose h2,
.prose h3 {
  color: var(--text);
  line-height: 1.3;
  margin-top: 2em;
  margin-bottom: 0.5em;
}

.prose h2 {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}

.prose h3 {
  font-size: 1.2rem;
}

.prose p {
  margin-bottom: 1.5em;
}

.prose a {
  color: var(--text-link);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--text-tertiary);
}

.prose a:hover {
  color: var(--text);
  text-decoration-color: var(--text-muted);
}

.prose code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--surface);
  padding: 2px 6px;
  border-radius: 3px;
}

.prose pre {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 20px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose pre code {
  background: none;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1.6;
}

.prose ul,
.prose ol {
  padding-left: 1.5em;
  margin-bottom: 1.5em;
}

.prose li {
  margin-bottom: 0.5em;
}

.prose blockquote {
  border-left: 2px solid var(--border);
  padding-left: 16px;
  color: var(--text-muted);
  margin: 1.5em 0;
}

.prose hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2em 0;
}

.prose img {
  max-width: 100%;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 640px) {
  :root {
    --page-padding: 20px;
  }
}
```

- [ ] **Step 2: Create a minimal favicon**

```svg
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#0c0c0c"/>
  <text x="7" y="23" font-family="monospace" font-size="20" font-weight="600" fill="#f5f5f5">j</text>
</svg>
```

- [ ] **Step 3: Verify fonts resolve**

```bash
npx astro build
```

Expected: Build succeeds with no font-related warnings.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css public/favicon.svg
git commit -m "style: add design tokens, reset, grid background, prose styles, and favicon"
```

---

### Task 3: Base Layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create Base.astro**

```astro
---
// src/layouts/Base.astro
import { ClientRouter } from 'astro:transitions';
import Nav from '../components/Nav.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Justin Helmer — Principal Engineer. Systems architect. Infrastructure builder.' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} | justin.software</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="application/rss+xml" title="justin.software" href="/feed.xml" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <ClientRouter />
  </head>
  <body>
    <div class="page" transition:animate="fade">
      <Nav currentPath={Astro.url.pathname} />
      <main>
        <slot />
      </main>
    </div>
  </body>
</html>

<style>
  .page {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--page-padding);
    min-height: 100vh;
  }

  main {
    padding-top: 72px;
  }
</style>
```

- [ ] **Step 2: Verify build (will fail until Nav exists — expected)**

Create a temporary Nav stub so the layout compiles. Create `src/components/Nav.astro`:

```astro
---
// src/components/Nav.astro (stub — replaced in Task 4)
interface Props {
  currentPath: string;
}
const { currentPath } = Astro.props;
---
<nav>nav stub</nav>
```

- [ ] **Step 3: Update index.astro to use the layout**

Replace `src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="Home">
  <h1>layout works</h1>
</Base>
```

- [ ] **Step 4: Verify the build**

```bash
npx astro build
```

Expected: Build succeeds. `dist/index.html` includes the meta tags, font imports, grid background.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro src/components/Nav.astro src/pages/index.astro
git commit -m "layout: add Base.astro with meta tags, view transitions, and page shell"
```

---

### Task 4: Navigation Component

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Implement Nav.astro**

Replace `src/components/Nav.astro`:

```astro
---
// src/components/Nav.astro
interface Props {
  currentPath: string;
}

const { currentPath } = Astro.props;

const links = [
  { href: '/about', label: 'about' },
  { href: '/writing', label: 'writing' },
  { href: '/links', label: 'links' },
];

function isActive(href: string, current: string): boolean {
  if (href === '/') return current === '/';
  return current.startsWith(href);
}
---

<header class="nav" transition:name="site-nav" transition:persist>
  <a href="/" class="mark">
    <span class="mark-name">justin</span><span class="mark-dot">.</span><span class="mark-tld">software</span>
  </a>
  <nav class="links">
    {links.map(link => (
      <a
        href={link.href}
        class:list={['nav-link', { active: isActive(link.href, currentPath) }]}
      >
        <span class="slash">/</span>{link.label}
      </a>
    ))}
  </nav>
</header>

<style>
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .mark {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.3px;
    text-decoration: none;
  }

  .mark-name {
    color: var(--text);
  }

  .mark-dot {
    color: #2a2a2a;
  }

  .mark-tld {
    color: var(--text-muted);
  }

  .links {
    display: flex;
    gap: 24px;
    font-family: var(--font-mono);
    font-size: 13px;
  }

  .nav-link {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s;
  }

  .nav-link:hover {
    color: var(--text-secondary);
  }

  .nav-link.active {
    color: var(--text-secondary);
  }

  .slash {
    color: var(--text-tertiary);
  }

  @media (max-width: 640px) {
    .links {
      gap: 16px;
      font-size: 12px;
    }
  }
</style>
```

- [ ] **Step 2: Verify in dev server**

```bash
npx astro dev &
sleep 2
curl -s http://localhost:4321 | grep 'mark-name'
kill %1
```

Expected: Output contains `<span class="mark-name">justin</span>`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "component: implement Nav with mark and path-style navigation"
```

---

### Task 5: Content Collection Schema + Seed Post

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/writing/hello-world.md`

- [ ] **Step 1: Create the content collection config**

```typescript
// src/content/config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
  }),
});

export const collections = { writing };
```

- [ ] **Step 2: Create a seed blog post**

```markdown
---
title: "Systems that compose"
date: 2026-04-10
description: "On building infrastructure that holds."
---

The best systems are the ones you forget are there. They compose so naturally that the boundary between one system and the next dissolves — what remains is just the thing you were trying to build.

This is a seed post. It exists to prove the pipeline works: markdown in, HTML out, git as the CMS.

## What composition means

A composable system has three properties:

1. **Clear interfaces** — you can describe what it does without describing how
2. **No hidden state** — the output is a function of the input, nothing else
3. **Graceful failure** — when it breaks, it breaks at the seam, not in the middle

## Why it matters

Every abstraction is a bet that the boundary you drew will hold. Good abstractions pay dividends for years. Bad ones collect interest.

The goal isn't to write code that's clever. It's to write code that's **obvious** — so obvious that the next person (or the next agent) can pick it up and extend it without reading the implementation.

```javascript
// The interface is the contract.
// The implementation is a detail.
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
```

Build systems that compose. Everything else follows.
```

- [ ] **Step 3: Verify the collection resolves**

```bash
npx astro build
```

Expected: Build succeeds with no content collection errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts src/content/writing/hello-world.md
git commit -m "content: add writing collection schema and seed post"
```

---

### Task 6: PostList Component

**Files:**
- Create: `src/components/PostList.astro`

- [ ] **Step 1: Create PostList.astro**

```astro
---
// src/components/PostList.astro
interface Post {
  id: string;
  data: {
    title: string;
    date: Date;
  };
}

interface Props {
  posts: Post[];
  limit?: number;
}

const { posts, limit } = Astro.props;

const sorted = posts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, limit);

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}.${m}`;
}
---

<ul class="post-list" role="list">
  {sorted.map(post => (
    <li class="post-row">
      <a href={`/writing/${post.id}`} class="post-link" data-post-id={post.id}>
        <span class="post-title">{post.data.title}</span>
        <span class="post-date mono-date">{formatDate(post.data.date)}</span>
      </a>
    </li>
  ))}
</ul>

<style>
  .post-list {
    list-style: none;
  }

  .post-row {
    border-bottom: 1px solid var(--border);
  }

  .post-row:first-child {
    border-top: 1px solid var(--border);
  }

  .post-link {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 12px 0;
    text-decoration: none;
    transition: color 0.15s;
  }

  .post-title {
    font-size: 14px;
    color: var(--text-link);
  }

  .post-link:hover .post-title {
    color: var(--text);
  }

  .post-link[data-selected] .post-title {
    color: var(--text);
  }

  .post-link[data-selected] {
    background: rgba(255, 255, 255, 0.03);
    margin: 0 -8px;
    padding: 12px 8px;
    border-radius: 4px;
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
npx astro build
```

Expected: Build succeeds (component isn't used yet, but should compile cleanly).

- [ ] **Step 3: Commit**

```bash
git add src/components/PostList.astro
git commit -m "component: add PostList with chronological rows and keyboard selection support"
```

---

### Task 7: Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Implement the homepage**

Replace `src/pages/index.astro`:

```astro
---
// src/pages/index.astro
import Base from '../layouts/Base.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('writing');
const sorted = posts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 2);

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}.${m}`;
}
---

<Base title="Home">
  <section class="hero">
    <p class="mono-label">Principal Engineer · Webflow</p>
    <h1 class="name">Justin Helmer</h1>
    <p class="bio">I design systems that compose, build infrastructure that holds, and write about both.</p>
  </section>

  <section class="latest">
    <p class="mono-label latest-label">Latest</p>
    <div class="latest-grid">
      {sorted.map(post => (
        <a href={`/writing/${post.id}`} class="latest-item">
          <span class="latest-title">{post.data.title}</span>
          <span class="mono-date">{formatDate(post.data.date)}</span>
        </a>
      ))}
    </div>
  </section>
</Base>

<style>
  .hero {
    margin-bottom: 48px;
  }

  .name {
    font-size: 44px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.05;
    letter-spacing: -2px;
    margin: 16px 0 20px;
  }

  .bio {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.8;
    max-width: 500px;
  }

  .latest {
    border-top: 1px solid var(--border);
    padding-top: 24px;
  }

  .latest-label {
    margin-bottom: 16px;
    font-size: 10px;
    letter-spacing: 2px;
  }

  .latest-grid {
    display: flex;
    gap: 40px;
  }

  .latest-item {
    flex: 1;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: color 0.15s;
  }

  .latest-title {
    font-size: 14px;
    color: var(--text-link);
  }

  .latest-item:hover .latest-title {
    color: var(--text);
  }

  @media (max-width: 640px) {
    .name {
      font-size: 32px;
      letter-spacing: -1px;
    }

    .latest-grid {
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
```

- [ ] **Step 2: Verify in dev server**

```bash
npx astro dev &
sleep 2
curl -s http://localhost:4321 | grep 'Justin Helmer'
kill %1
```

Expected: Output contains the name heading.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "page: implement homepage with hero section and latest posts"
```

---

### Task 8: Writing Index Page

**Files:**
- Create: `src/pages/writing/index.astro`

- [ ] **Step 1: Create the writing index**

```astro
---
// src/pages/writing/index.astro
import Base from '../../layouts/Base.astro';
import PostList from '../../components/PostList.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('writing');
---

<Base title="Writing" description="Technical writing on systems, infrastructure, and engineering.">
  <h1 class="page-heading">Writing</h1>
  <PostList posts={posts} />
</Base>

<style>
  .page-heading {
    font-size: 44px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.05;
    letter-spacing: -2px;
    margin-bottom: 48px;
  }
</style>
```

- [ ] **Step 2: Verify the page builds and lists the seed post**

```bash
npx astro build && cat dist/writing/index.html | grep 'Systems that compose'
```

Expected: Output contains the seed post title.

- [ ] **Step 3: Commit**

```bash
git add src/pages/writing/index.astro
git commit -m "page: add writing index with PostList"
```

---

### Task 9: Individual Post Page

**Files:**
- Create: `src/pages/writing/[...slug].astro`

- [ ] **Step 1: Create the dynamic post route**

```astro
---
// src/pages/writing/[...slug].astro
import Base from '../../layouts/Base.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('writing');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}.${m}`;
}
---

<Base title={post.data.title} description={post.data.description}>
  <article>
    <header class="post-header">
      <h1 class="post-title">{post.data.title}</h1>
      <p class="mono-date">{formatDate(post.data.date)}</p>
    </header>
    <div class="prose">
      <Content />
    </div>
    <footer class="post-footer">
      <a href="/writing" class="back-link">← Writing</a>
    </footer>
  </article>
</Base>

<style>
  .post-header {
    margin-bottom: 48px;
  }

  .post-title {
    font-size: 44px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.1;
    letter-spacing: -2px;
    margin-bottom: 8px;
  }

  .post-footer {
    margin-top: 64px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
  }

  .back-link {
    font-size: 14px;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s;
  }

  .back-link:hover {
    color: var(--text-secondary);
  }

  @media (max-width: 640px) {
    .post-title {
      font-size: 28px;
      letter-spacing: -1px;
    }
  }
</style>
```

- [ ] **Step 2: Verify the post renders**

```bash
npx astro build && ls dist/writing/hello-world/index.html
```

Expected: File exists. The seed post compiled to a full HTML page.

- [ ] **Step 3: Verify the rendered content includes the code block**

```bash
cat dist/writing/hello-world/index.html | grep 'compose(...fns)'
```

Expected: The code example from the seed post is present in the output.

- [ ] **Step 4: Commit**

```bash
git add src/pages/writing/
git commit -m "page: add individual post rendering with prose styles"
```

---

### Task 10: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create about.astro**

```astro
---
// src/pages/about.astro
import Base from '../layouts/Base.astro';
---

<Base title="About" description="Justin Helmer — Principal Engineer at Webflow.">
  <h1 class="page-heading">About</h1>
  <div class="about-text">
    <p>I'm Justin Helmer, a Principal Engineer at Webflow based in the San Francisco Bay Area. I design and build the systems that power complex products — infrastructure, developer tooling, and the primitives that other engineers build on top of.</p>
    <p>I've spent 17 years turning complexity into clarity. The work I care about most is the kind you stop noticing because it just holds.</p>
  </div>
</Base>

<style>
  .page-heading {
    font-size: 44px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.05;
    letter-spacing: -2px;
    margin-bottom: 32px;
  }

  .about-text {
    max-width: 560px;
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.8;
  }

  .about-text p + p {
    margin-top: 1.5em;
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
npx astro build && ls dist/about/index.html
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "page: add About with positioning statement"
```

---

### Task 11: Links Page

**Files:**
- Create: `src/pages/links.astro`

- [ ] **Step 1: Create links.astro**

```astro
---
// src/pages/links.astro
import Base from '../layouts/Base.astro';

const links = [
  { label: 'GitHub', value: 'justinhelmer', href: 'https://github.com/justinhelmer' },
  { label: 'LinkedIn', value: '/in/justinhelmer', href: 'https://www.linkedin.com/in/justinhelmer' },
  { label: 'Email', value: 'hello@justin.software', href: 'mailto:hello@justin.software' },
];
---

<Base title="Links" description="Where to find Justin Helmer online.">
  <h1 class="page-heading">Links</h1>
  <ul class="link-list" role="list">
    {links.map(link => (
      <li class="link-row">
        <a href={link.href} class="link-item" target="_blank" rel="noopener noreferrer">
          <span class="link-label">{link.label}</span>
          <span class="link-value">{link.value}</span>
        </a>
      </li>
    ))}
  </ul>
</Base>

<style>
  .page-heading {
    font-size: 44px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.05;
    letter-spacing: -2px;
    margin-bottom: 48px;
  }

  .link-list {
    list-style: none;
  }

  .link-row {
    border-bottom: 1px solid var(--border);
  }

  .link-row:first-child {
    border-top: 1px solid var(--border);
  }

  .link-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 12px 0;
    text-decoration: none;
    transition: color 0.15s;
  }

  .link-label {
    font-size: 14px;
    color: var(--text-link);
  }

  .link-value {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-tertiary);
  }

  .link-item:hover .link-label {
    color: var(--text);
  }

  .link-item:hover .link-value {
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
npx astro build && cat dist/links/index.html | grep 'justinhelmer'
```

Expected: Output contains GitHub and LinkedIn handles.

- [ ] **Step 3: Commit**

```bash
git add src/pages/links.astro
git commit -m "page: add Links with GitHub, LinkedIn, and email"
```

---

### Task 12: Shell Palette (Command Layer)

**Files:**
- Create: `src/components/ShellPalette.astro`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Create ShellPalette.astro**

```astro
---
// src/components/ShellPalette.astro
// Receives all navigable routes as JSON for client-side fuzzy matching.
import { getCollection } from 'astro:content';

const posts = await getCollection('writing');
const routes = [
  { path: '/', label: 'home', type: 'page' },
  { path: '/about', label: 'about', type: 'page' },
  { path: '/writing', label: 'writing', type: 'page' },
  { path: '/links', label: 'links', type: 'page' },
  ...posts.map(p => ({
    path: `/writing/${p.id}`,
    label: p.data.title.toLowerCase(),
    type: 'post',
  })),
];
---

<div id="shell-palette" class="palette-overlay" aria-hidden="true">
  <div class="palette-backdrop"></div>
  <div class="palette-container">
    <div class="palette-input-row">
      <span class="palette-path">~/justin.software</span>
      <span class="palette-prompt">$</span>
      <span class="palette-prefix">cd </span>
      <input
        id="palette-input"
        class="palette-input"
        type="text"
        autocomplete="off"
        spellcheck="false"
      />
    </div>
    <div id="palette-completions" class="palette-completions"></div>
    <div class="palette-hint">
      tab complete · enter navigate · esc close
    </div>
  </div>
</div>

<script define:vars={{ routes }}>
  const palette = document.getElementById('shell-palette');
  const input = document.getElementById('palette-input');
  const completionsEl = document.getElementById('palette-completions');
  let isOpen = false;
  let activeIndex = 0;
  let filtered = [];

  function open() {
    isOpen = true;
    palette.setAttribute('aria-hidden', 'false');
    input.value = '';
    activeIndex = 0;
    updateCompletions('');
    input.focus();
  }

  function close() {
    isOpen = false;
    palette.setAttribute('aria-hidden', 'true');
    input.value = '';
    input.blur();
  }

  function navigate(path) {
    close();
    window.location.href = path;
  }

  function fuzzyMatch(query, label) {
    if (!query) return true;
    const q = query.toLowerCase();
    const l = label.toLowerCase();
    let qi = 0;
    for (let li = 0; li < l.length && qi < q.length; li++) {
      if (l[li] === q[qi]) qi++;
    }
    return qi === q.length;
  }

  function updateCompletions(query) {
    filtered = routes.filter(r => fuzzyMatch(query, r.label));
    activeIndex = Math.min(activeIndex, Math.max(0, filtered.length - 1));

    completionsEl.innerHTML = filtered.map((r, i) => {
      const isActive = i === activeIndex;
      const display = r.type === 'page' ? r.label + '/' : r.label;
      const pathDisplay = r.path === '/' ? '~' : r.path;
      return `<div class="completion${isActive ? ' active' : ''}" data-index="${i}" data-path="${r.path}">
        <span class="completion-label">${display}</span>
        <span class="completion-path">${pathDisplay}</span>
      </div>`;
    }).join('');
  }

  input?.addEventListener('input', () => {
    activeIndex = 0;
    updateCompletions(input.value);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      isOpen ? close() : open();
      return;
    }

    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (filtered.length > 0) {
        activeIndex = (activeIndex + (e.shiftKey ? -1 : 1) + filtered.length) % filtered.length;
        updateCompletions(input.value);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length > 0) {
        activeIndex = (activeIndex + 1) % filtered.length;
        updateCompletions(input.value);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length > 0) {
        activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
        updateCompletions(input.value);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) {
        navigate(filtered[activeIndex].path);
      }
    }
  });

  completionsEl?.addEventListener('click', (e) => {
    const item = e.target.closest('.completion');
    if (item) {
      navigate(item.dataset.path);
    }
  });

  palette?.querySelector('.palette-backdrop')?.addEventListener('click', close);

  // Re-initialize on view transition
  document.addEventListener('astro:page-load', () => {
    isOpen = false;
    palette?.setAttribute('aria-hidden', 'true');
  });
</script>

<style>
  .palette-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    transition: opacity 0.15s, visibility 0.15s;
  }

  .palette-overlay[aria-hidden='true'] {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .palette-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
  }

  .palette-container {
    position: relative;
    background: var(--surface);
    border-top: 1px solid var(--border);
    transform: translateY(0);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .palette-overlay[aria-hidden='true'] .palette-container {
    transform: translateY(100%);
  }

  .palette-input-row {
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--border);
    font-family: var(--font-mono);
    font-size: 13px;
  }

  .palette-path {
    color: var(--text-muted);
  }

  .palette-prompt {
    color: var(--text-secondary);
  }

  .palette-prefix {
    color: var(--text-link);
  }

  .palette-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text-link);
    font-family: var(--font-mono);
    font-size: 13px;
    caret-color: var(--text-secondary);
  }

  .palette-completions {
    padding: 8px 20px;
    font-family: var(--font-mono);
    font-size: 13px;
    max-height: 240px;
    overflow-y: auto;
  }

  .completion {
    padding: 6px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 3px;
    cursor: pointer;
  }

  .completion.active {
    background: rgba(255, 255, 255, 0.05);
  }

  .completion:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .completion-label {
    color: var(--text-link);
  }

  .completion.active .completion-label {
    color: var(--text);
  }

  .completion-path {
    color: var(--text-tertiary);
    font-size: 11px;
  }

  .palette-hint {
    padding: 6px 20px 10px;
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    border-top: 1px solid var(--border);
  }
</style>
```

- [ ] **Step 2: Add ShellPalette to Base.astro**

In `src/layouts/Base.astro`, add the import and component. Add after the `Nav` import:

```astro
import ShellPalette from '../components/ShellPalette.astro';
```

Add after the closing `</main>` tag, before the closing `</div>`:

```astro
      <ShellPalette />
```

- [ ] **Step 3: Verify the palette renders**

```bash
npx astro build && grep 'shell-palette' dist/index.html
```

Expected: Output contains the palette element ID.

- [ ] **Step 4: Commit**

```bash
git add src/components/ShellPalette.astro src/layouts/Base.astro
git commit -m "feature: add shell-style command palette with fuzzy search and tab completion"
```

---

### Task 13: Keyboard Navigation

**Files:**
- Create: `src/components/KeyboardNav.astro`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Create KeyboardNav.astro**

```astro
---
// src/components/KeyboardNav.astro
// Vim-style keyboard navigation: g+key chords, j/k list navigation
---

<script>
  let gPending = false;
  let gTimer: ReturnType<typeof setTimeout> | null = null;

  const gotoMap: Record<string, string> = {
    h: '/',
    a: '/about',
    w: '/writing',
    l: '/links',
  };

  function getPostLinks(): HTMLAnchorElement[] {
    return Array.from(document.querySelectorAll('.post-link, .link-item'));
  }

  function getSelectedIndex(links: HTMLAnchorElement[]): number {
    return links.findIndex(el => el.hasAttribute('data-selected'));
  }

  function selectLink(links: HTMLAnchorElement[], index: number) {
    links.forEach(el => el.removeAttribute('data-selected'));
    if (index >= 0 && index < links.length) {
      links[index].setAttribute('data-selected', '');
      links[index].scrollIntoView({ block: 'nearest' });
    }
  }

  function clearSelection(links: HTMLAnchorElement[]) {
    links.forEach(el => el.removeAttribute('data-selected'));
  }

  function isInputFocused(): boolean {
    const el = document.activeElement;
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
  }

  function isPaletteOpen(): boolean {
    const palette = document.getElementById('shell-palette');
    return palette?.getAttribute('aria-hidden') === 'false';
  }

  document.addEventListener('keydown', (e) => {
    if (isInputFocused() || isPaletteOpen()) return;

    const links = getPostLinks();
    const current = getSelectedIndex(links);

    // g + key chord
    if (gPending) {
      gPending = false;
      if (gTimer) clearTimeout(gTimer);
      const target = gotoMap[e.key];
      if (target) {
        e.preventDefault();
        window.location.href = target;
      }
      return;
    }

    if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
      gPending = true;
      gTimer = setTimeout(() => { gPending = false; }, 500);
      return;
    }

    // j/k navigation
    if (e.key === 'j' && links.length > 0) {
      e.preventDefault();
      const next = current < links.length - 1 ? current + 1 : 0;
      selectLink(links, next);
      return;
    }

    if (e.key === 'k' && links.length > 0) {
      e.preventDefault();
      const prev = current > 0 ? current - 1 : links.length - 1;
      selectLink(links, prev);
      return;
    }

    // Enter to follow selected link
    if (e.key === 'Enter' && current >= 0) {
      e.preventDefault();
      links[current].click();
      return;
    }

    // Escape to deselect
    if (e.key === 'Escape') {
      clearSelection(links);
      return;
    }
  });

  // Reset on view transition
  document.addEventListener('astro:page-load', () => {
    gPending = false;
    if (gTimer) clearTimeout(gTimer);
  });
</script>
```

- [ ] **Step 2: Add KeyboardNav to Base.astro**

In `src/layouts/Base.astro`, add the import:

```astro
import KeyboardNav from '../components/KeyboardNav.astro';
```

Add after `<ShellPalette />`:

```astro
      <KeyboardNav />
```

- [ ] **Step 3: Verify build**

```bash
npx astro build && grep 'gotoMap' dist/index.html
```

Expected: Output contains the keyboard navigation script.

- [ ] **Step 4: Commit**

```bash
git add src/components/KeyboardNav.astro src/layouts/Base.astro
git commit -m "feature: add vim-style keyboard navigation with g+key chords and j/k selection"
```

---

### Task 14: Help Overlay

**Files:**
- Create: `src/components/HelpOverlay.astro`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Create HelpOverlay.astro**

```astro
---
// src/components/HelpOverlay.astro
---

<div id="help-overlay" class="help-overlay" aria-hidden="true">
  <div class="help-panel">
    <div class="help-header">
      <span class="help-title">Keyboard shortcuts</span>
      <span class="help-close">esc to close</span>
    </div>
    <div class="help-section">
      <div class="help-group-title">Navigation</div>
      <div class="help-row"><kbd>⌘K</kbd><span>Open command palette</span></div>
      <div class="help-row"><kbd>g h</kbd><span>Go home</span></div>
      <div class="help-row"><kbd>g a</kbd><span>Go to about</span></div>
      <div class="help-row"><kbd>g w</kbd><span>Go to writing</span></div>
      <div class="help-row"><kbd>g l</kbd><span>Go to links</span></div>
    </div>
    <div class="help-section">
      <div class="help-group-title">Lists</div>
      <div class="help-row"><kbd>j</kbd> / <kbd>k</kbd><span>Move down / up</span></div>
      <div class="help-row"><kbd>Enter</kbd><span>Open selected</span></div>
      <div class="help-row"><kbd>Esc</kbd><span>Clear selection</span></div>
    </div>
    <div class="help-section">
      <div class="help-group-title">Meta</div>
      <div class="help-row"><kbd>?</kbd><span>Toggle this help</span></div>
    </div>
  </div>
</div>

<script>
  const overlay = document.getElementById('help-overlay');

  function isInputFocused(): boolean {
    const el = document.activeElement;
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
  }

  function isPaletteOpen(): boolean {
    const palette = document.getElementById('shell-palette');
    return palette?.getAttribute('aria-hidden') === 'false';
  }

  function toggle() {
    const hidden = overlay?.getAttribute('aria-hidden') === 'true';
    overlay?.setAttribute('aria-hidden', hidden ? 'false' : 'true');
  }

  function close() {
    overlay?.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('keydown', (e) => {
    if (isInputFocused() || isPaletteOpen()) return;

    if (e.key === '?') {
      e.preventDefault();
      toggle();
      return;
    }

    // Close on Escape if help is open
    if (e.key === 'Escape' && overlay?.getAttribute('aria-hidden') === 'false') {
      e.preventDefault();
      close();
      return;
    }
  });

  // Close on navigation
  document.addEventListener('astro:before-preparation', close);
</script>

<style>
  .help-overlay {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 90;
    transition: opacity 0.15s, visibility 0.15s, transform 0.15s;
  }

  .help-overlay[aria-hidden='true'] {
    opacity: 0;
    visibility: hidden;
    transform: translateY(8px);
    pointer-events: none;
  }

  .help-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    min-width: 260px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .help-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  .help-title {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .help-close {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-tertiary);
  }

  .help-section + .help-section {
    margin-top: 12px;
  }

  .help-group-title {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-tertiary);
    margin-bottom: 6px;
  }

  .help-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 0;
    font-size: 12px;
    color: var(--text-muted);
  }

  .help-row span {
    color: var(--text-secondary);
  }

  kbd {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.05);
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid var(--border);
  }

  @media (max-width: 640px) {
    .help-overlay {
      bottom: 12px;
      right: 12px;
      left: 12px;
    }
  }
</style>
```

- [ ] **Step 2: Add HelpOverlay to Base.astro**

In `src/layouts/Base.astro`, add the import:

```astro
import HelpOverlay from '../components/HelpOverlay.astro';
```

Add after `<KeyboardNav />`:

```astro
      <HelpOverlay />
```

- [ ] **Step 3: Verify build**

```bash
npx astro build && grep 'help-overlay' dist/index.html
```

Expected: Output contains the help overlay element.

- [ ] **Step 4: Commit**

```bash
git add src/components/HelpOverlay.astro src/layouts/Base.astro
git commit -m "feature: add ? keybinding help overlay"
```

---

### Task 15: RSS Feed

**Files:**
- Create: `src/pages/feed.xml.ts`

- [ ] **Step 1: Create the RSS feed endpoint**

```typescript
// src/pages/feed.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('writing');
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'justin.software',
    description: 'Writing by Justin Helmer — systems, infrastructure, engineering.',
    site: context.site!,
    items: sorted.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/writing/${post.id}/`,
    })),
  });
}
```

- [ ] **Step 2: Verify the feed builds**

```bash
npx astro build && cat dist/feed.xml | head -10
```

Expected: Valid XML with `<rss>` root element and the seed post entry.

- [ ] **Step 3: Commit**

```bash
git add src/pages/feed.xml.ts
git commit -m "feature: add RSS feed at /feed.xml"
```

---

### Task 16: Final Polish — Robots, Meta, Responsive

**Files:**
- Create: `src/pages/robots.txt.ts`

- [ ] **Step 1: Create robots.txt**

```typescript
// src/pages/robots.txt.ts
import type { APIContext } from 'astro';

export function GET(context: APIContext) {
  const sitemap = new URL('/sitemap-index.xml', context.site);
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemap.href}
`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
}
```

- [ ] **Step 2: Full build and verify all pages exist**

```bash
npx astro build && echo "---" && \
ls dist/index.html && \
ls dist/about/index.html && \
ls dist/writing/index.html && \
ls dist/writing/hello-world/index.html && \
ls dist/links/index.html && \
ls dist/feed.xml && \
ls dist/robots.txt && \
ls dist/sitemap-index.xml
```

Expected: All 8 files exist.

- [ ] **Step 3: Verify meta tags on homepage**

```bash
grep -E '(og:title|og:description|canonical|description)' dist/index.html
```

Expected: Open Graph and meta description tags are present.

- [ ] **Step 4: Commit**

```bash
git add src/pages/robots.txt.ts
git commit -m "seo: add robots.txt with sitemap reference"
```

---

### Task 17: Cloudflare Pages Deployment

**Files:**
- No new files — this is configuration

- [ ] **Step 1: Create GitHub repository**

```bash
cd /Users/justin/projects/justin-software
gh repo create justinhelmer/justin-software --private --source=. --push
```

- [ ] **Step 2: Set up Cloudflare Pages**

This step is done in the Cloudflare dashboard (or via wrangler CLI):

1. Go to Cloudflare Dashboard → Workers & Pages → Create
2. Connect the `justinhelmer/justin-software` GitHub repo
3. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy

- [ ] **Step 3: Add custom domain**

In Cloudflare Pages project settings → Custom domains:

1. Add `justin.software`
2. Cloudflare will provide a CNAME target (e.g., `justin-software.pages.dev`)
3. In Namecheap DNS, add a CNAME record:
   - Host: `@`
   - Value: `justin-software.pages.dev`
   - Or transfer nameservers to Cloudflare for automatic SSL

- [ ] **Step 4: Verify the site is live**

```bash
curl -s -o /dev/null -w "%{http_code}" https://justin.software
```

Expected: `200`

- [ ] **Step 5: Commit any deployment-related changes**

```bash
git add -A && git status
# Only commit if there are changes (e.g., wrangler.toml if created)
```

---

## Task Dependency Order

```
Task 1 (scaffold) → Task 2 (styles) → Task 3 (layout) → Task 4 (nav)
                                                              ↓
Task 5 (content schema) → Task 6 (PostList) → Task 7 (homepage)
                                                    ↓
                                Task 8 (writing index) → Task 9 (post page)
                                                              ↓
                              Task 10 (about) ← independent after Task 3
                              Task 11 (links) ← independent after Task 3
                                                              ↓
Task 12 (shell palette) → Task 13 (keyboard nav) → Task 14 (help overlay)
                                                              ↓
                                    Task 15 (RSS) ← independent after Task 5
                                    Task 16 (polish) ← after all pages
                                                              ↓
                                              Task 17 (deploy) ← last
```

**Parallelizable groups:**
- After Task 4 completes: Tasks 5+10+11 can run in parallel
- After Task 6 completes: Tasks 7+15 can run in parallel
- After Task 9 completes: Tasks 12+16 can start (12 needs post list for palette routes)
