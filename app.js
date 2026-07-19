const STATUS_LABEL = {
  release: { text: "公開中", cls: "release" },
  dev: { text: "開発中", cls: "dev" },
  exp: { text: "実験", cls: "exp" },
};

let products = [];
let activeTag = null;

async function init() {
  const res = await fetch("products.json");
  products = await res.json();
  renderFilterBar();
  renderGrid();
  setupDialog();
}

function allTags() {
  const tags = new Set();
  products.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return [...tags];
}

function renderFilterBar() {
  const bar = document.getElementById("filterBar");
  bar.innerHTML = "";
  const makeChip = (label, tag) => {
    const b = document.createElement("button");
    b.className = "chip" + (activeTag === tag ? " active" : "");
    b.textContent = label;
    b.onclick = () => {
      activeTag = tag;
      renderFilterBar();
      renderGrid();
    };
    bar.appendChild(b);
  };
  makeChip("すべて", null);
  allTags().forEach((t) => makeChip(t, t));
}

function renderGrid() {
  const grid = document.getElementById("grid");
  const list = activeTag ? products.filter((p) => p.tags.includes(activeTag)) : products;
  document.getElementById("count").textContent = `${list.length}件のプロダクト`;
  grid.innerHTML = "";
  list.forEach((p) => grid.appendChild(card(p)));
}

function card(p) {
  const el = document.createElement("article");
  el.className = "card";

  const status = STATUS_LABEL[p.status] || STATUS_LABEL.exp;
  const thumb = p.image
    ? `<img src="${p.image}" alt="${p.name} のスクリーンショット" loading="lazy">`
    : `<div class="placeholder">${p.name.slice(0, 2)}</div>`;
  const demoBtn = p.demo
    ? `<a class="btn demo" href="${p.demo}" target="_blank" rel="noopener">試してみる</a>`
    : "";

  el.innerHTML = `
    <div class="thumb">${thumb}</div>
    <div class="card-body">
      <div class="card-head">
        <h2>${p.name}</h2>
        <span class="badge ${status.cls}">${status.text}</span>
      </div>
      <p class="catch">${p.catch}</p>
      <p class="desc">${p.description}</p>
      <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="links">
        <a class="btn github" href="${p.github}" target="_blank" rel="noopener">GitHub で見る</a>
        ${demoBtn}
      </div>
    </div>`;

  el.tabIndex = 0;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", `${p.name} の詳細を見る`);
  el.addEventListener("click", (e) => {
    if (e.target.closest("a")) return; // ボタン類はリンク動作を優先
    openDetail(p);
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.target.closest("a")) openDetail(p);
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
    ${img}
    <div class="detail-body">
      <div class="card-head">
        <h2>${p.name}</h2>
        <span class="badge ${status.cls}">${status.text}</span>
      </div>
      <p class="catch">${p.catch}</p>
      ${paragraphs.map((t) => `<p class="detail-text">${t}</p>`).join("")}
      <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="links">
        <a class="btn github" href="${p.github}" target="_blank" rel="noopener">GitHub で見る</a>
        ${demoBtn}
      </div>
    </div>`;
  dlg.showModal();
}

function setupDialog() {
  const dlg = document.getElementById("detailDialog");
  document.getElementById("detailClose").onclick = () => dlg.close();
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close(); // 小窓の外側（背景）クリックで閉じる
  });
}

init();
