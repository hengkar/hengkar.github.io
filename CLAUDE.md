# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal landing page for Heng Kar Lau (AI training / GenAI advisory), published as a GitHub Pages **user site** at `hengkar.github.io` from `origin/main`. Three hand-written files, no build step, no dependencies, no tests:

- `index.html` — all content and markup (~900 lines; the Open-Source Lab section is ~600 of them)
- `styles.css` — one stylesheet, dark theme, tokens in `:root`
- `script.js` — vanilla DOM wiring, no framework, loaded with a plain `<script>` at the end of `<body>`

## Working on it

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Deploy is `git push origin main` — Pages serves whatever is on `main`, so anything pushed is live immediately. There is nothing to build, lint, or test; verify changes in a browser.

## Architecture notes

**Content lives in HTML, behavior keys off `data-*` attributes.** `script.js` never generates markup — it only toggles state classes on elements that already exist. All three interactive systems follow the same shape: a button carries a `data-*` pointer, the script flips a class, and CSS does the hiding. The state classes are `.is-collapsed` and `.is-hidden` (both `display: none`), plus `.is-active` on filter buttons and `.is-open` on `.site-header` for the mobile nav.

**The Open-Source Lab (`#lab`) is the only non-trivial part.** Its structure:

1. Three summary cards (`.lab-summary-toggle`, each with `data-target`) gate three detail panels — `#lab-built`, `#lab-curated-business`, `#lab-curated-technical`. All three ship `.is-collapsed` so the section reads as three choices, not a wall of cards. Toggle labels come from `data-hide-text` plus the button's initial text, which the script captures into `data-show-text` at load — so **editing a toggle's initial text also changes its collapsed label**.
2. Each curated panel has its own `.lab-filters` bar scoped by `data-scope` (the panel's id). A filter button's `data-filter` is matched against `data-group` on `.lab-group` divs *inside that panel only*; the two bars never affect each other. `data-filter="all"` shows everything. The technical panel has a `data-group="other"` catch-all group with **no** filter button — it is only visible under "All".
3. Inside groups, `.also-exploring-toggle` reveals the sibling `.also-exploring` link list. The script counts the `<a>` children and builds the label at runtime from `data-label` ("Also in this trail — show 6 more ↓"), so **counts in those labels are never hardcoded in HTML** — don't add them.

**Repo counts are hand-maintained and must be kept consistent.** The `.lab-stats` row (71 / 15 / 56 / 8), the `.track-tag` counts on each summary card, the `.tier-count` spans in tier headers, and the prose in `.lab-intro` and `.lab-footnote` all restate the same numbers. The "71 repos featured" figure counts `.project-card` articles **plus** `.also-exploring` links. Adding or removing a repo means updating every one of those places, including the dated snapshot line in `.lab-footnote`.

**Card taxonomy.** Each `.project-card` carries `data-ownership` (`built` | `curated`) and `data-theme` (matching the filter keys: `pm`, `opc`, `llmf`, `proj`, `ctx`, `harness`, `coding`, `tool`, `obs`, `other`) and a matching `.badge` class — `badge-flagship` (reserved for the two genuinely high-impact original builds), `badge-built`, `badge-curated`. The built/curated distinction is the page's central honesty claim; don't blur it when adding cards. Note that filtering currently operates on `.lab-group`, not on `data-theme` — the per-card attributes are metadata for now.

**Nav anchors are load-bearing.** `.site-nav` links point at `#about`, `#training`, `#advisory`, `#lab`, `#contact` (`#contact` is the `<footer>`); `.brand` points at `#top` on `<main>`. Renaming a section id breaks the header nav silently.

## Style conventions

- CSS is organized top-to-bottom by page section with `/* ---------- section ---------- */` banner comments; the three `@media` blocks live together at the bottom under `/* ---------- responsive ---------- */`. Add rules to the matching section, not the end of the file.
- Colors and layout constants come from `:root` custom properties (`--cyan`, `--blue`, `--violet`, `--line`, `--max`, `--shadow`, …) — use the tokens rather than raw hex.
- Every outbound link uses `target="_blank" rel="noopener"`.
- Interactive controls carry `aria-expanded` that the script keeps in sync; preserve that when adding toggles.
- Fonts (Inter, Sora) load from Google Fonts via `<link>` — the page has no other external dependency.
