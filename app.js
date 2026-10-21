const STATUS_LABEL = {
  release: { text: "公開中", cls: "release" },
  dev: { text: "開発中", cls: "dev" },
  exp: { text: "実験", cls: "exp" },
};

let products = [];
let activeTag = null;
let tagsExpanded = false;
let revealObserver;
let detailTrigger;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

async function init() {
  setupDialog();
  const header = document.querySelector(".site-header");
  let headerVisible = true;
  const updateBackground = () => header.classList.toggle("is-paused", document.hidden || !headerVisible);
  document.addEventListener("visibilitychange", updateBackground);
  if ("IntersectionObserver" in window) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      headerVisible = entry.isIntersecting;
      updateBackground();
    });
    headerObserver.observe(header);
  }
  updateBackground();
  try {
    const res = await fetch("products.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Unable to load products");
    products = await res.json();
    renderFilterBar();
    renderGrid();
  } catch {
    document.getElementById("count").textContent = "作品を読み込めませんでした。ページを再読み込みしてください。";
  }
}

function allTags() {
  const tags = new Set();
  products.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return [...tags];
}

function renderFilterBar() {
  const bar = document.getElementById("filterBar");
  bar.innerHTML = "";
  const makeChip = (label, tag, parent = bar) => {
    const b = document.createElement("button");
    b.className = "chip" + (activeTag === tag ? " active" : "");
    b.textContent = label;
    b.setAttribute("aria-pressed", String(activeTag === tag));
    b.onclick = () => {
      activeTag = tag;
      renderFilterBar();
      renderGrid();
      [...bar.querySelectorAll(".chip")].find((chip) => chip.getAttribute("aria-pressed") === "true")?.focus();
    };
    parent.appendChild(b);
  };
  makeChip("すべて", null);
  const tags = allTags();
  const featured = ["AI", "PDF", "執筆"].filter((tag) => tags.includes(tag));
  tags.filter((tag) => !featured.includes(tag)).slice(0, 3 - featured.length).forEach((tag) => featured.push(tag));
  featured.forEach((tag) => makeChip(tag, tag));
  if (activeTag && !featured.includes(activeTag) && !tagsExpanded) makeChip(activeTag, activeTag);
  const more = document.createElement("button");
  more.className = "chip tag-toggle";
  more.textContent = tagsExpanded ? "タグを閉じる −" : "すべてのタグ ＋";
  more.setAttribute("aria-expanded", String(tagsExpanded));
  more.setAttribute("aria-controls", "extraTags");
  more.onclick = () => {
    tagsExpanded = !tagsExpanded;
    renderFilterBar();
    bar.querySelector(".tag-toggle").focus();
  };
  bar.appendChild(more);
  const extra = document.createElement("div");
  extra.id = "extraTags";
  extra.className = "extra-tags";
  extra.hidden = !tagsExpanded;
  tags.filter((tag) => !featured.includes(tag)).forEach((tag) => makeChip(tag, tag, extra));
  bar.appendChild(extra);
}

function renderGrid() {
  const grid = document.getElementById("grid");
  revealObserver?.disconnect();
  const list = activeTag ? products.filter((p) => p.tags.includes(activeTag)) : products;
  document.getElementById("count").textContent = `${list.length}件のプロダクト`;
  grid.innerHTML = "";
  list.forEach((p) => grid.appendChild(card(p)));
  revealCards(grid);
}

function revealCards(grid) {
  if (reducedMotion.matches || !("IntersectionObserver" in window) || !Element.prototype.animate) return;
  revealObserver = new IntersectionObserver((entries) => {
    let order = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealObserver.unobserve(entry.target);
      if (reducedMotion.matches || entry.target.contains(document.activeElement)) return;
      entry.target.animate([
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 450, delay: Math.min(order++ * 70, 210), easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
    });
  }, { threshold: 0 });
  grid.querySelectorAll(".card").forEach((item) => {
    revealObserver.observe(item);
    item.addEventListener("focusin", () => {
      revealObserver.unobserve(item);
      item.getAnimations().forEach((animation) => animation.cancel());
    });
  });
}

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) document.querySelectorAll(".card").forEach((item) => item.getAnimations().forEach((animation) => animation.cancel()));
});

function card(p) {
  const el = document.createElement("article");
  el.className = "card";

  const status = STATUS_LABEL[p.status] || STATUS_LABEL.exp;
  const thumb = p.image
    ? `<img src="${p.image}" alt="${p.name} のスクリーンショット" loading="lazy">`
    : `<div class="placeholder"><span>${p.name.slice(0, 2)}</span><small>画像未掲載</small></div>`;
  const demoBtn = p.demo
    ? `<a class="btn demo" href="${p.demo}" target="_blank" rel="noopener">試してみる</a>`
    : "";

  el.innerHTML = `
    <div class="thumb">${thumb}</div>
    <div class="card-body">
      <div class="card-head">
        <h3>${p.name}</h3>
        <span class="badge ${status.cls}">${status.text}</span>
      </div>
      <p class="catch">${p.catch}</p>
      <p class="desc">${p.description}</p>
      <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="links">
        <button class="btn detail-button" type="button" aria-label="${p.name} の詳細を見る">詳細を見る <span aria-hidden="true">↗</span></button>
        <a class="btn github" href="${p.github}" target="_blank" rel="noopener">GitHub で見る</a>
        ${demoBtn}
      </div>
    </div>`;

  el.addEventListener("click", (e) => {
    if (e.target.closest("a")) return; // ボタン類はリンク動作を優先
    detailTrigger = el.querySelector(".detail-button");
    openDetail(p);
  });
  return el;
}

function openDetail(p) {
  const dlg = document.getElementById("detailDialog");
  const status = STATUS_LABEL[p.status] || STATUS_LABEL.exp;
  const paragraphs = p.details && p.details.length ? p.details : [p.description];
  const img = p.image
    ? `<img class="detail-img" src="${p.image}" alt="${p.name} のスクリーンショット">`
    : "";
  const demoBtn = p.demo
    ? `<a class="btn demo" href="${p.demo}" target="_blank" rel="noopener">試してみる</a>`
    : "";
  document.getElementById("detailContent").innerHTML = `
    <div class="detail-body">
      <div class="card-head">
        <h2>${p.name}</h2>
        <span class="badge ${status.cls}">${status.text}</span>
      </div>
      <p class="catch">${p.catch}</p>
      ${img}
      ${paragraphs.map((t) => `<p class="detail-text">${t}</p>`).join("")}
      <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="links">
        <a class="btn github" href="${p.github}" target="_blank" rel="noopener">GitHub で見る</a>
        ${demoBtn}
      </div>
    </div>`;
  dlg.showModal();
  dlg.scrollTop = 0;
}

function setupDialog() {
  const dlg = document.getElementById("detailDialog");
  document.getElementById("detailClose").onclick = () => dlg.close();
  dlg.addEventListener("close", () => detailTrigger?.focus());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close(); // 小窓の外側（背景）クリックで閉じる
  });
}

init();
