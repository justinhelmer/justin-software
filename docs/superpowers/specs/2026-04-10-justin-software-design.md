# justin.software — Design Specification

## Overview

A professional personal website for Justin Helmer, Principal Engineer at Webflow. The site is a platform for writing and ideas, built to feel like a piece of well-designed software. It leans into the `.software` TLD — every detail communicates engineering precision.

### Audience (priority order)

1. **Broader tech community** — blog readers, conference attendees, OSS users
2. **Peers / senior engineers** — people who think at the same level
3. **Recruiters / hiring managers** — they benefit from what's already there

### Design Principles

- **Confident and architectural** — clean lines, subtle structure, engineering precision
- **Static by default, interactive by intent** — no unnecessary JS, but the architecture welcomes it
- **The site is the proof** — every detail should feel engineered
- **Git is the steel beam** — markdown in the repo, commit to publish, AI-friendly toolchain

---

## Visual Identity

### Mark

`justin` in #f0f0f0, `.` in #2a2a2a, `software` in #444. The TLD is a design element — the dot is nearly invisible, making "justin" the dominant mark and ".software" the quiet descriptor.

### Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0c0c0c` | Page background |
| `--text` | `#f5f5f5` | Primary text (name, headings) |
| `--text-secondary` | `#666` | Body copy, descriptions |
| `--text-tertiary` | `#333` | Labels, dates, slashes |
| `--text-muted` | `#444` | Nav items, dimmed elements |
| `--text-link` | `#bbb` | Post titles, clickable items |
| `--border` | `#1a1a1a` | Dividers, section separators |
| `--surface` | `#161616` | Elevated elements (palette) |
| `--grid` | `rgba(255,255,255,0.025)` | Background grid lines |

No accent color. Confidence is monochrome.

### Typography

| Role | Font | Fallback |
|------|------|----------|
| Body | Inter | -apple-system, sans-serif |
| Code / Labels | SF Mono | Fira Code, monospace |

Two fonts, two roles. Inter for reading. Monospace for structure (dates, nav slashes, role labels, the command palette).

### Grid Background

Subtle 40px engineering grid on every page. Achieved via CSS `background-image` with two linear-gradient lines at ~2.5% white opacity. Present on all pages — it's part of the identity, not a decoration.

### Navigation

Path-style monospace nav, right-aligned:

```
/about  /writing  /links
```

Slashes in `--text-tertiary`, words in `--text-muted`. Active page indicated by brighter text (`--text-secondary`). Persistent on every page in the base layout.

---

## Pages

### Homepage (`/`)

Top-to-bottom vertical flow:

1. **Header bar** — mark left, nav right
2. **Role label** — `PRINCIPAL ENGINEER · WEBFLOW` in 11px monospace caps, `--text-tertiary`, letter-spacing 3px
3. **Name** — "Justin Helmer" at 44px, font-weight 600, letter-spacing -2px, `--text`
4. **Bio** — "I design systems that compose, build infrastructure that holds, and write about both." at 16px, `--text-secondary`, line-height 1.8, max-width 500px
5. **Latest posts** — separated by a `--border` top divider. "LATEST" label in 10px monospace caps. Two-column layout: each column shows post title in `--text-link` and date in monospace `--text-tertiary` format `YYYY.MM`

The homepage is the front door. It says who you are in under 3 seconds and surfaces the freshest thinking.

### About (`/about`)

Same layout shell as homepage (header, grid). Content is:

1. **Page heading** — "About" in the same 44px style as the homepage name
2. **Three sentences** — who you are, what you do, what drives you. At 16px, `--text-secondary`, line-height 1.8, max-width 560px

No photo. No resume. No extras. The restraint is the point.

### Writing (`/writing`)

Blog index page:

1. **Page heading** — "Writing" in the same 44px heading style
2. **Post list** — flat chronological (newest first). Each row:
   - Post title on the left in `--text-link`, 14px
   - Date on the right in monospace `--text-tertiary`, `YYYY.MM`
   - Hairline `--border` divider between rows
   - Rows are clickable — entire row is the link target

No descriptions, no tags, no categories. The title does the work.

### Individual Post (`/writing/[slug]`)

1. **Post header** — title in the 44px heading style, date in monospace below it
2. **Post body** — rendered markdown. Prose styling:
   - Max-width 640px for comfortable reading
   - `--text-secondary` for body, `--text` for headings
   - Code blocks with `--surface` background, monospace font
   - Links in `--text-link`
   - Generous line-height (1.8) and paragraph spacing
3. **Back link** — subtle "← Writing" link at the bottom to return to the index

### Links (`/links`)

1. **Page heading** — "Links" in the same 44px heading style
2. **Link list** — GitHub, LinkedIn, email. Same row treatment as the writing index:
   - Label on the left
   - URL or handle on the right in monospace
   - Hairline dividers

---

## Command Layer

The interactive system that makes the site feel like software. This is the JS that ships — intentionally, for a specific purpose.

### Shell Palette (`Cmd+K` / `Ctrl+K`)

Bottom-anchored terminal overlay. Opens with a slide-up animation.

**Visual:**
- `--surface` background (`#161616`), `--border` top edge
- Fake prompt: `~/justin.software $ cd _` in monospace
- Tab-completion results appear as inline options: `about/  writing/  links/`
- Active completion highlighted with `--surface` background
- Footer hint: `tab complete · enter navigate · esc close`

**Behavior:**
- Typing filters completions (fuzzy match against page names and post titles)
- `cd writing/` shows post slugs as sub-completions
- `cd ../` navigates up one level
- `Tab` cycles through completions
- `Enter` navigates to the selected completion
- `Esc` closes the palette
- Overlay dims the page behind (rgba(0,0,0,0.7))

### Vim-Style Quick Navigation

Available on all pages when no input is focused:

| Key | Action |
|-----|--------|
| `g h` | Navigate to `/` (home) |
| `g a` | Navigate to `/about` |
| `g w` | Navigate to `/writing` |
| `g l` | Navigate to `/links` |
| `j` / `k` | Move selection up/down in post lists |
| `Enter` | Open selected post |
| `Esc` | Clear selection |
| `?` | Toggle keybinding help overlay |

The `g` prefix is a chord — press `g`, then within 500ms press the second key. If no second key arrives, the chord resets silently.

### Help Overlay (`?`)

A small floating panel showing all available keybindings. Same visual language as the palette — `--surface` background, monospace text, keycap badges. Toggles on `?`, closes on `Esc` or any navigation action.

### Page Transitions

Astro View Transitions API:

- **Shared elements:** Nav bar and grid background persist across page transitions (no flash, no re-render)
- **Content transition:** Crossfade with a 150-200ms duration
- **Feel:** Like switching buffers in an editor — the chrome stays, the content swaps

---

## Technical Architecture

### Framework

**Astro** — content-first static site generator. Ships zero JS by default; interactive components opt in via client directives.

### Content Collections

Blog posts live in `src/content/writing/` as markdown files:

```markdown
---
title: "On agent harness architecture"
date: 2026-04-10
description: "A one-line description for meta tags and RSS"
---

Post body in markdown.
```

Schema validated via `src/content/config.ts` using Astro's content collection API with Zod.

### File Structure

```
justin-software/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── src/
│   ├── layouts/
│   │   └── Base.astro              # HTML shell, head, meta, grid, nav, footer
│   ├── components/
│   │   ├── Nav.astro               # Mark + path-style navigation
│   │   ├── PostList.astro          # Reusable post row list (used on / and /writing)
│   │   ├── ShellPalette.astro      # Command palette (client:idle)
│   │   ├── KeyboardNav.astro       # Vim keybindings handler (client:idle)
│   │   └── HelpOverlay.astro       # ? keybinding help panel (client:idle)
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── about.astro             # About
│   │   ├── writing/
│   │   │   ├── index.astro         # Blog index
│   │   │   └── [...slug].astro     # Individual post pages
│   │   └── links.astro             # Links
│   ├── content/
│   │   ├── config.ts               # Content collection schema
│   │   └── writing/                # Markdown blog posts
│   │       └── .gitkeep
│   └── styles/
│       └── global.css              # Reset, tokens, grid, base typography
├── public/
│   └── fonts/                      # Self-hosted Inter + SF Mono/Fira Code
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-10-justin-software-design.md
```

### Styling

Scoped CSS in `.astro` components plus a global stylesheet for tokens and reset. No Tailwind, no CSS framework. The design is precise enough that raw CSS is cleaner and more intentional.

### Deployment

**Cloudflare Pages:**
- Connected to the GitHub repo
- Builds on push to `main`
- Build command: `npm run build`
- Output directory: `dist/`
- Custom domain: `justin.software`

**DNS (Namecheap):**
- CNAME record: `justin.software` → `<project>.pages.dev`
- Or use Cloudflare as DNS provider (recommended — transfer nameservers for automatic SSL and caching)

### SEO / Meta

Each page includes:
- `<title>` — page-specific (e.g., "About | justin.software", "On agent harness architecture | justin.software")
- `<meta name="description">` — page-specific
- Open Graph tags (`og:title`, `og:description`, `og:type`)
- Canonical URL
- RSS feed at `/feed.xml` (Astro has a built-in RSS plugin)
- `sitemap.xml` (Astro has a built-in sitemap plugin)

### Performance Targets

- Lighthouse: 100 across the board (achievable with static Astro + Cloudflare)
- First Contentful Paint: < 500ms
- Total page weight: < 50KB (excluding fonts)
- Fonts: self-hosted, subset to Latin, preloaded

---

## What's Explicitly Excluded

- No projects/portfolio page
- No resume/CV page
- No analytics (can add later — Cloudflare has built-in, or Plausible)
- No dark/light toggle — it's dark, period
- No hamburger menu, no mobile drawer — the nav is three words, it fits everywhere
- No comments system on blog posts
- No search beyond the command palette's fuzzy matching
- No tags or categories on posts
