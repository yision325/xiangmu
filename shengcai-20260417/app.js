const state = {
  filterId: "all",
  activeModuleId: null
};

function qs(id) {
  return document.getElementById(id);
}

function isHashHref(href) {
  return typeof href === "string" && href.startsWith("#");
}

function linkAttrs(href) {
  return isHashHref(href) ? "" : ' target="_blank" rel="noopener noreferrer"';
}

function filteredModules() {
  const items = window.SITE_DATA.modules.items;
  if (state.filterId === "all") {
    return items;
  }
  return items.filter((item) => item.filterId === state.filterId);
}

function activeModule() {
  const items = filteredModules();
  return items.find((item) => item.id === state.activeModuleId) || items[0] || window.SITE_DATA.modules.items[0];
}

function setHead() {
  document.title = window.SITE_DATA.site.title;
  qs("brand-name").textContent = window.SITE_DATA.site.brandName;
  qs("brand-tagline").textContent = window.SITE_DATA.site.tagline;
  qs("footer-title").textContent = window.SITE_DATA.site.brandName;
  qs("footer-copy").textContent = window.SITE_DATA.site.footerCopy;
}

function renderNav() {
  qs("site-nav").innerHTML = window.SITE_DATA.nav.map((item) => (
    `<a href="${item.href}"${linkAttrs(item.href)}>${item.label}</a>`
  )).join("");

  qs("footer-links").innerHTML = window.SITE_DATA.site.footerLinks.map((item) => (
    `<a href="${item.href}"${linkAttrs(item.href)}>${item.label}</a>`
  )).join("");
}

function renderHero() {
  const hero = window.SITE_DATA.hero;
  const heroSection = document.querySelector(".hero");
  qs("hero-eyebrow").textContent = hero.eyebrow;
  qs("hero-title").textContent = hero.title;
  qs("hero-summary").textContent = hero.summary;
  if (hero.image) {
    heroSection.style.setProperty("--hero-image", `url("${hero.image}")`);
    heroSection.classList.add("has-hero-image");
  }
  qs("hero-actions").innerHTML = hero.actions.map((item) => (
    `<a href="${item.href}"${linkAttrs(item.href)}>${item.label}</a>`
  )).join("");
  qs("hero-stats").innerHTML = hero.stats.map((item) => (
    `<article><strong>${item.value}</strong><span>${item.label}</span></article>`
  )).join("");
  qs("hero-panel-kicker").textContent = hero.panel.kicker;
  qs("hero-panel-title").textContent = hero.panel.title;
  qs("hero-panel-text").textContent = hero.panel.text;
  qs("hero-panel-list").innerHTML = hero.panel.list.map((item) => `<li>${item}</li>`).join("");
}

function renderFocus() {
  const focus = window.SITE_DATA.focus;
  qs("focus-kicker").textContent = focus.kicker;
  qs("focus-title").textContent = focus.title;
  qs("focus-note").textContent = focus.note;
  qs("focus-grid").innerHTML = focus.cards.map((card) => (
    `<article class="focus-card">
      <span>${card.kicker}</span>
      <strong>${card.title}</strong>
      <p>${card.text}</p>
    </article>`
  )).join("");
}

function renderModuleFilters() {
  const modules = window.SITE_DATA.modules;
  qs("modules-kicker").textContent = modules.kicker;
  qs("modules-title").textContent = modules.title;
  qs("module-filters").innerHTML = modules.filters.map((item) => (
    `<button type="button" class="${item.id === state.filterId ? "is-active" : ""}" data-filter="${item.id}" aria-pressed="${item.id === state.filterId}">${item.label}</button>`
  )).join("");

  qs("module-filters").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.filterId = button.dataset.filter;
      state.activeModuleId = filteredModules()[0]?.id || null;
      renderModuleFilters();
      renderModuleList();
      renderSpotlight();
    });
  });
}

function renderModuleList() {
  const items = filteredModules();
  qs("module-list").innerHTML = items.map((item) => (
    `<article class="module-item ${item.id === state.activeModuleId ? "is-active" : ""}" data-module-id="${item.id}">
      <div class="module-meta">${item.kicker}</div>
      <strong>${item.name}</strong>
      <div class="module-meta">${item.tags.join(" / ")}</div>
      <p>${item.summary}</p>
    </article>`
  )).join("");

  qs("module-list").querySelectorAll(".module-item").forEach((card) => {
    card.addEventListener("click", () => {
      state.activeModuleId = card.dataset.moduleId;
      renderModuleList();
      renderSpotlight();
    });
  });
}

function renderSpotlight() {
  const item = activeModule();
  const coverMedia = item.image
    ? `<img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">`
    : "";

  qs("module-spotlight").style.setProperty("--cover-gradient", item.gradient);
  qs("module-spotlight").innerHTML = `
    <div class="module-cover">
      ${coverMedia}
      <div class="module-cover-badge">
        <span class="module-initial">${item.initial || item.name.slice(0, 1)}</span>
        <span>${item.kicker}</span>
      </div>
    </div>
    <div class="module-tagline">${item.kicker}</div>
    <h3 class="module-name">${item.name}</h3>
    <p class="module-summary">${item.summary}</p>
    <ul class="module-points">
      ${item.points.map((point) => `<li>${point}</li>`).join("")}
    </ul>
    <div class="module-tags">
      ${item.tags.map((tag) => `<span>${tag}</span>`).join("")}
    </div>
  `;
}

function renderQuotes() {
  const quotes = window.SITE_DATA.quotes;
  qs("quotes-kicker").textContent = quotes.kicker;
  qs("quotes-title").textContent = quotes.title;
  qs("quotes-grid").innerHTML = quotes.items.map((item) => (
    `<article class="quote-card">
      <blockquote>${item.text}</blockquote>
      <div class="quote-source">${item.source}</div>
    </article>`
  )).join("");
}

function renderArchive() {
  const archive = window.SITE_DATA.archive;
  qs("archive-kicker").textContent = archive.kicker;
  qs("archive-title").textContent = archive.title;
  qs("archive-note").textContent = archive.note;
  qs("archive-grid").innerHTML = archive.groups.map((group) => (
    `<article class="archive-card">
      <h3>${group.title}</h3>
      <p>${group.text}</p>
      <div class="archive-links">
        ${group.links.map((link) => (
          `<a class="archive-link" href="${link.href}"${linkAttrs(link.href)}>
            <span>${link.label}</span>
            <small>Open</small>
          </a>`
        )).join("")}
      </div>
    </article>`
  )).join("");
}

function syncActiveNav() {
  const links = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      const id = `#${entry.target.id}`;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === id);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach((section) => observer.observe(section));
}

function boot() {
  state.activeModuleId = window.SITE_DATA.modules.items[0]?.id || null;
  setHead();
  renderNav();
  renderHero();
  renderFocus();
  renderModuleFilters();
  renderModuleList();
  renderSpotlight();
  renderQuotes();
  renderArchive();
  syncActiveNav();
}

boot();
