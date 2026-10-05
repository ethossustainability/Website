// A brief, optional welcome on the first page of each browser tab session.
(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
        if (sessionStorage.getItem('ethos-welcomed') || sessionStorage.getItem('ethos-motion-paused') === 'true') return;
        sessionStorage.setItem('ethos-welcomed', 'true');
    } catch { /* The intro also works when browser storage is unavailable. */ }
    const intro = document.createElement('div');
    intro.className = 'growth-intro';
    intro.innerHTML = `<div class="growth-intro-content">
        <svg class="growth-sprout" viewBox="0 0 140 140" fill="none" aria-hidden="true">
            <circle class="growth-orbit" cx="70" cy="70" r="58" stroke="currentColor" stroke-width="1" stroke-dasharray="3 8"/>
            <path class="growth-soil" d="M36 112h68" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <path class="growth-stem" d="M70 111V56" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <path class="growth-leaf growth-leaf-left" d="M70 83C42 84 32 68 34 48c23-2 38 10 36 35Z" fill="#f39772"/>
            <path class="growth-leaf growth-leaf-right" d="M70 67c-2-27 13-42 37-40 2 24-12 40-37 40Z" fill="#f9c691"/>
        </svg>
        <p class="growth-brand">Ethos Sustainability</p>
        <p class="growth-caption" role="status">Small actions. Growing possibilities.</p>
        <button type="button" class="growth-skip">Skip intro →</button>
    </div>`;
    document.body.appendChild(intro);
    const started = performance.now();
    let dismissed = false;
    let releaseTimer;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    function dismiss() {
        if (dismissed) return;
        dismissed = true;
        clearTimeout(releaseTimer);
        clearTimeout(fallback);
        intro.classList.add('is-finished');
        document.removeEventListener('keydown', escapeIntro);
        preference.removeEventListener('change', dismiss);
        setTimeout(() => intro.remove(), 350);
    }
    function escapeIntro(event) { if (event.key === 'Escape') dismiss(); }
    function ready() { releaseTimer = setTimeout(dismiss, Math.max(0, 1100 - (performance.now() - started))); }
    const fallback = setTimeout(dismiss, 2400);
    intro.querySelector('button').addEventListener('click', dismiss);
    document.addEventListener('keydown', escapeIntro);
    preference.addEventListener('change', dismiss);
    if (document.readyState === 'complete') ready();
    else window.addEventListener('load', ready, { once: true });
})();
