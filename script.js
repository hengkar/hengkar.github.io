// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const header = document.querySelector(".site-header");

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Open-Source Lab: three summary cards (Done by Me / Curated — Business /
// Curated — Technical) each gate a detail panel — #lab-built (Original Builds +
// Data Science Foundations), #lab-curated-business (pm + opc groups), and
// #lab-curated-technical (llmf / proj / ctx / harness / coding / tool / obs, plus
// an "other" catch-all group with no dedicated filter button). All three panels
// load collapsed so the section reads as three choices, not a wall of cards.
const summaryToggles = document.querySelectorAll(".lab-summary-toggle");

function setDetailExpanded(targetId, expanded) {
  const panel = document.getElementById(targetId);
  const toggle = document.querySelector(`.lab-summary-toggle[data-target="${targetId}"]`);
  if (!panel || !toggle) return;
  panel.classList.toggle("is-collapsed", !expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
  const showText = toggle.getAttribute("data-show-text");
  const hideText = toggle.getAttribute("data-hide-text");
  if (showText && hideText) toggle.textContent = expanded ? hideText : showText;
}

summaryToggles.forEach((btn) => {
  btn.setAttribute("data-show-text", btn.textContent.trim());
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const panel = document.getElementById(targetId);
    if (!panel) return;
    const willExpand = panel.classList.contains("is-collapsed");
    setDetailExpanded(targetId, willExpand);
    if (willExpand) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Theme filters live inside their own (collapsed-by-default) curated panel — the
// business filter bar only ever touches #lab-curated-business's groups, and the
// technical filter bar only touches #lab-curated-technical's. Each bar carries
// its scope via data-scope on the wrapping .lab-filters element.
function applyFilter(scopeId, filter) {
  document.querySelectorAll(`#${scopeId} .lab-group`).forEach((group) => {
    const groupKey = group.getAttribute("data-group");
    const show = filter === "all" || groupKey === filter;
    group.classList.toggle("is-hidden", !show);
  });
}

document.querySelectorAll(".lab-filters").forEach((bar) => {
  const scopeId = bar.getAttribute("data-scope");
  if (!scopeId) return;
  const buttons = bar.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter(scopeId, btn.getAttribute("data-filter"));
      setDetailExpanded(scopeId, true);
    });
  });
});

// Progressive disclosure for the "also exploring" link trails inside the Open-Source
// Lab. Each trail loads collapsed to one line; clicking the toggle reveals the full
// list of curated links in place, no navigation and no extra page to maintain.
document.querySelectorAll(".also-exploring-toggle").forEach((btn) => {
  const list = btn.nextElementSibling;
  if (!list || !list.classList.contains("also-exploring")) return;

  const label = btn.getAttribute("data-label") || "Also exploring";
  const count = list.querySelectorAll("a").length;
  const showText = `${label} — show ${count} more ↓`;
  const hideText = `${label} — show less ↑`;
  btn.textContent = showText;

  btn.addEventListener("click", () => {
    const collapsed = list.classList.toggle("is-collapsed");
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.textContent = collapsed ? showText : hideText;
  });
});
