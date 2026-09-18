/* 4Everyone app: hash-routed single page. Issue index in content/<issue>.json, sections in content/sections/*.json. */
(() => {
  'use strict';

  const ISSUE_URL = 'content/v1i1.json';
  const MEDIA_CACHE = '4e-media-v1';
  const PUBLIC_URL = 'https://drubhattacharya.github.io/4everyone-app/';
  // Inside the App Store / Google Play build (Capacitor) everything is bundled, so offline saving is unnecessary.
  const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const plugin = (name) => (NATIVE && window.Capacitor.Plugins ? window.Capacitor.Plugins[name] : null);
  if (NATIVE) document.documentElement.classList.add('is-native');

  const UI = {
    en: {
      skip: 'Skip to content', textSize: 'Larger text', close: 'Close',
      inIssue: 'In this issue', page: 'p.', pages: 'Magazine page',
      about: 'Published by Safety & Health Equity Partners, Queen Creek, Arizona. ISSN 3068-4021.',
      home: 'Home',
      breakLabel: 'Movement break', breakTitle: '4 moves · 2 minutes',
      breakBody: 'Play all four 30-second exercises back to back. No equipment needed.',
      start: 'Start', minutes: 'min', seconds: 'sec',
      references: 'References', disclaimer: 'Disclaimer',
      prev: 'Previous', next: 'Next', nextSection: 'Next section',
      moveOf: (n, t) => `Move ${n} of ${t}`,
      prevMove: 'Previous move', nextMove: 'Next move',
      doneTitle: 'Great job!', doneBody: 'You just finished a two-minute movement break.', again: 'Do it again',
      videoSoon: 'The full lesson video is coming soon to the app.',
      playVideo: 'Play video', listen: 'Listen', stop: 'Stop',
      ingredients: 'Ingredients', steps: 'Directions',
      kind: { video: 'Video', recipe: 'Recipe', audio: 'Audio', interview: 'Interview', read: 'Read', puzzle: 'Puzzle' },
      openImage: 'Open full size', opensNew: '(opens in a new tab)',
      offlineTitle: 'Save for offline', offlineBody: 'Keep the Fitness videos on this device so they play without an internet connection (about 6 MB).',
      issueOfflineTitle: 'Read offline', issueOfflineBody: 'Save the whole issue (articles, photos, audio and exercise videos) on this device. YouTube videos still need a connection. About 20 MB.',
      offlineSave: 'Save videos', issueOfflineSave: 'Save the issue', offlineSaving: 'Saving…', offlineSaved: 'Saved on this device', offlineError: 'Could not save. Check your connection and try again.',
      loadError: 'This section could not be loaded. Check your connection and try again.',
      notFound: 'Page not found.',
      search: 'Search', searchLabel: 'Search this issue', searchHint: 'Try “yoga”, “pozole”, “Alzheimer’s” or “guitar”.',
      results: (n) => `${n} result${n === 1 ? '' : 's'}`, noResults: 'No matches. Try a different word.',
      share: 'Share', linkCopied: 'Link copied', continueReading: 'Continue reading', privacy: 'Privacy policy',
      across: 'Across', down: 'Down', check: 'Check', revealWord: 'Reveal word', revealAll: 'Reveal all', clear: 'Clear',
      solved: 'Solved! Well done.', wrong: (n) => `${n} square${n === 1 ? '' : 's'} not right yet.`, incomplete: 'Keep going: some squares are still empty.',
      xwHelp: 'Tap a square or a clue, then type. Tap the same square again to switch between across and down.',
      cellLabel: (n, d, i) => `${n} ${d}, letter ${i}`
    },
    es: {
      skip: 'Ir al contenido', textSize: 'Texto más grande', close: 'Cerrar',
      inIssue: 'En este número', page: 'pág.', pages: 'Página de la revista',
      about: 'Publicado por Safety & Health Equity Partners, Queen Creek, Arizona.',
      home: 'Inicio',
      breakLabel: 'Pausa activa', breakTitle: '4 movimientos · 2 minutos',
      breakBody: 'Reproduce los cuatro ejercicios de 30 segundos seguidos. No necesitas equipamiento.',
      start: 'Comenzar', minutes: 'min', seconds: 's',
      references: 'Referencias', disclaimer: 'Descargo de responsabilidad',
      prev: 'Anterior', next: 'Siguiente', nextSection: 'Siguiente sección',
      moveOf: (n, t) => `Movimiento ${n} de ${t}`,
      prevMove: 'Movimiento anterior', nextMove: 'Siguiente movimiento',
      doneTitle: '¡Buen trabajo!', doneBody: 'Acabas de terminar una pausa activa de dos minutos.', again: 'Repetir',
      videoSoon: 'El vídeo de la clase completa estará disponible pronto en la aplicación.',
      playVideo: 'Reproducir vídeo', listen: 'Escuchar', stop: 'Detener',
      ingredients: 'Ingredientes', steps: 'Preparación',
      kind: { video: 'Vídeo', recipe: 'Receta', audio: 'Audio', interview: 'Entrevista', read: 'Leer', puzzle: 'Pasatiempo' },
      openImage: 'Ver en tamaño completo', opensNew: '(se abre en una pestaña nueva)',
      offlineTitle: 'Guardar sin conexión', offlineBody: 'Guarda los vídeos de Fitness en este dispositivo para verlos sin conexión a internet (unos 6 MB).',
      issueOfflineTitle: 'Leer sin conexión', issueOfflineBody: 'Guarda todo el número (artículos, fotos, audio y vídeos de ejercicios) en este dispositivo. Los vídeos de YouTube necesitan conexión. Unos 20 MB.',
      offlineSave: 'Guardar vídeos', issueOfflineSave: 'Guardar el número', offlineSaving: 'Guardando…', offlineSaved: 'Guardado en este dispositivo', offlineError: 'No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.',
      loadError: 'No se pudo cargar esta sección. Revisa tu conexión e inténtalo de nuevo.',
      notFound: 'Página no encontrada.',
      search: 'Buscar', searchLabel: 'Buscar en este número', searchHint: 'Prueba con «yoga», «pozole», «Alzheimer» o «guitarra».',
      results: (n) => `${n} resultado${n === 1 ? '' : 's'}`, noResults: 'Sin coincidencias. Prueba con otra palabra.',
      share: 'Compartir', linkCopied: 'Enlace copiado', continueReading: 'Seguir leyendo', privacy: 'Política de privacidad',
      across: 'Horizontal', down: 'Abajo', check: 'Comprobar', revealWord: 'Mostrar palabra', revealAll: 'Mostrar todo', clear: 'Borrar',
      solved: '¡Resuelto! Muy bien.', wrong: (n) => `${n} casilla${n === 1 ? '' : 's'} todavía no ${n === 1 ? 'es correcta' : 'son correctas'}.`, incomplete: 'Sigue así: aún quedan casillas vacías.',
      xwHelp: 'Toca una casilla o una pista y escribe. Vuelve a tocar la misma casilla para cambiar entre horizontal y abajo.',
      cellLabel: (n, d, i) => `${n} ${d}, letra ${i}`
    }
  };

  const ICON = {
    chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/></svg>'
  };
  const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  // ---------- Preferences ----------
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }
  };
  const urlLang = new URLSearchParams(location.search).get('lang');
  let lang = (urlLang === 'es' || urlLang === 'en') ? urlLang
    : store.get('4e.lang') || ((navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en');
  if (urlLang) store.set('4e.lang', lang);
  let bigText = store.get('4e.size') === 'lg';

  let issue = null;
  const sectionData = {}; // id -> loaded section JSON
  const main = document.getElementById('main');
  const t = (key, ...args) => { const v = UI[lang][key]; return typeof v === 'function' ? v(...args) : v; };
  const L = (obj) => (obj && typeof obj === 'object' && !Array.isArray(obj)) ? (obj[lang] || obj.en) : obj;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Escaped text plus **bold**, *italic* and [label](url).
  function inline(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|media\/)[^)\s]+)\)/g, (m, label, url) => {
        const ext = /^https?:/.test(url);
        return `<a href="${url}"${ext ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  }
  const paras = (s) => String(s || '').split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${inline(p)}</p>`).join('');

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

  // ---------- Data helpers ----------
  const sectionById = (id) => issue.sections.find((s) => s.id === id);
  const isInline = (s) => !s.src; // Fitness keeps its articles in the issue file

  async function loadSection(s) {
    if (isInline(s) || sectionData[s.id]) return;
    const res = await fetch(s.src);
    if (!res.ok) throw new Error(res.status);
    sectionData[s.id] = await res.json();
  }

  function articlesOf(s) {
    if (isInline(s)) return s.groups.flatMap((g) => g.articles).map((id) => ({ id, ...issue.articles[id] }));
    return sectionData[s.id]?.articles || [];
  }
  const introOf = (s) => (isInline(s) ? s.intro : sectionData[s.id]?.intro);

  function ytThumb(id) { return `media/img/yt/${id}.jpg`; }

  function coverOf(a) {
    if (a.video) return L(a.video.poster);
    if (a.cover) return a.cover;
    for (const b of a.blocks || []) {
      if (b.t === 'image') return (lang === 'es' && b.src_es) || b.src;
      if (b.t === 'youtube') return ytThumb((lang === 'es' && b.id_es) || b.id);
    }
    return null;
  }

  function kindOf(a) {
    if (a.video) return 'video';
    const types = new Set((a.blocks || []).map((b) => b.t));
    if (types.has('recipe')) return 'recipe';
    if (types.has('proverb') || types.has('audio')) return 'audio';
    if (types.has('qa')) return 'interview';
    if (types.has('youtube')) return 'video';
    return 'read';
  }

  function formatDuration(d) {
    const [m, s] = d.split(':').map(Number);
    if (m === 0) return `${s} ${t('seconds')}`;
    return s === 0 ? `${m} ${t('minutes')}` : d;
  }

  // ---------- Views: home ----------
  function viewHome() {
    const toc = issue.sections.map((s) => `
      <li><a href="#/${s.id}">
        <span><span class="toc__kicker">${esc(L(s.kicker))}</span><span class="toc__name">${esc(L(s.title))}</span></span>
        <span class="toc__page">${t('page')} ${s.page}</span>
      </a></li>`).join('');
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
        ${continueCard()}
        <h2 class="toc__title">${t('inIssue')}</h2>
        <ul class="toc">${toc}</ul>
        <div class="offline">
          <strong>${t('issueOfflineTitle')}</strong>
          <p>${t('issueOfflineBody')}</p>
          <div><button class="btn btn--ghost" type="button" id="saveOffline" data-scope="issue">${t('issueOfflineSave')}</button></div>
        </div>
        <div class="about"><p>${t('about')}</p><p><a href="${NATIVE ? PUBLIC_URL : ''}privacy.html?lang=${lang}" target="_blank" rel="noopener">${t('privacy')}</a> · <a href="mailto:dru@4everyone.health">dru@4everyone.health</a></p></div>
      </div>`;
  }

  function continueCard() {
    let last = null;
    try { last = JSON.parse(store.get('4e.last') || 'null'); } catch { /* ignore */ }
    const s = last && sectionById(last.s);
    if (!s || !last.title) return '';
    return `<a class="next-section continue" href="#/${s.id}/${esc(last.a)}"><small>${t('continueReading')} · ${esc(L(s.kicker))}</small><span>${esc(L(last.title))}</span>${ICON.chev}</a>`;
  }

  // ---------- Views: section ----------
  function cardFor(s, a) {
    const img = coverOf(a);
    const badge = a.duration
      ? `${ICON.play}${esc(formatDuration(a.duration))}`
      : `${kindOf(a) === 'video' ? ICON.play : ''}${esc(t('kind')[kindOf(a)])}`;
    return `
      <a class="card" href="#/${s.id}/${a.id}">
        <div class="card__media${img ? '' : ' card__media--blank'}">
          ${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : ''}
          <span class="card__badge">${badge}</span>
        </div>
        <div class="card__body">
          <p class="card__title">${esc(L(a.title))}</p>
          ${a.dek ? `<p class="card__dek">${esc(L(a.dek))}</p>` : ''}
        </div>
      </a>`;
  }

  function sectionHead(s) {
    return `
      <a class="back" href="#/">${ICON.back}${t('home')}</a>
      <p class="kicker">${esc(L(issue.issueLabel))} · ${t('page')} ${s.page}</p>
      <h1 class="h1">${esc(L(s.kicker))}</h1>
      <p class="lede">${esc(L(s.title))}</p>
      ${introOf(s) ? `<p>${inline(L(introOf(s)))}</p>` : ''}`;
  }

  function viewSection(s) {
    document.title = `${L(s.kicker)} · ${L(issue.brand)}`;
    let body;
    if (isInline(s)) {
      body = s.groups.map((g) => `
        ${g.routine ? `
          <div class="break">
            <p class="break__label">${t('breakLabel')}</p>
            <p class="break__title">${t('breakTitle')}</p>
            <p class="break__body">${t('breakBody')}</p>
            <div><button class="btn btn--light" type="button" data-routine="${g.articles.join(',')}">${ICON.play.replace('<svg', '<svg width="16" height="16"')} ${t('start')}</button></div>
          </div>` : ''}
        <h2 class="group__label">${esc(L(g.label))}</h2>
        <div class="cards">${g.articles.map((id) => cardFor(s, { id, ...issue.articles[id] })).join('')}</div>
      `).join('') + `
        <div class="offline">
          <strong>${t('offlineTitle')}</strong>
          <p>${t('offlineBody')}</p>
          <div><button class="btn btn--ghost" type="button" id="saveOffline" data-scope="fitness">${t('offlineSave')}</button></div>
        </div>`;
    } else {
      body = `<div class="cards cards--section">${articlesOf(s).map((a) => cardFor(s, a)).join('')}</div>`;
    }
    return `<div class="wrap page">${sectionHead(s)}${body}${nextSectionLink(s)}</div>`;
  }

  function nextSectionLink(s) {
    const i = issue.sections.indexOf(s);
    const n = issue.sections[i + 1];
    if (!n) return '';
    return `<a class="next-section" href="#/${n.id}"><small>${t('nextSection')}</small><span>${esc(L(n.kicker))}</span>${ICON.chev}</a>`;
  }

  // ---------- Views: article ----------
  function youtubeBlock(b) {
    const id = (lang === 'es' && b.id_es) || b.id;
    const title = L(b.title) || '';
    return `
      <figure class="media${b.vertical ? ' media--vertical' : ''}">
        <div class="yt" style="background-image:url('${esc(ytThumb(id))}')" data-yt="${esc(id)}">
          <button class="yt__btn" type="button" aria-label="${esc(t('playVideo'))}: ${esc(title)}"><span class="yt__play">${ICON.play}</span></button>
        </div>
        ${b.caption ? `<figcaption>${inline(L(b.caption))}</figcaption>` : ''}
      </figure>`;
  }

  function imageBlock(b) {
    const src = (lang === 'es' && b.src_es) || b.src;
    const cap = [b.caption && inline(L(b.caption)), b.credit && `<span class="credit">${inline(L(b.credit))}</span>`].filter(Boolean).join(' ');
    return `
      <figure class="figure">
        <button type="button" class="figure__zoom" data-zoom="${esc(src)}" aria-label="${esc(t('openImage'))}"><img src="${esc(src)}" alt="${esc(L(b.alt))}" loading="lazy"></button>
        ${cap ? `<figcaption>${cap}</figcaption>` : ''}
      </figure>`;
  }

  function audioBtn(src, label) {
    return `<button class="listen" type="button" data-audio="${esc(src)}">${ICON.play}<span>${esc(label || t('listen'))}</span></button>`;
  }

  const RTL = new Set(['ar', 'he']);
  function proverbBlock(b) {
    const code = (b.audio.match(/-([a-z]{2})\.mp3$/) || [])[1] || '';
    return `
      <div class="proverb">
        <p class="proverb__lang">${esc(L(b.language))}</p>
        <p class="proverb__original" lang="${code}"${RTL.has(code) ? ' dir="rtl"' : ''}>${esc(b.original)}</p>
        ${b.romanization ? `<p class="proverb__roman">${esc(b.romanization)}</p>` : ''}
        ${b.literal && L(b.literal) ? `<p class="proverb__literal">${inline(L(b.literal))}</p>` : ''}
        <p class="proverb__meaning">${inline(L(b.meaning))}</p>
        ${audioBtn(b.audio)}
      </div>`;
  }

  // ---------- Crossword ----------
  function xwCells(g) {
    const cells = new Map(); // "r,c" -> { a: letter, n?: number, words: {across?, down?} }
    for (const e of g.entries) {
      [...e.a].forEach((ch, i) => {
        const r = e.d === 'across' ? e.r : e.r + i;
        const c = e.d === 'across' ? e.c + i : e.c;
        const k = `${r},${c}`;
        const cell = cells.get(k) || { r, c, a: ch, words: {} };
        if (i === 0) cell.n = e.n;
        cell.words[e.d] = e;
        cells.set(k, cell);
      });
    }
    return cells;
  }

  function crosswordBlock(b) {
    const g = L(b.grid);
    const cells = xwCells(g);
    let grid = '';
    for (let r = 0; r < g.rows; r++) {
      for (let c = 0; c < g.cols; c++) {
        const cell = cells.get(`${r},${c}`);
        if (!cell) { grid += '<div class="xw__void"></div>'; continue; }
        const w = cell.words.across || cell.words.down;
        const idx = w.d === 'across' ? c - w.c + 1 : r - w.r + 1;
        grid += `<div class="xw__cell">${cell.n ? `<span class="xw__num">${cell.n}</span>` : ''}<input data-k="${r},${c}" maxlength="2" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="${esc(t('cellLabel', w.n, t(w.d), idx))}"></div>`;
      }
    }
    const list = (d) => g.entries.filter((e) => e.d === d).sort((x, y) => x.n - y.n)
      .map((e) => `<li><button type="button" class="xw__clue" data-clue="${e.d}-${e.n}"><b>${e.n}</b> ${esc(e.clue)} <span class="xw__len">(${e.a.length})</span></button></li>`).join('');
    return `
      <section class="xw" data-xw>
        <p class="xw__help">${t('xwHelp')}</p>
        <p class="xw__current" aria-live="polite"></p>
        <div class="xw__grid" style="grid-template-columns:repeat(${g.cols},1fr);max-width:${g.cols * 2.6}rem">${grid}</div>
        <div class="xw__actions">
          <button type="button" class="btn btn--primary" data-act="check">${t('check')}</button>
          <button type="button" class="btn btn--ghost" data-act="word">${t('revealWord')}</button>
          <button type="button" class="btn btn--ghost" data-act="all">${t('revealAll')}</button>
          <button type="button" class="btn btn--ghost" data-act="clear">${t('clear')}</button>
        </div>
        <p class="xw__status" role="status"></p>
        <div class="xw__lists">
          <div><h2 class="recipe__h">${t('across')}</h2><ol class="xw__list">${list('across')}</ol></div>
          <div><h2 class="recipe__h">${t('down')}</h2><ol class="xw__list">${list('down')}</ol></div>
        </div>
      </section>`;
  }

  function wireCrossword(root, b) {
    const g = L(b.grid);
    const cells = xwCells(g);
    const key = `4e.xw.${issue.id}.${lang}`;
    const inputs = new Map([...root.querySelectorAll('input[data-k]')].map((i) => [i.dataset.k, i]));
    const status = root.querySelector('.xw__status');
    const current = root.querySelector('.xw__current');
    let dir = 'across', active = null;

    try { const saved = JSON.parse(store.get(key) || '{}'); for (const [k, v] of Object.entries(saved)) if (inputs.get(k)) inputs.get(k).value = v; } catch { /* ignore */ }
    const save = () => store.set(key, JSON.stringify(Object.fromEntries([...inputs].filter(([, i]) => i.value).map(([k, i]) => [k, i.value]))));

    const wordOf = (k, d) => cells.get(k)?.words[d] || null;
    const keysOf = (e) => [...e.a].map((_, i) => (e.d === 'across' ? `${e.r},${e.c + i}` : `${e.r + i},${e.c}`));

    function highlight() {
      root.querySelectorAll('.xw__cell').forEach((el) => el.classList.remove('is-word', 'is-active'));
      root.querySelectorAll('.xw__clue').forEach((el) => el.classList.remove('is-active'));
      if (!active) return;
      const e = wordOf(active, dir);
      if (!e) return;
      keysOf(e).forEach((k) => inputs.get(k).parentElement.classList.add('is-word'));
      inputs.get(active).parentElement.classList.add('is-active');
      root.querySelector(`[data-clue="${e.d}-${e.n}"]`)?.classList.add('is-active');
      current.textContent = `${e.n} ${t(e.d)}: ${e.clue}`;
    }
    function focusCell(k) {
      const i = inputs.get(k); if (!i) return;
      active = k; highlight();
      i.focus({ preventScroll: false });
    }
    function step(delta) {
      const e = wordOf(active, dir); if (!e) return;
      const ks = keysOf(e); const i = ks.indexOf(active) + delta;
      if (i >= 0 && i < ks.length) focusCell(ks[i]);
    }
    function move(dr, dc) {
      let [r, c] = active.split(',').map(Number);
      for (let n = 0; n < Math.max(g.rows, g.cols); n++) {
        r += dr; c += dc;
        if (inputs.get(`${r},${c}`)) { focusCell(`${r},${c}`); return; }
      }
    }

    inputs.forEach((input, k) => {
      input.addEventListener('focus', () => {
        if (!wordOf(k, dir)) dir = dir === 'across' ? 'down' : 'across';
        active = k; highlight(); input.select();
      });
      input.addEventListener('pointerdown', () => {
        if (active === k && wordOf(k, dir === 'across' ? 'down' : 'across')) { dir = dir === 'across' ? 'down' : 'across'; highlight(); }
      });
      input.addEventListener('input', () => {
        if (active !== k) { active = k; highlight(); }
        const ch = norm(input.value).replace(/[^a-zñ]/g, '').slice(-1).toUpperCase();
        input.value = ch;
        input.parentElement.classList.remove('is-wrong', 'is-right');
        save();
        if (ch) step(1);
      });
      input.addEventListener('keydown', (ev) => {
        active = k;
        if (ev.key === 'Backspace' && !input.value) { ev.preventDefault(); step(-1); const p = inputs.get(active); if (p) { p.value = ''; save(); } }
        else if (ev.key === 'ArrowRight') { ev.preventDefault(); dir = 'across'; move(0, 1); }
        else if (ev.key === 'ArrowLeft') { ev.preventDefault(); dir = 'across'; move(0, -1); }
        else if (ev.key === 'ArrowDown') { ev.preventDefault(); dir = 'down'; move(1, 0); }
        else if (ev.key === 'ArrowUp') { ev.preventDefault(); dir = 'down'; move(-1, 0); }
      });
    });

    root.querySelectorAll('[data-clue]').forEach((btn) => btn.addEventListener('click', () => {
      const [d, n] = btn.dataset.clue.split('-');
      const e = g.entries.find((x) => x.d === d && String(x.n) === n);
      dir = d;
      const ks = keysOf(e);
      focusCell(ks.find((k) => !inputs.get(k).value) || ks[0]);
      root.querySelector('.xw__grid').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }));

    root.querySelectorAll('[data-act]').forEach((btn) => btn.addEventListener('click', () => {
      const act = btn.dataset.act;
      status.textContent = '';
      if (act === 'clear') {
        inputs.forEach((i) => { i.value = ''; i.parentElement.classList.remove('is-wrong', 'is-right'); });
      } else if (act === 'word' || act === 'all') {
        const e = active && wordOf(active, dir);
        const ks = act === 'all' ? [...inputs.keys()] : e ? keysOf(e) : [];
        ks.forEach((k) => { inputs.get(k).value = cells.get(k).a; inputs.get(k).parentElement.classList.add('is-right'); });
      } else if (act === 'check') {
        let wrong = 0, empty = 0;
        inputs.forEach((i, k) => {
          i.parentElement.classList.remove('is-wrong', 'is-right');
          if (!i.value) { empty++; return; }
          const ok = i.value === cells.get(k).a;
          i.parentElement.classList.add(ok ? 'is-right' : 'is-wrong');
          if (!ok) wrong++;
        });
        status.textContent = wrong ? t('wrong', wrong) : empty ? t('incomplete') : t('solved');
        status.classList.toggle('is-solved', !wrong && !empty);
      }
      save();
    }));
  }

  function renderBlock(b) {
    if (b.only && b.only !== lang) return '';
    switch (b.t) {
      case 'crossword': return crosswordBlock(b);
      case 'p': return `<p>${inline(L(b.text))}</p>`;
      case 'h': return `<h2 class="h2">${esc(L(b.text))}</h2>`;
      case 'quote': return `<blockquote class="quote">${paras(L(b.text))}${b.cite ? `<cite>${inline(L(b.cite))}</cite>` : ''}</blockquote>`;
      case 'list': {
        const tag = b.ordered ? 'ol' : 'ul';
        return `<${tag} class="list">${(L(b.items) || []).map((i) => `<li>${inline(i)}</li>`).join('')}</${tag}>`;
      }
      case 'image': return imageBlock(b);
      case 'youtube': return youtubeBlock(b);
      case 'audio': return `<div class="audio"><p class="audio__title">${esc(L(b.title))}</p><audio controls preload="none" src="${esc(b.src)}"></audio>${b.caption ? `<p class="audio__cap">${inline(L(b.caption))}</p>` : ''}</div>`;
      case 'recipe': return `
        <section class="recipe">
          ${b.meta && L(b.meta) ? `<p class="recipe__meta">${inline(L(b.meta))}</p>` : ''}
          <h2 class="recipe__h">${t('ingredients')}</h2>
          <ul class="recipe__ing">${(L(b.ingredients) || []).map((i) => `<li><label><input type="checkbox"><span>${inline(i)}</span></label></li>`).join('')}</ul>
          ${(L(b.steps) || []).length ? `
          <h2 class="recipe__h">${t('steps')}</h2>
          <ol class="recipe__steps">${L(b.steps).map((i) => `<li>${inline(i)}</li>`).join('')}</ol>` : ''}
        </section>`;
      case 'qa': return `<div class="qa"><p class="qa__q">${inline(L(b.q))}</p><div class="qa__a">${paras(L(b.a))}</div></div>`;
      case 'callout': return `<aside class="callout">${b.title && L(b.title) ? `<p class="callout__title">${esc(L(b.title))}</p>` : ''}${paras(L(b.text))}</aside>`;
      case 'table': return `
        <div class="table-wrap"><table>
          ${b.caption ? `<caption>${inline(L(b.caption))}</caption>` : ''}
          <thead><tr>${(L(b.head) || []).map((h) => `<th scope="col">${inline(h)}</th>`).join('')}</tr></thead>
          <tbody>${(L(b.rows) || []).map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>`;
      case 'link': {
        const href = (lang === 'es' && b.href_es) || b.href;
        return `<p><a class="btn btn--outline" href="${esc(href)}" target="_blank" rel="noopener">${esc(L(b.label))} ${ICON.ext}<span class="sr">${t('opensNew')}</span></a></p>`;
      }
      case 'download': {
        const href = (NATIVE ? PUBLIC_URL : '') + ((lang === 'es' && b.href_es) || b.href);
        return `<p><a class="btn btn--outline" href="${esc(href)}" target="_blank" rel="noopener">${ICON.down} ${esc(L(b.label))}</a></p>`;
      }
      case 'proverb': return proverbBlock(b);
      default: return '';
    }
  }

  function legacyVideo(a) {
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

  let currentArticle = null;
  function viewArticle(s, a) {
    document.title = `${L(a.title)} · ${L(issue.brand)}`;
    currentArticle = a;
    store.set('4e.last', JSON.stringify({ s: s.id, a: a.id, title: a.title }));
    const list = articlesOf(s);
    const i = list.findIndex((x) => x.id === a.id);
    const prev = list[i - 1], next = list[i + 1];
    const single = list.length === 1;
    const link = (x, cls, label) => x
      ? `<a class="${cls}" href="#/${s.id}/${x.id}"><small>${label}</small><span>${esc(L(x.title))}</span></a>` : '';
    const pages = a.pages || (a.page ? [a.page] : []);
    const meta = [
      a.duration && esc(formatDuration(a.duration)),
      pages.length && `${t('pages')} ${pages.join('–')}`
    ].filter(Boolean).map((m) => `<span>${m}</span>`).join('');
    const body = a.blocks
      ? a.blocks.map(renderBlock).join('')
      : L(a.body).map((p) => `<p>${esc(p)}</p>`).join('');
    const bio = a.bio ? `<aside class="bio"><img src="${esc(a.bio.photo)}" alt="" loading="lazy"><p>${esc(L(a.bio))}</p></aside>` : '';
    const refs = Array.isArray(a.references) ? a.references : L(a.references);
    const disclaimer = a.disclaimer === 'fitness' ? issue.disclaimerFitness : a.disclaimer === 'general' ? issue.disclaimerGeneral : null;
    return `
      <div class="wrap page">
        <a class="back" href="#/${single ? '' : s.id}">${ICON.back}${single ? t('home') : esc(L(s.kicker))}</a>
        ${a.video ? legacyVideo(a) : ''}
        <p class="kicker">${esc(L(s.kicker))}</p>
        <h1 class="h1 h1--article">${esc(L(a.title))}</h1>
        ${a.dek ? `<p class="lede">${inline(L(a.dek))}</p>` : ''}
        ${a.byline ? `<p class="byline">${inline(L(a.byline))}</p>` : ''}
        <div class="meta-row">
          ${meta ? `<p class="meta">${meta}</p>` : '<span></span>'}
          <button class="share" type="button" data-share>${ICON.share}<span>${t('share')}</span></button>
        </div>
        <div class="prose">${body}</div>
        ${bio}
        ${refs && refs.length ? `<details class="refs"><summary>${t('references')}</summary><ol>${refs.map((r) => `<li>${inline(r)}</li>`).join('')}</ol></details>` : ''}
        ${disclaimer ? `<p class="disclaimer"><strong>${t('disclaimer')}:</strong> ${esc(L(disclaimer))}</p>` : ''}
        ${single ? '' : `<nav class="pager" aria-label="${t('prev')} / ${t('next')}">${link(prev, 'prev', t('prev'))}${link(next, 'next', t('next'))}</nav>`}
        ${next ? '' : nextSectionLink(s)}
      </div>`;
  }

  // ---------- Search ----------
  const indexCache = {}; // lang -> [{s, a, title, kicker, text, ntitle, ntext}]
  const plain = (s) => String(s || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*+/g, '');

  function articleText(a) {
    if (!a.blocks) return [L(a.body)?.join(' '), a.bio && L(a.bio)].join(' ');
    const out = [a.dek && L(a.dek), a.byline && L(a.byline)];
    for (const b of a.blocks) {
      if (b.only && b.only !== lang) continue;
      for (const f of ['text', 'title', 'caption', 'q', 'a', 'meaning', 'literal', 'language', 'alt', 'label', 'cite']) if (b[f]) out.push(L(b[f]));
      for (const f of ['items', 'ingredients', 'steps', 'head']) if (b[f]) out.push((L(b[f]) || []).join(' '));
      if (b.rows) out.push((L(b.rows) || []).flat().join(' '));
      if (b.original) out.push(b.original, b.romanization || '');
      if (b.t === 'crossword') out.push(L(b.grid).entries.map((e) => e.clue).join(' '));
    }
    return plain(out.filter(Boolean).join(' '));
  }

  async function buildIndex() {
    if (indexCache[lang]) return indexCache[lang];
    await Promise.all(issue.sections.map((s) => loadSection(s).catch(() => {})));
    const idx = [];
    for (const s of issue.sections) {
      for (const a of articlesOf(s)) {
        const title = L(a.title), text = articleText(a);
        idx.push({ s, a, title, kicker: L(s.kicker), text, ntitle: norm(title + ' ' + L(s.kicker)), ntext: norm(text) });
      }
    }
    return (indexCache[lang] = idx);
  }

  function snippet(text, terms) {
    const n = norm(text);
    let at = -1;
    for (const term of terms) { at = n.indexOf(term); if (at >= 0) break; }
    if (at < 0) return esc(text.slice(0, 160)) + (text.length > 160 ? '…' : '');
    const start = Math.max(0, at - 70), end = Math.min(text.length, at + 110);
    let s = esc((start ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : ''));
    // Highlight on the original text using accent-insensitive positions.
    for (const term of terms) {
      const re = new RegExp(term.split('').map((ch) => `${ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\u0300-\\u036f]*`).join(''), 'gi');
      s = s.normalize('NFD').replace(re, (m) => `<mark>${m}</mark>`).normalize('NFC');
    }
    return s;
  }

  async function runSearch(q, box) {
    const terms = norm(q).split(/\s+/).filter((w) => w.length > 1);
    if (!terms.length) { box.innerHTML = `<p class="muted">${t('searchHint')}</p>`; return; }
    const idx = await buildIndex();
    const hits = idx.map((e) => {
      let score = 0;
      for (const term of terms) {
        const inTitle = e.ntitle.includes(term), inText = e.ntext.includes(term);
        if (!inTitle && !inText) return null;
        score += (inTitle ? 10 : 0) + (inText ? 1 + Math.min(e.ntext.split(term).length - 1, 5) : 0);
      }
      return { e, score };
    }).filter(Boolean).sort((x, y) => y.score - x.score);
    box.innerHTML = `<p class="muted">${hits.length ? t('results', hits.length) : t('noResults')}</p>` +
      `<ul class="results">${hits.slice(0, 40).map(({ e }) => `
        <li><a href="#/${e.s.id}/${e.a.id}">
          <span class="toc__kicker">${esc(e.kicker)}</span>
          <span class="results__title">${esc(e.title)}</span>
          <span class="results__snip">${snippet(e.text, terms)}</span>
        </a></li>`).join('')}</ul>`;
  }

  let lastQuery = '';
  function viewSearch() {
    document.title = `${t('search')} · ${L(issue.brand)}`;
    return `
      <div class="wrap page">
        <a class="back" href="#/">${ICON.back}${t('home')}</a>
        <h1 class="h1">${t('search')}</h1>
        <form class="search" role="search" onsubmit="return false">
          <label class="sr" for="q">${t('searchLabel')}</label>
          <input id="q" type="search" enterkeyhint="search" autocomplete="off" placeholder="${esc(t('searchLabel'))}" value="${esc(lastQuery)}">
        </form>
        <div id="results" aria-live="polite"></div>
      </div>`;
  }

  // ---------- Sharing and reading position ----------
  async function shareCurrent(btn) {
    const url = `${PUBLIC_URL}?lang=${lang}${location.hash}`;
    const title = document.title;
    try {
      const Share = plugin('Share');
      if (Share) { await Share.share({ title, url }); return; }
      if (navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url);
      const label = btn.querySelector('span');
      label.textContent = t('linkCopied');
      setTimeout(() => { if (btn.isConnected) label.textContent = t('share'); }, 2000);
    } catch { /* user cancelled */ }
  }

  // ---------- Image viewer ----------
  const zoom = document.createElement('div');
  zoom.className = 'zoom'; zoom.hidden = true;
  zoom.setAttribute('role', 'dialog'); zoom.setAttribute('aria-modal', 'true');
  zoom.innerHTML = '<button type="button" class="zoom__close"></button><img alt="">';
  document.body.appendChild(zoom);
  let zoomOpener = null;
  function openZoom(btn) {
    zoomOpener = btn;
    const img = zoom.querySelector('img');
    img.src = btn.dataset.zoom;
    img.alt = btn.querySelector('img').alt;
    zoom.querySelector('.zoom__close').textContent = t('close');
    zoom.hidden = false; document.body.style.overflow = 'hidden';
    zoom.querySelector('.zoom__close').focus();
  }
  function closeZoom() {
    if (zoom.hidden) return false;
    zoom.hidden = true; document.body.style.overflow = '';
    zoomOpener?.focus?.();
    return true;
  }
  zoom.addEventListener('click', closeZoom);

  function viewMessage(msg) {
    return `<div class="wrap page"><a class="back" href="#/">${ICON.back}${t('home')}</a><p>${msg}</p></div>`;
  }

  // ---------- Router ----------
  let lastRoute = null;
  let renderToken = 0;
  async function render() {
    if (!issue) return;
    const token = ++renderToken;
    stopAudio();
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const qm = location.hash.match(/^#\/search\?q=(.*)$/);
    if (qm) lastQuery = decodeURIComponent(qm[1]);
    const s = parts[0] && sectionById(parts[0]);
    let html;
    if (!parts.length) html = viewHome();
    else if (parts[0].startsWith('search')) html = viewSearch();
    else if (!s) html = viewMessage(t('notFound'));
    else {
      try { await loadSection(s); } catch { if (token === renderToken) { main.innerHTML = viewMessage(t('loadError')); } return; }
      if (token !== renderToken) return;
      const list = articlesOf(s);
      if (!parts[1]) html = list.length === 1 && !isInline(s) ? viewArticle(s, list[0]) : viewSection(s);
      else {
        const a = list.find((x) => x.id === parts[1]);
        html = a ? viewArticle(s, a) : viewMessage(t('notFound'));
      }
    }
    main.innerHTML = html;
    const route = location.hash;
    if (route !== lastRoute) { window.scrollTo(0, 0); if (lastRoute !== null) main.focus({ preventScroll: true }); }
    lastRoute = route;
    wireView();
  }

  function wireView() {
    main.querySelectorAll('[data-yt]').forEach((box) => {
      const btn = box.querySelector('button');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const id = box.dataset.yt;
        const params = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1', modestbranding: '1', hl: lang, cc_lang_pref: lang });
        box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}" title="YouTube" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      });
    });
    main.querySelectorAll('[data-audio]').forEach((b) => b.addEventListener('click', () => toggleAudio(b)));
    main.querySelectorAll('[data-share]').forEach((b) => b.addEventListener('click', () => shareCurrent(b)));
    main.querySelectorAll('[data-zoom]').forEach((b) => b.addEventListener('click', () => openZoom(b)));
    if (NATIVE) main.querySelectorAll('.offline').forEach((el) => { el.hidden = true; });
    const xw = main.querySelector('[data-xw]');
    const xwBlock = xw && currentArticle?.blocks?.find((b) => b.t === 'crossword');
    if (xwBlock) wireCrossword(xw, xwBlock);
    const q = document.getElementById('q');
    if (q) {
      const box = document.getElementById('results');
      let timer;
      q.addEventListener('input', () => {
        lastQuery = q.value;
        history.replaceState(null, '', `#/search?q=${encodeURIComponent(q.value)}`);
        clearTimeout(timer); timer = setTimeout(() => runSearch(q.value, box), 150);
      });
      runSearch(q.value, box);
      if (!q.value) q.focus();
    }
    main.querySelectorAll('[data-routine]').forEach((b) => b.addEventListener('click', () => openRoutine(b.dataset.routine.split(','))));
    const save = document.getElementById('saveOffline');
    if (save) wireOffline(save);
  }

  // ---------- Short audio clips (proverbs) ----------
  const clip = new Audio();
  let clipBtn = null;
  function setListen(btn, playing) {
    btn.classList.toggle('is-playing', playing);
    btn.innerHTML = `${playing ? ICON.stop : ICON.play}<span>${playing ? t('stop') : t('listen')}</span>`;
  }
  function stopAudio() { clip.pause(); if (clipBtn) setListen(clipBtn, false); clipBtn = null; }
  function toggleAudio(btn) {
    if (clipBtn === btn) { stopAudio(); return; }
    stopAudio();
    clipBtn = btn; setListen(btn, true);
    clip.src = btn.dataset.audio; clip.currentTime = 0;
    clip.play().catch(() => stopAudio());
  }
  clip.addEventListener('ended', stopAudio);

  // ---------- Offline saving ----------
  async function offlineUrls(scope) {
    const fitness = sectionById('fitness');
    const vids = fitness.groups.flatMap((g) => g.articles).map((id) => issue.articles[id].video).filter((v) => v.type === 'file');
    if (scope === 'fitness') return vids.map((v) => L(v.src));
    const urls = new Set(['media/img/cover-en.jpg', 'media/img/cover-es.jpg']);
    vids.forEach((v) => { urls.add(L(v.src)); urls.add(L(v.poster)); });
    for (const s of issue.sections) {
      if (isInline(s)) continue;
      await loadSection(s);
      urls.add(s.src);
      for (const a of articlesOf(s)) {
        if (a.cover) urls.add(a.cover);
        for (const b of a.blocks || []) {
          if (b.t === 'image') urls.add((lang === 'es' && b.src_es) || b.src);
          if (b.t === 'youtube') urls.add(ytThumb((lang === 'es' && b.id_es) || b.id));
          if (b.t === 'audio' || b.t === 'proverb') urls.add(b.src || b.audio);
          if (b.t === 'download') urls.add((lang === 'es' && b.href_es) || b.href);
        }
      }
    }
    return [...urls];
  }

  async function wireOffline(btn) {
    const box = btn.closest('.offline');
    if (!('caches' in window)) { box.hidden = true; return; }
    const scope = btn.dataset.scope;
    const idle = scope === 'issue' ? 'issueOfflineSave' : 'offlineSave';
    const setState = (key, disabled) => { btn.textContent = t(key); btn.disabled = disabled; };
    let urls;
    try {
      urls = (await offlineUrls(scope)).map((u) => new URL(u, location.href).href);
      const cache = await caches.open(MEDIA_CACHE);
      const hits = await Promise.all(urls.map((u) => cache.match(u)));
      if (hits.every(Boolean)) setState('offlineSaved', true);
    } catch { /* storage blocked or offline */ }
    btn.addEventListener('click', async () => {
      setState('offlineSaving', true);
      try {
        if (!urls) urls = (await offlineUrls(scope)).map((u) => new URL(u, location.href).href);
        const cache = await caches.open(MEDIA_CACHE);
        // One at a time with a retry, so a flaky connection keeps whatever already saved.
        let done = 0;
        for (const u of urls) {
          if (!(await cache.match(u))) {
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
          done++;
          if (urls.length > 10) btn.textContent = `${t('offlineSaving')} ${Math.round((done / urls.length) * 100)}%`;
        }
        if (navigator.storage?.persist) navigator.storage.persist();
        setState('offlineSaved', true);
      } catch {
        setState('offlineError', false);
        setTimeout(() => { if (btn.isConnected) setState(idle, false); }, 4000);
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
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!closeZoom() && !R.root.hidden) closeRoutine();
  });

  // Android hardware back button: close overlays, then go back, then leave the app.
  const App = plugin('App');
  if (App) {
    App.addListener('backButton', () => {
      if (closeZoom()) return;
      if (!R.root.hidden) { closeRoutine(); return; }
      if (location.hash && location.hash !== '#/') history.back(); else App.exitApp();
    });
  }

  // ---------- Boot ----------
  applyPrefs();
  window.addEventListener('hashchange', () => { if (!R.root.hidden) closeRoutine(); render(); });
  fetch(ISSUE_URL)
    .then((r) => r.json())
    .then((data) => { issue = data; render(); })
    .catch(() => { main.innerHTML = `<div class="wrap page"><p>${t('loadError')}</p></div>`; });

  if (!NATIVE && 'serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
