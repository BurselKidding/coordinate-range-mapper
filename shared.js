/* ================================================================
   shared.js — Navigation, Theme & Language for all pages
   ================================================================ */
(function() {
'use strict';

/* ── Theme Colors (CSS variables injected on load) ── */
const THEME_CSS = `
:root[data-theme="dark"] {
    --bg-deep: #0b1a2e; --bg-card: #132d52; --bg-input: #0a1628;
    --border: #1e3a5f; --amber: #e8b44b; --amber-dim: #a07828;
    --copper: #c4875a; --green: #5a9e7c;
    --text: #d4cfc4; --text-dim: #8a8578; --text-muted: #5a564d;
    --error: #c46060;
    --shadow: rgba(0,0,0,0.3);
    --body-bg: #0b1a2e;
    --panel-bg: linear-gradient(180deg, #0f2445 0%, #0c1c33 100%);
    --nav-bg: transparent;
}
:root[data-theme="light"] {
    --bg-deep: #f0f3f7; --bg-card: #ffffff; --bg-input: #e8ecf1;
    --border: #d4dae2; --amber: #b87a00; --amber-dim: #8a5c00;
    --copper: #a06030; --green: #2d6a4a;
    --text: #1a2a3a; --text-dim: #556070; --text-muted: #8090a0;
    --error: #c04040;
    --shadow: rgba(0,0,0,0.08);
    --body-bg: #f0f3f7;
    --panel-bg: linear-gradient(180deg, #ffffff 0%, #edf0f5 100%);
    --nav-bg: transparent;
}
`;

const NAV_CSS = `
#shared-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 20px; border-bottom: 1px solid var(--border);
    background: var(--nav-bg); position: sticky; top: 0; z-index: 2000;
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    flex-wrap: wrap; gap: 8px;
}
#shared-nav .nav-links { display: flex; gap: 4px; flex-wrap: wrap; }
#shared-nav .nav-links a {
    color: var(--text-dim); text-decoration: none; font-size: 13px;
    padding: 6px 14px; border-radius: 6px; transition: all .2s;
    font-weight: 500;
}
#shared-nav .nav-links a:hover { color: var(--text); background: var(--bg-card); }
#shared-nav .nav-links a.active { color: var(--amber); background: var(--bg-card); font-weight: 600; }
#shared-nav .controls { display: flex; gap: 6px; align-items: center; }
#shared-nav .ctrl-btn {
    padding: 5px 10px; border: 1px solid var(--border); border-radius: 6px;
    background: var(--bg-input); color: var(--text-dim); cursor: pointer;
    font-size: 12px; font-weight: 500; transition: all .2s;
    font-family: inherit; white-space: nowrap;
}
#shared-nav .ctrl-btn:hover { color: var(--text); border-color: var(--text-dim); }
#shared-nav .ctrl-btn.active { background: var(--amber); color: var(--bg-deep); border-color: var(--amber); }
`;

/* ── Inject CSS ── */
function injectCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}
injectCSS(THEME_CSS);
injectCSS(NAV_CSS);

/* ── State ── */
let currentLang = 'en';
let currentTheme = 'dark';

/* ── Language ── */
const LANG_DICT = {
    en: { home:'Home', mapper:'Mapper', converter:'Converter', guide:'Guide & FAQ',
          themeLight:'☀ Light', themeDark:'☾ Dark', langZh:'中', langEn:'EN' },
    zh: { home:'首页', mapper:'标注', converter:'转换', guide:'教程',
          themeLight:'☀ 亮色', themeDark:'☾ 暗色', langZh:'中', langEn:'EN' }
};
function t(key) { return (LANG_DICT[currentLang] || LANG_DICT.en)[key] || key; }

/* ── Init ── */
(function init() {
    // Theme
    const savedTheme = localStorage.getItem('coordmap-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') currentTheme = savedTheme;
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) currentTheme = 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Language
    const urlP = new URLSearchParams(window.location.search);
    const urlLang = urlP.get('lang');
    if (urlLang === 'en' || urlLang === 'zh') currentLang = urlLang;
    else {
        const savedLang = localStorage.getItem('coordmap-lang');
        if (savedLang === 'en' || savedLang === 'zh') currentLang = savedLang;
    }

    // Render nav
    renderNav();
})();

/* ── Render Nav ── */
function renderNav() {
    const el = document.getElementById('shared-nav');
    if (!el) return;
    const path = window.location.pathname.replace(/\/$/, '');
    const isActive = (href) => {
        if (href === '/') return path === '' || path === '/index';
        const stem = href.replace('.html', '');
        return path === href || path === stem;
    };

    el.innerHTML =
    '<div class="nav-links">' +
        '<a href="/"' + (isActive('/')?' class="active"':'') + '>' + t('home') + '</a>' +
        '<a href="/mapper.html"' + (isActive('/mapper.html')?' class="active"':'') + '>' + t('mapper') + '</a>' +
        '<a href="/converter.html"' + (isActive('/converter.html')?' class="active"':'') + '>' + t('converter') + '</a>' +
        '<a href="/guide.html"' + (isActive('/guide.html')?' class="active"':'') + '>' + t('guide') + '</a>' +
    '</div>' +
    '<div class="controls">' +
        '<button class="ctrl-btn" id="btn-theme" title="Toggle theme">' + (currentTheme==='dark' ? t('themeLight') : t('themeDark')) + '</button>' +
        '<button class="ctrl-btn' + (currentLang==='zh'?' active':'') + '" id="btn-lang-zh">' + t('langZh') + '</button>' +
        '<button class="ctrl-btn' + (currentLang==='en'?' active':'') + '" id="btn-lang-en">' + t('langEn') + '</button>' +
    '</div>';

    // Bind events
    document.getElementById('btn-theme').addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('coordmap-theme', currentTheme);
        renderNav();
        // Notify page-specific code (if any)
        window.dispatchEvent(new CustomEvent('themechange', { detail: currentTheme }));
    });

    document.getElementById('btn-lang-zh').addEventListener('click', () => {
        if (currentLang === 'zh') return;
        currentLang = 'zh';
        applyLang();
    });
    document.getElementById('btn-lang-en').addEventListener('click', () => {
        if (currentLang === 'en') return;
        currentLang = 'en';
        applyLang();
    });
}

function applyLang() {
    localStorage.setItem('coordmap-lang', currentLang);
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('lang', currentLang);
    window.history.replaceState({}, '', url);
    // Notify page
    window.dispatchEvent(new CustomEvent('langchange', { detail: currentLang }));
    renderNav();
}

/* Expose */
window.coordmap = {
    getLang: function() { return currentLang; },
    getTheme: function() { return currentTheme; },
    onLangChange: function(fn) { window.addEventListener('langchange', function(e) { fn(e.detail); }); },
    onThemeChange: function(fn) { window.addEventListener('themechange', function(e) { fn(e.detail); }); }
};

})();
