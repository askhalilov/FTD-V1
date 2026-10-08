(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pageReady = false;

  // Decode the first-screen artwork before revealing the composition. A failed
  // request, unsupported decode(), or a slow connection must never lock the page.
  function imageReady(image) {
    if (!image) return Promise.resolve();
    const loaded = image.complete ? Promise.resolve() : new Promise((resolve) => {
      function finish() {
        image.removeEventListener('load', finish);
        image.removeEventListener('error', finish);
        resolve();
      }
      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
    });
    return loaded.then(() => image.decode?.()).catch(() => {});
  }

  const artwork = new Image();
  artwork.src = new URL('assets/mascot-developer.webp', document.baseURI).href;
  const firstScreenReady = Promise.all([
    imageReady(artwork),
    imageReady(document.querySelector('.brand img')),
    document.fonts?.ready.catch(() => {})
  ]);

  function enableSectionReveals() {
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    elements.forEach((element) => observer.observe(element));
    root.classList.add('reveal-enabled');
  }

  const ready = new Promise((resolve) => {
    const timeout = setTimeout(resolve, reducedMotion ? 1000 : 2500);
    firstScreenReady.then(() => {
      clearTimeout(timeout);
      resolve();
    });
  }).then(() => {
    pageReady = true;
    root.classList.remove('is-loading');
    root.classList.add('is-ready');
    enableSectionReveals();
  });

  const translations = {
    en: {
      statusTag: 'WEBSITE IN PROGRESS',
      eyebrow: 'THE NEXT CHAPTER IS LOADING',
      subheading: 'BUILDING SOMETHING BOLD',
      subtext: 'New website. Same vision. More to come.',
      cta: 'LET\'S CONNECT',
      scroll: 'SCROLL<br />TO EXPLORE',
      sectionStatus: 'WORK IN PROGRESS / 002',
      sectionTitle1: 'GREAT THINGS',
      sectionTitle2: 'TAKE BUILDING.',
      sectionText: 'Our next digital chapter is on the way.<br />Until then, we\'re one message away.',
      sectionCta: 'CONTACT US',
      footerTag: 'PERFORMANCE / CONNECTION / GROWTH',
      backTop: 'BACK TO TOP ↑'
    },
    ru: {
      statusTag: 'САЙТ В РАЗРАБОТКЕ',
      eyebrow: 'СЛЕДУЮЩАЯ ГЛАВА ЗАГРУЖАЕТСЯ',
      subheading: 'СОЗДАЁМ ЧТО-ТО СИЛЬНОЕ',
      subtext: 'Новый сайт. То же видение. Скоро покажем больше.',
      cta: 'СВЯЗАТЬСЯ С НАМИ',
      scroll: 'ЛИСТАЙ<br />НИЖЕ',
      sectionStatus: 'РАБОТА В ПРОЦЕССЕ / 002',
      sectionTitle1: 'БОЛЬШИМ ИДЕЯМ',
      sectionTitle2: 'НУЖНО ВРЕМЯ.',
      sectionText: 'Наша следующая цифровая глава уже в пути.<br />А пока мы на расстоянии одного сообщения.',
      sectionCta: 'СВЯЗАТЬСЯ С НАМИ',
      footerTag: 'ПЕРФОРМАНС / СВЯЗЬ / РОСТ',
      backTop: 'НАВЕРХ ↑'
    }
  };

  const langSwitch = document.querySelector('.lang-switch');
  const langButtons = document.querySelectorAll('.lang-btn');
  const translatedNodes = document.querySelectorAll('[data-i18n]');

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    langSwitch?.setAttribute('data-active', lang);

    translatedNodes.forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (!key || !dict[key]) return;
      node.innerHTML = dict[key];
    });

    langButtons.forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    try { localStorage.setItem('ftdlab-lang', lang); } catch (_) {}
  }

  langButtons.forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang || 'en'));
  });

  let preferredLang = 'ru';
  try {
    preferredLang = localStorage.getItem('ftdlab-lang') || preferredLang;
  } catch (_) {}
  applyLanguage(preferredLang);

  const codeHolder = document.getElementById('code-lines');
  const cursor = document.getElementById('code-cursor');
  const label = document.getElementById('editor-status');
  if (!codeHolder || !cursor) return;

  const snippets = [
    [
      'const ftdlab = {',
      '  status: "building",',
      '  focus: "performance",',
      '  network: "iGaming CPA",',
      '  launch: "soon"',
      '};'
    ],
    [
      'const growth = {',
      '  traffic: "quality",',
      '  scaling: "active",',
      '  partners: "direct",',
      '  result: "loading"',
      '};'
    ],
    [
      'export const mission = {',
      '  connect: true,',
      '  convert: true,',
      '  build: "future",',
      '  status: "coming soon"',
      '};'
    ]
  ];

  const NS = 'http://www.w3.org/2000/svg';
  let snippetIndex = 0;
  let phase = 'typing';
  let elapsedChars = reducedMotion ? snippets[0].join('\n').length : 0;
  let timerId;

  const colorize = (line) => {
    const segments = line.split(/("[^"]*"|\b(?:const|export|true|false)\b)/g);
    return segments.filter(Boolean).map((text) => ({
      text,
      color: /^"/.test(text) ? '#18d9ef' : /^(const|export|true|false)$/.test(text) ? '#f4f9fb' : '#d5e6ec'
    }));
  };

  const drawCode = (lines, chars) => {
    codeHolder.replaceChildren();
    let remaining = chars;
    let lastText;
    let finalY = 27;

    for (let i = 0; i < lines.length && remaining >= 0; i++) {
      const visibleLine = lines[i].slice(0, remaining);
      remaining -= lines[i].length + 1;
      const y = 27 + i * 23.4;
      finalY = y;

      const number = document.createElementNS(NS, 'text');
      number.setAttribute('x', '14');
      number.setAttribute('y', String(y));
      number.setAttribute('fill', '#627983');
      number.setAttribute('font-size', '11');
      number.textContent = String(i + 1);
      codeHolder.append(number);

      const codeText = document.createElementNS(NS, 'text');
      codeText.setAttribute('x', '34');
      codeText.setAttribute('y', String(y));
      codeText.setAttribute('fill', '#d9eaf0');

      for (const fragment of colorize(visibleLine)) {
        const tspan = document.createElementNS(NS, 'tspan');
        tspan.setAttribute('fill', fragment.color);
        tspan.textContent = fragment.text;
        codeText.append(tspan);
      }

      codeHolder.append(codeText);
      lastText = codeText;
      if (remaining < 0) break;
    }

    const width = lastText?.getComputedTextLength() ?? 0;
    cursor.setAttribute('x', String(Math.min(277, 34 + width + 2)));
    cursor.setAttribute('y', String(finalY - 12));
    if (label) label.textContent = phase === 'waiting' ? 'BUILT ✓' : 'TYPING...';
  };

  function tick() {
    clearTimeout(timerId);
    timerId = undefined;
    if (!pageReady || document.hidden) return;
    const code = snippets[snippetIndex];
    const text = code.join('\n');
    const totalLength = text.length;
    drawCode(code, elapsedChars);
    if (reducedMotion) return;

    if (phase === 'typing') {
      if (elapsedChars < totalLength) {
        elapsedChars += 1;
        timerId = setTimeout(tick, /[ .,[\]{};:]/.test(text[elapsedChars - 1]) ? 88 : 46);
      } else {
        phase = 'waiting';
        timerId = setTimeout(tick, 1800);
      }
    } else if (phase === 'waiting') {
      phase = 'erasing';
      timerId = setTimeout(tick, 350);
    } else if (phase === 'erasing') {
      if (elapsedChars > 0) {
        elapsedChars = Math.max(0, elapsedChars - 3);
        timerId = setTimeout(tick, 18);
      } else {
        snippetIndex = (snippetIndex + 1) % snippets.length;
        phase = 'typing';
        timerId = setTimeout(tick, 380);
      }
    }
  }

  ready.then(tick);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(timerId);
    } else if (pageReady) {
      clearTimeout(timerId);
      tick();
    }
  });
})();
