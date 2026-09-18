/* 4Everyone app: hash-routed single page. Content lives in content/<issue>.json. */
(() => {
  'use strict';

  const ISSUE_URL = 'content/v1i1.json';
  const MEDIA_CACHE = '4e-media-v1';

  const UI = {
    en: {
      skip: 'Skip to content', textSize: 'Larger text', close: 'Close',
      inIssue: 'In this issue', available: 'Read now', soon: 'Coming soon',
      soonNote: 'This prototype includes the Fitness section. The rest of the issue will follow.',
      about: 'Published by Safety & Health Equity Partners, Queen Creek, Arizona. ISSN 3068-4021.',
      back: 'Back', home: 'Home',
      breakLabel: 'Movement break', breakTitle: '4 moves · 2 minutes',
      breakBody: 'Play all four 30-second exercises back to back. No equipment needed.',
      start: 'Start', page: 'Magazine page', minutes: 'min', seconds: 'sec',
      references: 'References', disclaimer: 'Disclaimer',
      prev: 'Previous', next: 'Next',
      moveOf: (n, t) => `Move ${n} of ${t}`,
      prevMove: 'Previous move', nextMove: 'Next move',
      doneTitle: 'Great job!', doneBody: 'You just finished a two-minute movement break.', again: 'Do it again',
      videoSoon: 'The full lesson video is coming soon to the app.',
      playVideo: 'Play video',
      offlineTitle: 'Save for offline', offlineBody: 'Keep the Fitness videos on this device so they play without an internet connection (about 6 MB).',
      offlineSave: 'Save videos', offlineSaving: 'Saving…', offlineSaved: 'Saved on this device', offlineError: 'Could not save. Check your connection and try again.',
      notFound: 'Page not found.'
    },
    es: {
      skip: 'Ir al contenido', textSize: 'Texto más grande', close: 'Cerrar',
      inIssue: 'En este número', available: 'Leer ahora', soon: 'Próximamente',
      soonNote: 'Este prototipo incluye la sección de Fitness. El resto del número llegará pronto.',
      about: 'Publicado por Safety & Health Equity Partners, Queen Creek, Arizona.',
      back: 'Volver', home: 'Inicio',
      breakLabel: 'Pausa activa', breakTitle: '4 movimientos · 2 minutos',
      breakBody: 'Reproduce los cuatro ejercicios de 30 segundos seguidos. No necesitas equipamiento.',
      start: 'Comenzar', page: 'Página de la revista', minutes: 'min', seconds: 's',
      references: 'Referencias', disclaimer: 'Descargo de responsabilidad',
      prev: 'Anterior', next: 'Siguiente',
      moveOf: (n, t) => `Movimiento ${n} de ${t}`,
      prevMove: 'Movimiento anterior', nextMove: 'Siguiente movimiento',
      doneTitle: '¡Buen trabajo!', doneBody: 'Acabas de terminar una pausa activa de dos minutos.', again: 'Repetir',
      videoSoon: 'El vídeo de la clase completa estará disponible pronto en la aplicación.',
      playVideo: 'Reproducir vídeo',
      offlineTitle: 'Guardar sin conexión', offlineBody: 'Guarda los vídeos de Fitness en este dispositivo para verlos sin conexión a internet (unos 6 MB).',
      offlineSave: 'Guardar vídeos', offlineSaving: 'Guardando…', offlineSaved: 'Guardado en este dispositivo', offlineError: 'No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.',
      notFound: 'Página no encontrada.'
    }
  };

  const ICON = {
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>'
  };

  // ---------- Preferences ----------
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }
  };
  let lang = store.get('4e.lang') || ((navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en');
  let bigText = store.get('4e.size') === 'lg';

  let issue = null;
  const main = document.getElementById('main');
  const t = (key, ...args) => { const v = UI[lang][key]; return typeof v === 'function' ? v(...args) : v; };
  const L = (obj) => (obj && typeof obj === 'object' && !Array.isArray(obj)) ? (obj[lang] || obj.en) : obj;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function applyPrefs() {
    document.documentElement.lang = lang;
    document.documentElement.dataset.size = bigText ? 'lg' : '';
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    const sizeBtn = document.getElementById('textSize');
    sizeBtn.setAttribute('aria-pressed', String(bigText));
    sizeBtn.title = t('textSize');
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  }

  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => {
    if (lang === b.dataset.lang) return;
    lang = b.dataset.lang; store.set('4e.lang', lang); applyPrefs(); render();
  }));
  document.getElementById('textSize').addEventListener('click', () => {
    bigText = !bigText; store.set('4e.size', bigText ? 'lg' : ''); applyPrefs();
  });

  // ---------- Views ----------
  function viewHome() {
    const toc = issue.sections.map((s) => {
      const text = `<span><span class="toc__kicker">${esc(L(s.kicker))}</span><span class="toc__name">${esc(L(s.title))}</span></span>`;
      return s.available
        ? `<li><a href="#/${s.id}">${text}<span class="pill pill--live">${t('available')}</span></a></li>`
        : `<li><div class="toc__row">${text}<span class="pill">${t('soon')}</span></div></li>`;
    }).join('');
    document.title = `${L(issue.brand)} · ${L(issue.issueLabel)}`;
    return `
      <div class="wrap page">
        <section class="hero">
          <img class="hero__cover" src="${esc(L(issue.cover))}" alt="${esc(L(issue.brand))} ${esc(L(issue.issueLabel))}" width="900" height="1200">
          <div>
            <p class="hero__issue">${esc(L(issue.brand))} · ${esc(L(issue.issueLabel))}</p>
            <h1 class="h1">${esc(L(issue.tagline))}</h1>
            <p class="hero__motto">${esc(L(issue.motto))}</p>
          </div>
        </section>
        <h2 class="toc__title">${t('inIssue')}</h2>
        <p class="muted" style="margin:0">${t('soonNote')}</p>
        <ul class="toc">${toc}</ul>
        <div class="about"><p>${t('about')}</p></div>
      </div>`;
  }

  function cardFor(id) {
    const a = issue.articles[id];
    const thumb = L(a.video.poster);
    return `
      <a class="card" href="#/${a.section}/${id}">
        <div class="card__media">
          <img src="${esc(thumb)}" alt="" loading="lazy">
          <span class="card__badge">${ICON.play}${esc(formatDuration(a.duration))}</span>
        </div>
        <div class="card__body"><p class="card__title">${esc(L(a.title))}</p></div>
      </a>`;
  }

  function viewSection(section) {
    document.title = `${L(section.kicker)} · ${L(issue.brand)}`;
    const groups = section.groups.map((g) => `
      ${g.routine ? `
        <div class="break">
          <p class="break__label">${t('breakLabel')}</p>
          <p class="break__title">${t('breakTitle')}</p>
          <p class="break__body">${t('breakBody')}</p>
          <div><button class="btn btn--light" type="button" data-routine="${g.articles.join(',')}">${ICON.play.replace('<svg', '<svg width="16" height="16"')} ${t('start')}</button></div>
        </div>` : ''}
      <h2 class="group__label">${esc(L(g.label))}</h2>
      <div class="cards">${g.articles.map(cardFor).join('')}</div>
    `).join('');
    const localVideos = offlineUrls(section);
    return `
      <div class="wrap page">
        <a class="back" href="#/">${ICON.back}${t('home')}</a>
        <p class="kicker">${esc(L(issue.issueLabel))}</p>
        <h1 class="h1">${esc(L(section.kicker))}</h1>
        <p class="lede">${esc(L(section.title))}</p>
        <p>${esc(L(section.intro))}</p>
        ${groups}
        ${localVideos.length ? `
        <div class="offline">
          <strong>${t('offlineTitle')}</strong>
          <p>${t('offlineBody')}</p>
          <div><button class="btn btn--ghost" type="button" id="saveOffline" data-section="${section.id}">${t('offlineSave')}</button></div>
        </div>` : ''}
      </div>`;
  }

  function videoBlock(a) {
    const v = a.video;
    if (v.type === 'file') {
      return `<div class="player"><video controls playsinline preload="metadata" poster="${esc(L(v.poster))}" src="${esc(L(v.src))}"></video></div>`;
    }
    const id = L(v.id);
    const poster = `style="background-image:url('${esc(L(v.poster))}')"`;
    if (!id) return `<div class="player"><div class="yt" ${poster}><p class="yt__note">${t('videoSoon')}</p></div></div>`;
    return `<div class="player"><div class="yt" ${poster} data-yt="${esc(id)}">
      <button class="yt__btn" type="button" aria-label="${t('playVideo')}"><span class="yt__play">${ICON.play}</span></button>
    </div></div>`;
  }

  function viewArticle(section, id) {
    const a = issue.articles[id];
    document.title = `${L(a.title)} · ${L(issue.brand)}`;
    const order = section.groups.flatMap((g) => g.articles);
    const i = order.indexOf(id);
    const prev = order[i - 1], next = order[i + 1];
    const link = (aid, cls, label) => aid
      ? `<a class="${cls}" href="#/${section.id}/${aid}"><small>${label}</small><span>${esc(L(issue.articles[aid].title))}</span></a>` : '';
    const bio = a.bio ? `<aside class="bio"><img src="${esc(a.bio.photo)}" alt="" loading="lazy"><p>${esc(L(a.bio))}</p></aside>` : '';
    return `
      <div class="wrap page">
        <a class="back" href="#/${section.id}">${ICON.back}${esc(L(section.kicker))}</a>
        ${videoBlock(a)}
        <p class="kicker">${esc(L(section.kicker))}</p>
        <h1 class="h1">${esc(L(a.title))}</h1>
        <p class="meta"><span>${esc(formatDuration(a.duration))}</span><span>${t('page')} ${a.page}</span></p>
        <div class="prose">${L(a.body).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        ${bio}
        <details class="refs"><summary>${t('references')}</summary>
          <ol>${a.references.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
        </details>
        <p class="disclaimer"><strong>${t('disclaimer')}:</strong> ${esc(L(issue.disclaimer))}</p>
        <nav class="pager" aria-label="${t('prev')} / ${t('next')}">
          ${link(prev, 'prev', t('prev'))}${link(next, 'next', t('next'))}
        </nav>
      </div>`;
  }

  function viewNotFound() {
    return `<div class="wrap page"><a class="back" href="#/">${ICON.back}${t('home')}</a><p>${t('notFound')}</p></div>`;
  }

  function formatDuration(d) {
    const [m, s] = d.split(':').map(Number);
    if (m === 0) return `${s} ${t('seconds')}`;
    return s === 0 ? `${m} ${t('minutes')}` : d;
  }

  // ---------- Router ----------
  let lastRoute = null;
  function render() {
    if (!issue) return;
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const section = parts[0] && issue.sections.find((s) => s.id === parts[0] && s.available);
    let html;
    if (!parts.length) html = viewHome();
    else if (section && !parts[1]) html = viewSection(section);
    else if (section && issue.articles[parts[1]]?.section === section.id) html = viewArticle(section, parts[1]);
    else html = viewNotFound();
    main.innerHTML = html;
    const route = location.hash;
    if (route !== lastRoute) { window.scrollTo(0, 0); if (lastRoute !== null) main.focus({ preventScroll: true }); }
    lastRoute = route;
    wireView();
  }

  function wireView() {
    main.querySelectorAll('[data-yt]').forEach((box) => {
      box.querySelector('button').addEventListener('click', () => {
        const id = box.dataset.yt;
        const params = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1', modestbranding: '1', hl: lang, cc_lang_pref: lang });
        box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      });
    });
    main.querySelectorAll('[data-routine]').forEach((b) => b.addEventListener('click', () => openRoutine(b.dataset.routine.split(','))));
    const save = document.getElementById('saveOffline');
    if (save) wireOffline(save, issue.sections.find((s) => s.id === save.dataset.section));
  }

  // ---------- Offline saving ----------
  function offlineUrls(section) {
    return section.groups.flatMap((g) => g.articles)
      .map((id) => issue.articles[id].video)
      .filter((v) => v.type === 'file')
      .map((v) => L(v.src));
  }

  async function wireOffline(btn, section) {
    if (!('caches' in window)) { btn.closest('.offline').hidden = true; return; }
    const urls = offlineUrls(section).map((u) => new URL(u, location.href).href);
    const setState = (key, disabled) => { btn.textContent = t(key); btn.disabled = disabled; };
    try {
      const cache = await caches.open(MEDIA_CACHE);
      const hits = await Promise.all(urls.map((u) => cache.match(u)));
      if (hits.every(Boolean)) setState('offlineSaved', true);
    } catch { /* storage blocked */ }
    btn.addEventListener('click', async () => {
      setState('offlineSaving', true);
      try {
        const cache = await caches.open(MEDIA_CACHE);
        // One at a time with a retry, so a flaky connection keeps whatever already saved.
        for (const u of urls) {
          if (await cache.match(u)) continue;
          for (let attempt = 0; ; attempt++) {
            try {
              const res = await fetch(u, { cache: 'reload' });
              if (!res.ok) throw new Error(res.status);
              await cache.put(u, res);
              break;
            } catch (err) {
              if (attempt >= 1) throw err;
            }
          }
        }
        if (navigator.storage?.persist) navigator.storage.persist();
        setState('offlineSaved', true);
      } catch {
        setState('offlineError', false);
      }
    });
  }

  // ---------- Movement-break routine ----------
  const R = {
    root: document.getElementById('routine'),
    video: document.getElementById('routineVideo'),
    title: document.getElementById('routineTitle'),
    count: document.getElementById('routineCount'),
    steps: document.getElementById('routineSteps'),
    done: document.getElementById('routineDone'),
    ids: [], i: 0, opener: null
  };

  function openRoutine(ids) {
    R.ids = ids; R.opener = document.activeElement;
    R.root.hidden = false;
    document.body.style.overflow = 'hidden';
    playStep(0);
    document.getElementById('routineClose').focus();
  }
  function closeRoutine() {
    R.video.pause(); R.video.removeAttribute('src'); R.video.load();
    R.root.hidden = true; document.body.style.overflow = '';
    R.opener?.focus?.();
  }
  function playStep(i) {
    R.i = Math.max(0, Math.min(i, R.ids.length - 1));
    const a = issue.articles[R.ids[R.i]];
    R.done.hidden = true;
    R.title.textContent = L(a.title);
    R.count.textContent = t('moveOf', R.i + 1, R.ids.length);
    R.steps.innerHTML = R.ids.map((id, k) =>
      `<li class="${k < R.i ? 'is-done' : k === R.i ? 'is-now' : ''}">${esc(L(issue.articles[id].title))}</li>`).join('');
    R.video.poster = L(a.video.poster);
    R.video.src = L(a.video.src);
    R.video.play().catch(() => { /* user can press play */ });
    document.getElementById('routinePrev').disabled = R.i === 0;
    document.getElementById('routineNext').disabled = R.i === R.ids.length - 1;
  }
  R.video.addEventListener('ended', () => {
    if (R.i < R.ids.length - 1) playStep(R.i + 1);
    else {
      R.steps.querySelectorAll('li').forEach((li) => { li.className = 'is-done'; });
      R.done.hidden = false;
      document.getElementById('routineAgain').focus();
    }
  });
  document.getElementById('routinePrev').addEventListener('click', () => playStep(R.i - 1));
  document.getElementById('routineNext').addEventListener('click', () => playStep(R.i + 1));
  document.getElementById('routineAgain').addEventListener('click', () => playStep(0));
  document.getElementById('routineClose').addEventListener('click', closeRoutine);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !R.root.hidden) closeRoutine(); });

  // ---------- Boot ----------
  applyPrefs();
  window.addEventListener('hashchange', () => { if (!R.root.hidden) closeRoutine(); render(); });
  fetch(ISSUE_URL)
    .then((r) => r.json())
    .then((data) => { issue = data; render(); })
    .catch(() => { main.innerHTML = `<div class="wrap page"><p>${t('offlineError')}</p></div>`; });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
