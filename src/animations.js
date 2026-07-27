// ============================================================
//  Анимации появления (scroll-reveal)
//  Подключается один раз в main.js:  app.use(revealPlugin)
//
//  Использование в шаблонах:
//    v-reveal                                  — fade + подъём снизу
//    v-reveal="{ from: 'left' }"               — выезд слева
//    v-reveal="{ from: 'right', delay: 200 }"  — справа, с задержкой (мс)
//    v-reveal="{ from: 'zoom' }"               — лёгкое увеличение
//
//  Элемент анимируется один раз, когда попадает в зону видимости.
//  CSS-классы .rv / .rv--in описаны в style.css.
// ============================================================

const validFrom = new Set(["up", "left", "right", "zoom"]);

// Пользователи с «уменьшенным движением» видят контент сразу
const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Один общий observer на всю страницу
let observer = null;
function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        const delay = Number(el.dataset.rvDelay || 0);
        window.setTimeout(() => el.classList.add("rv--in"), delay);
        observer.unobserve(el);
      }
    },
    {
      threshold: 0.15,
      // чуть заранее, чтобы к моменту взгляда анимация уже шла
      rootMargin: "0px 0px -8% 0px",
    },
  );
  return observer;
}

export const vReveal = {
  mounted(el, binding) {
    if (prefersReduced) return; // без анимаций — контент просто виден

    const opts = binding.value || {};
    const from = validFrom.has(opts.from) ? opts.from : "up";

    el.classList.add("rv", `rv--${from}`);
    el.dataset.rvDelay = String(opts.delay || 0);

    getObserver().observe(el);
  },
  unmounted(el) {
    if (observer) observer.unobserve(el);
  },
};

export default {
  install(app) {
    app.directive("reveal", vReveal);
  },
};
