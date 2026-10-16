/* ==========================================================
   Works
   Put your images in an images/ folder and list them here.
   cover is the picture shown in the list (leave it out to use
   the first image; with no picture at all a plain colour
   block is shown). Optional fields: category, description,
   medium, size, tags, coverPosition (which part of the cover
   shows in the list, e.g. "center bottom"), darkText (true =
   black title in the list, for light covers).

   Illustrations: each entry is a set of short pieces, shown
   two per row in the list. images lists every piece in the
   set; opening the set shows them all, one after another,
   e.g. images: ["images/fox-1.jpg", "images/fox-2.jpg"].

   Animations: add type: "animation" and put the video in a
   videos/ folder, e.g. video: "videos/dragon.mp4". The video
   only loads once the work is opened. Optional field: duration.
   Leave video out for a concept-art-only animation: the list
   shows a "Concept" badge and the detail shows just the sheets.
   Animations are always listed first.

   Backgrounds: add type: "background". They get their own
   section after the illustrations, one wide row each; images
   works the same as for illustrations.

   Concept art (any work): sheets are shown one after another
   under the description, before year etc.
   e.g. sheets: ["images/character.jpg", "images/storyboard.jpg"].
   sheetsTitle changes the divider heading (default "Concept Art").
   ========================================================== */
const works = [
  {
    id: "the-life-of-a-chair",
    type: "animation",
    title: "The Life of a Chair",
    year: "Nov 2025",
    duration: "1:07",
    video: "videos/the-life-of-a-chair.mp4",
    cover: "images/the-life-of-a-chair-cover.jpg",
    coverPosition: "center 80%",
    darkText: true,
    color: "#7a7a7a",
    sheets: [
      "images/the-life-of-a-chair-1.jpg",
      "images/the-life-of-a-chair-2.jpg",
      "images/the-life-of-a-chair-3.jpg",
      "images/the-life-of-a-chair-4.jpg",
      "images/the-life-of-a-chair-5.jpg",
      "images/the-life-of-a-chair-6.jpg",
    ],
  },
  {
    id: "game-of-hearts",
    type: "animation",
    title: "Game of Hearts",
    year: "May 2025",
    cover: "images/game-of-hearts-cover.jpg",
    coverPosition: "center 40%",
    darkText: true,
    color: "#7a6a8a",
    sheets: [
      "images/game-of-hearts-1.jpg",
      "images/game-of-hearts-2.jpg",
      "images/game-of-hearts-3.jpg",
      "images/game-of-hearts-4.jpg",
      "images/game-of-hearts-5.jpg",
      "images/game-of-hearts-6.jpg",
      "images/game-of-hearts-7.jpg",
    ],
  },
  {
    id: "character-design",
    title: "Character Design",
    cover: "images/character-design-cover.jpg",
    coverPosition: "center 35%",
    images: ["images/character-design-1.jpg"],
    darkText: true,
    color: "#e8eaec",
  },
  {
    id: "bernese-mountain-dog",
    title: "Bernese Mountain Dog",
    cover: "images/bernese-mountain-dog-cover.jpg",
    coverPosition: "center 25%",
    images: ["images/bernese-mountain-dog-1.jpg"],
    darkText: true,
    color: "#efeae2",
  },
  {
    id: "claudine",
    title: "Claudine",
    description: "Japanese anime-style character design.",
    cover: "images/claudine-cover.jpg",
    coverPosition: "center top",
    images: ["images/claudine-1.jpg", "images/claudine-2.jpg"],
    darkText: true,
    color: "#ece6da",
  },
  {
    id: "ethan",
    title: "Ethan",
    cover: "images/ethan-cover.jpg",
    coverPosition: "center 40%",
    images: ["images/ethan-1.jpg"],
    darkText: true,
    color: "#ece8e2",
  },
  {
    id: "background-character-design",
    title: "Background & Character Design",
    description: "Background and character illustration design.",
    images: [
      "images/roast-duck-shop-1.jpg",
      "images/pumpkin-house-1.jpg",
      "images/corner-cafe-1.jpg",
    ],
    cover: "images/background-character-design-cover.jpg",
    coverPosition: "center 18%",
    darkText: true,
    color: "#d8d4cc",
  },
  {
    id: "dragon-tower",
    type: "background",
    title: "Dragon Tower",
    images: ["images/bg-dragon-tower.jpg"],
    coverPosition: "center 70%",
    color: "#6b6f80",
  },
  {
    id: "mountain",
    type: "background",
    title: "Mountain",
    images: ["images/bg-mountain.jpg"],
    coverPosition: "center 35%",
    color: "#1a2a8a",
  },
  {
    id: "it-happens",
    type: "background",
    title: "It Happens",
    images: ["images/bg-it-happens.jpg"],
    coverPosition: "center 50%",
    color: "#2a3a2a",
  },
  {
    id: "night-tree",
    type: "background",
    title: "Night Tree",
    images: ["images/bg-night-tree.jpg"],
    coverPosition: "center 55%",
    color: "#10208a",
  },
  {
    id: "shopfronts",
    type: "background",
    title: "Shopfronts",
    images: ["images/bg-shopfronts.jpg"],
    coverPosition: "center 50%",
    color: "#4a4038",
  },
];

/* ========================================================== */

const $ = (sel) => document.querySelector(sel);

const app = $("#app");
const listEl = $("#work-list");
const filtersEl = $("#filters");
const detailEl = $("#detail");
const detailScroll = $("#detail-scroll");
const detailContent = $("#detail-content");
const countEl = $("#detail-count");
const viewer = $("#viewer");
const viewerBody = $("#viewer-body");

const state = { category: "all", currentId: null, page: null };
const PAGES = ["about", "contact"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isPhone = window.matchMedia("(max-width: 820px)");

// On phones, opening a work adds a history entry, so the phone's own back
// gesture / back button closes the detail instead of leaving the site
let pushedDetail = false;
let ignorePop = false;
let swipeDir = 0; // set by a swipe, so the next work slides in from that side

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function findWork(id) {
  return works.find((w) => w.id === id);
}

function coverOf(work) {
  return work.cover || work.images?.[0];
}

/* The cover if there is one, otherwise a plain colour block */
function coverHTML(work) {
  const src = coverOf(work);
  if (src) {
    const position = work.coverPosition ? ` style="object-position:${esc(work.coverPosition)}"` : "";
    return `<img src="${esc(src)}" alt="${esc(work.title)}"${position} loading="lazy">`;
  }
  return `<span class="art" style="--art:${esc(work.color)}" role="img" aria-label="${esc(work.title)}"></span>`;
}

function isAnimation(work) {
  return work.type === "animation";
}

/* List sections, in order. A work's type picks its section; no type = illustration */
const GROUPS = [
  { kind: "animation", label: "Animation" },
  { kind: "illustration", label: "Illustration" },
  { kind: "background", label: "Background" },
];

function kindOf(work) {
  return GROUPS.some((g) => g.kind === work.type) ? work.type : "illustration";
}

/* Filtered by category, in section order */
function visibleWorks() {
  const items = works.filter((w) => state.category === "all" || w.category === state.category);
  return GROUPS.flatMap((g) => items.filter((w) => kindOf(w) === g.kind));
}

/* ---------- Category filters (hidden if there's only one category) ---------- */
function renderFilters() {
  const categories = [...new Set(works.map((w) => w.category).filter(Boolean))];
  filtersEl.hidden = categories.length < 2;
  filtersEl.innerHTML = ["all", ...categories].map((c) => `
    <button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="${c === state.category}">
      ${c === "all" ? "All" : esc(c)}
    </button>`).join("");
}

/* ---------- Works list ---------- */
const PLAY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>`;
const SET_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor"/></svg>`;

function badgeHTML(w) {
  if (isAnimation(w)) {
    return w.video
      ? `<span class="row-play">${PLAY_ICON}${esc(w.duration)}</span>`
      : `<span class="row-play row-play--text">Concept</span>`;
  }
  const count = w.images?.length || 0;
  return count > 1 ? `<span class="row-play" aria-label="${count} pieces">${SET_ICON}${count}</span>` : "";
}

function rowHTML(w, number) {
  const meta = [isAnimation(w) && "Animation", w.category, w.year].filter(Boolean).map(esc).join(" · ");
  const excerpt = w.description ? `<span class="row-excerpt">${esc(w.description)}</span>` : "";
  return `
    <li>
      <button class="work-row${w.darkText ? " work-row--dark" : ""}" type="button" data-id="${esc(w.id)}" aria-current="${w.id === state.currentId}">
        <span class="row-media">${coverHTML(w)}</span>
        ${badgeHTML(w)}
        <span class="row-no">No.${String(number).padStart(2, "0")}</span>
        <span class="row-text">
          <span class="row-title">${esc(w.title)}</span>
          <span class="row-meta">${meta}</span>
          ${excerpt}
        </span>
      </button>
    </li>`;
}

/* Animations and backgrounds one per row, illustration sets two per row;
   group labels only when more than one section is shown */
function renderList() {
  const items = visibleWorks();
  const groups = GROUPS
    .map((g) => [g.label, g.kind, items.filter((w) => kindOf(w) === g.kind)])
    .filter(([, , list]) => list.length);

  listEl.innerHTML = groups.map(([label, kind, list]) => `
    <li class="group group--${kind}">
      ${groups.length > 1 ? `<h3 class="group-label">${label}</h3>` : ""}
      <ul class="group-items">${list.map((w) => rowHTML(w, items.indexOf(w) + 1)).join("")}</ul>
    </li>`).join("");
  updateCount();
}

function markCurrent() {
  listEl.querySelectorAll(".work-row").forEach((row) => {
    row.setAttribute("aria-current", row.dataset.id === state.currentId);
  });
}

function rowFor(id) {
  return listEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
}

function updateCount() {
  if (!state.currentId) return;
  const items = visibleWorks();
  const i = items.findIndex((w) => w.id === state.currentId);
  countEl.textContent = i === -1 ? "—" : `${i + 1} / ${items.length}`;
}

/* ---------- Work detail ---------- */
// A full-width, zoomable image; an empty path shows a grey placeholder block
function stackItemHTML(src, alt) {
  if (!src) return `<span class="art stack-placeholder"></span>`;
  return `<button class="stack-btn" type="button" data-zoom aria-label="View full size">
      <img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">
    </button>`;
}

function stackHTML(list, alt) {
  return `<div class="detail-stack">${list.map((src) => stackItemHTML(src, alt)).join("")}</div>`;
}

function renderDetail(w) {
  const meta = [
    ["Date", w.year],
    ["Duration", w.duration],
    ["Medium", w.medium],
    ["Size", w.size],
    ["Category", w.category],
  ].filter(([, v]) => v);
  const tags = w.tags?.length
    ? `<ul class="detail-tags">${w.tags.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>`
    : "";

  // Animations: a video player (loaded only now). Illustration sets: every piece, one after another.
  // An animation without a video is concept art only: no player, sheets straight away.
  let media = "";
  if (isAnimation(w) && w.video) {
    const poster = w.cover ? ` poster="${esc(w.cover)}"` : "";
    media = `<figure class="detail-figure"><video class="detail-video" src="${esc(w.video)}"${poster} controls muted playsinline preload="metadata"></video></figure>`;
  } else if (!isAnimation(w) && w.images?.length) {
    media = stackHTML(w.images, w.title);
  }

  // The divider heading only separates the sheets from a video/pieces above them
  const sheets = w.sheets?.length
    ? `${media ? `<h3 class="sheets-title">${esc(w.sheetsTitle || "Concept Art")}</h3>` : ""}
       ${stackHTML(w.sheets, `${w.title} concept art`)}`
    : "";

  detailContent.innerHTML = `
    <header class="detail-head">
      <h2 class="detail-title">${esc(w.title)}</h2>
      <div class="ornament" aria-hidden="true"><span></span><i></i><span></span></div>
    </header>
    ${media}
    ${w.description ? `<p class="detail-desc">${esc(w.description)}</p>` : ""}
    ${sheets}
    <dl class="detail-meta">
      ${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}
    </dl>
    ${tags}`;

  detailScroll.scrollTop = 0;
}

function isOpen() {
  return app.classList.contains("is-open");
}

function markNav() {
  document.querySelectorAll(".topnav [data-page]").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.page === state.page);
  });
}

/* Shared by works and About/Contact: slide the detail pane in */
function showDetail(hash) {
  const wasOpen = isOpen();
  app.classList.add("is-open");
  detailEl.removeAttribute("inert");
  detailEl.setAttribute("aria-hidden", "false");
  detailEl.classList.toggle("is-page", Boolean(state.page));
  markCurrent();
  markNav();
  updateCount();
  if (!wasOpen && isPhone.matches) {
    history.pushState({ detail: true }, "", `#${hash}`);
    pushedDetail = true;
  } else {
    history.replaceState(history.state, "", `#${hash}`);
  }

  // Fade the new content in when switching (sideways after a swipe)
  if (wasOpen && !reduceMotion.matches) {
    const from = swipeDir ? `translateX(${swipeDir * 60}px)` : "translateY(10px)";
    detailContent.animate(
      [{ opacity: 0, transform: from }, { opacity: 1, transform: "none" }],
      { duration: 320, easing: "cubic-bezier(.22,.8,.2,1)" }
    );
  }
  swipeDir = 0;
  return wasOpen;
}

function openWork(id, { scroll = false } = {}) {
  const w = findWork(id);
  if (!w) return;

  state.currentId = id;
  state.page = null;
  renderDetail(w);
  const wasOpen = showDetail(id);

  // Start the animation right away, muted; viewers turn the sound on with the player's controls
  detailContent.querySelector("video")?.play().catch(() => {});

  // After the list narrows, keep the selected row in view
  if (scroll || !wasOpen) {
    setTimeout(() => rowFor(id)?.scrollIntoView({ block: "nearest", behavior: "smooth" }), wasOpen ? 0 : 560);
  }
}

function openPage(name) {
  const tpl = document.getElementById(`page-${name}`);
  if (!tpl) return;

  state.currentId = null;
  state.page = name;
  detailContent.replaceChildren(tpl.content.cloneNode(true));
  detailScroll.scrollTop = 0;
  showDetail(name);
}

function closeDetail() {
  if (!isOpen()) return;
  // drop the history entry added when the detail opened on a phone
  if (pushedDetail) {
    pushedDetail = false;
    ignorePop = true;
    history.back();
  }
  const id = state.currentId;
  state.currentId = null;
  state.page = null;

  detailContent.querySelector("video")?.pause();
  app.classList.remove("is-open");
  detailEl.setAttribute("inert", "");
  detailEl.setAttribute("aria-hidden", "true");
  markCurrent();
  markNav();
  history.replaceState(null, "", location.pathname + location.search);

  if (!id) return;
  const row = rowFor(id);
  row?.focus({ preventScroll: true });
  setTimeout(() => row?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 560);
}

function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (PAGES.includes(id)) openPage(id);
  else if (findWork(id)) openWork(id, { scroll: true });
}

function step(delta) {
  const items = visibleWorks();
  if (!items.length) return;
  const i = items.findIndex((w) => w.id === state.currentId);
  const next = i === -1 ? 0 : (i + delta + items.length) % items.length;
  openWork(items[next].id, { scroll: true });
}

/* ---------- Full-screen viewer: flip through every image in the open work ---------- */
let viewerImages = [];
let viewerIndex = 0;

function showViewerImage() {
  const img = viewerImages[viewerIndex];
  viewerBody.innerHTML = `<img src="${esc(img.getAttribute("src"))}" alt="${esc(img.alt)}">`;
}

function openViewer(btn) {
  viewerImages = [...detailContent.querySelectorAll("[data-zoom] img")];
  viewerIndex = viewerImages.indexOf(btn.querySelector("img"));
  if (viewerIndex === -1) return;
  viewer.classList.toggle("is-single", viewerImages.length < 2);
  showViewerImage();
  viewer.showModal();
}

function stepViewer(delta) {
  if (viewerImages.length < 2) return;
  viewerIndex = (viewerIndex + delta + viewerImages.length) % viewerImages.length;
  showViewerImage();
}

/* ---------- Events ---------- */
listEl.addEventListener("click", (e) => {
  const row = e.target.closest(".work-row");
  if (row && row.dataset.id !== state.currentId) openWork(row.dataset.id);
});

filtersEl.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.category = chip.dataset.cat;
  renderFilters();
  renderList();
});

$("#close-btn").addEventListener("click", closeDetail);

document.querySelector(".topnav").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-page]");
  if (!btn) return;
  if (btn.dataset.page === state.page) closeDetail();
  else openPage(btn.dataset.page);
});

/* ---------- Ink splatter: clicking the name bursts it into coloured ink
   that sprays out from all around it. The ink only shows inside the top
   and bottom bars and stays there until the page is reloaded; every
   click adds more ---------- */
const brand = $("#brand");
const INK_COLORS = ["#e63946", "#ff7b00", "#ffb703", "#2ec4b6", "#118ab2", "#3a0ca3", "#8338ec", "#ff006e", "#06d6a0"];

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// An irregular blob: each corner gets its own random curve
function blobRadius() {
  const r = () => Math.round(rand(30, 70));
  return `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;
}

function addInk(layer, x, y, size, color) {
  const ink = document.createElement("span");
  ink.className = "ink-drop";
  ink.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:${blobRadius()};background:${color}`;
  layer.append(ink);
  return ink;
}

// One drop: leaves the edge of the name, arcs out and splats at (tx, ty).
// All coordinates are relative to the bar the drop lands in.
function throwDrop(layer, ox, oy, tx, ty, halfW, halfH) {
  const size = 5 + Math.random() ** 2 * 34; // mostly small drops, a few big ones
  const color = pick(INK_COLORS);
  // start on the outline of the name, on the side facing the target
  const angle = Math.atan2(ty - oy, tx - ox);
  const sx = ox + Math.cos(angle) * halfW;
  const sy = oy + Math.sin(angle) * halfH;
  const dx = sx - tx;
  const dy = sy - ty;
  const delay = rand(0, 120);
  const flight = 260 + Math.hypot(dx, dy) * 0.3;
  const lift = rand(10, 50);

  const drop = addInk(layer, tx, ty, size, color);
  drop.animate([
    { transform: `translate(${dx}px, ${dy}px) scale(0.25)` },
    { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - lift}px) scale(0.5)`, offset: 0.5 },
    { transform: "translate(0, 0) scale(1.25)", offset: 0.9 },
    { transform: "translate(0, 0) scale(1)" },
  ], { duration: flight, delay, easing: "cubic-bezier(.25,.7,.35,1)", fill: "backwards" });

  // bigger drops throw a few tiny specks around where they land
  const landed = delay + flight;
  if (size > 16) {
    for (let k = 0; k < 4; k++) {
      const a = rand(0, Math.PI * 2);
      const dist = size * rand(0.7, 1.5);
      const speck = addInk(layer, tx + Math.cos(a) * dist, ty + Math.sin(a) * dist, rand(2, 6), color);
      speck.animate([{ opacity: 0, transform: "scale(0)" }, { opacity: 1, transform: "scale(1)" }],
        { duration: 160, delay: landed - 40, fill: "backwards" });
    }
  }
}

function splatterInk() {
  if (reduceMotion.matches || brand.classList.contains("is-exploding")) return;
  brand.classList.add("is-exploding");

  const name = brand.getBoundingClientRect();
  const cx = name.left + name.width / 2;
  const cy = name.top + name.height / 2;
  const plan = [
    [$(".topbar"), 34, true],      // most of the ink, clustered around the name
    [$(".bottombar"), 16, false],  // the rest flies in from above
  ];

  plan.forEach(([bar, count, nearName]) => {
    const box = bar.getBoundingClientRect();
    let layer = bar.querySelector(".ink-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "ink-layer";
      bar.append(layer);
    }
    const ox = cx - box.left;
    const oy = cy - box.top;
    for (let i = 0; i < count; i++) {
      let tx;
      if (nearName && i < count * 0.65) {
        // all around the name: left, right, above and below it
        const a = rand(0, Math.PI * 2);
        tx = ox + Math.cos(a) * rand(name.width * 0.5, name.width * 2.2);
      } else {
        tx = rand(8, box.width - 8);
      }
      tx = Math.min(Math.max(tx, 4), box.width - 4);
      const ty = rand(4, box.height - 4);
      throwDrop(layer, ox, oy, tx, ty, name.width / 2, name.height / 2);
    }
  });
}

/* ---------- Email links (bottom bar and Contact page): click copies the
   address instead of opening a mail app ---------- */

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // older browsers / blocked clipboard: copy through a hidden text box
    const box = document.createElement("textarea");
    box.value = text;
    box.style.cssText = "position:fixed;opacity:0";
    document.body.append(box);
    box.select();
    document.execCommand("copy");
    box.remove();
  }
}

// Delegated, because the Contact page is re-created each time it opens
document.addEventListener("click", async (e) => {
  const link = e.target.closest(".copy-email");
  if (!link) return;
  e.preventDefault();
  const email = link.getAttribute("href").replace("mailto:", "");
  await copyText(email);
  link.textContent = "Copied to clipboard ✓";
  link.classList.add("is-copied");
  clearTimeout(link.copiedTimer);
  link.copiedTimer = setTimeout(() => {
    link.textContent = email;
    link.classList.remove("is-copied");
  }, 1600);
});

// The name comes back once its burst animation ends; the ink stays
brand.addEventListener("animationend", () => brand.classList.remove("is-exploding"));

brand.addEventListener("click", (e) => {
  e.preventDefault();
  closeDetail();
  splatterInk();
});

$("#prev-btn").addEventListener("click", () => step(-1));
$("#next-btn").addEventListener("click", () => step(1));

detailContent.addEventListener("click", (e) => {
  const zoom = e.target.closest("[data-zoom]");
  if (zoom) openViewer(zoom);
});

// Arrows flip images; clicking anywhere else closes the viewer
viewer.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-step]");
  if (nav) stepViewer(Number(nav.dataset.step));
  else viewer.close();
});

// Keyboard: Esc closes, ↑ ↓ switch works, ← → flip images in the viewer
document.addEventListener("keydown", (e) => {
  if (viewer.open) {
    if (e.key === "ArrowLeft") stepViewer(-1);
    else if (e.key === "ArrowRight") stepViewer(1);
    return;
  }
  if (e.target.closest("video")) return; // let the player use its own keys
  if (!isOpen()) return;

  if (e.key === "Escape") {
    closeDetail();
  } else if (e.key === "ArrowDown" || e.key === "j") {
    e.preventDefault();
    step(1);
  } else if (e.key === "ArrowUp" || e.key === "k") {
    e.preventDefault();
    step(-1);
  }
});

window.addEventListener("hashchange", openFromHash);

// Phone back gesture / back button while a work is open: close it
window.addEventListener("popstate", () => {
  if (ignorePop) {
    ignorePop = false;
    return;
  }
  if (pushedDetail && !history.state?.detail) {
    pushedDetail = false;
    closeDetail();
  }
});

/* ---------- Phone swipes in the detail view:
   swipe left / right = next / previous work,
   swipe right from the left edge = back to the list ---------- */
const EDGE = 28;        // px from the left edge that count as an edge swipe
const SWIPE_MIN = 70;   // px a swipe has to travel
let touch = null;

function resetDrag() {
  detailEl.style.transition = "";
  detailEl.style.transform = "";
}

detailEl.addEventListener("touchstart", (e) => {
  if (!isPhone.matches || e.touches.length !== 1 || e.target.closest("video")) return;
  const t = e.touches[0];
  touch = { x: t.clientX, y: t.clientY, dx: 0, edge: t.clientX < EDGE, dir: null };
}, { passive: true });

detailEl.addEventListener("touchmove", (e) => {
  if (!touch) return;
  const t = e.touches[0];
  const dx = t.clientX - touch.x;
  const dy = t.clientY - touch.y;
  // decide once whether this is a sideways swipe or a normal scroll
  if (!touch.dir) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    touch.dir = Math.abs(dx) > Math.abs(dy) * 1.3 ? "h" : "v";
  }
  if (touch.dir !== "h") return;
  touch.dx = dx;
  // the pane follows the finger: fully for the edge swipe, a little for switching
  const pull = touch.edge ? Math.max(0, dx) : dx * 0.3;
  detailEl.style.transition = "none";
  detailEl.style.transform = `translateX(${pull}px)`;
}, { passive: true });

detailEl.addEventListener("touchend", () => {
  if (!touch) return;
  const { dir, dx, edge } = touch;
  touch = null;
  resetDrag();
  if (dir !== "h") return;
  if (edge && dx > SWIPE_MIN) {
    closeDetail();
  } else if (!edge && Math.abs(dx) > SWIPE_MIN && state.currentId) {
    swipeDir = dx < 0 ? 1 : -1;
    step(swipeDir);
  }
});

detailEl.addEventListener("touchcancel", () => {
  touch = null;
  resetDrag();
});

// Full-screen viewer: swipe left / right to flip images
let viewerTouch = null;
viewer.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  viewerTouch = { x: t.clientX, y: t.clientY };
}, { passive: true });

viewer.addEventListener("touchend", (e) => {
  if (!viewerTouch) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - viewerTouch.x;
  const dy = t.clientY - viewerTouch.y;
  viewerTouch = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) stepViewer(dx < 0 ? 1 : -1);
});

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
renderFilters();
renderList();

// Opening a link like index.html#untitled-1 or #about goes straight there
if (location.hash) {
  app.classList.add("no-motion");
  openFromHash();
  requestAnimationFrame(() => requestAnimationFrame(() => app.classList.remove("no-motion")));
}
