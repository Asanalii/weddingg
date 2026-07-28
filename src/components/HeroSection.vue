<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  videoUrl: { type: String, required: true },
  posterUrl: { type: String, default: "" },
  kicker: { type: String, default: "Сіздерді тойымызға шақырамыз" },
  hostsLabel: { type: String, default: "Той иелері:" },
  hostsNames: { type: String, default: "" },
  coupleNames: { type: String, default: "Алпамыс & Арайлым" },
  eventIso: { type: String, required: true },
  musicUrl: { type: String, default: "" },
  autoplay: { type: Boolean, default: true },
});

// «Алпамыс & Арайлым» -> имена в столбик; «Назерке» -> одно крупное имя
const isCouple = computed(() => props.coupleNames.includes("&"));
const groom = computed(() => props.coupleNames.split("&")[0]?.trim() || "");
const bride = computed(() =>
  isCouple.value
    ? props.coupleNames.split("&")[1]?.trim() || ""
    : props.coupleNames.trim(),
);

const prettyDate = computed(() => {
  const d = new Date(props.eventIso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day} . ${month} . ${d.getFullYear()}`;
});

/* ---- Видео: перезапуск по окончании (как в Naz) ---- */
const videoRef = ref(null);
const onEnded = () => {
  const v = videoRef.value;
  if (!v) return;
  v.currentTime = 0;
  v.play().catch(() => {});
};

/* ============================================================
   Музыка (логика из wedding_asan)

   Браузеры не дают включить звук до первого действия пользователя:
   play() без жеста падает с NotAllowedError. Поэтому логика такая —
   пробуем стартовать сразу, а если браузер отказал, ждём первое
   касание / клик / нажатие клавиши и запускаем тогда.
   Для гостя это неотличимо от автозапуска.
   ============================================================ */
const isPlaying = ref(false);
// Если гость сам поставил на паузу — больше не навязываемся
const stoppedByUser = ref(false);
let audioElement = null;

const getAudio = () => {
  if (!audioElement && props.musicUrl) {
    audioElement = new Audio(props.musicUrl);
    audioElement.loop = true;
    audioElement.volume = 0.4;
    audioElement.preload = "auto";
    // Состояние кнопки держим на событиях самого аудио —
    // тогда оно верное и при системной паузе (звонок, другая вкладка)
    audioElement.addEventListener("play", () => (isPlaying.value = true));
    audioElement.addEventListener("pause", () => (isPlaying.value = false));
    audioElement.addEventListener("ended", () => (isPlaying.value = false));
  }
  return audioElement;
};

// Возвращает true, если воспроизведение действительно началось
const tryPlay = async () => {
  const audio = getAudio();
  if (!audio || stoppedByUser.value) return false;
  try {
    await audio.play();
    return true;
  } catch {
    return false; // NotAllowedError — ждём жеста пользователя
  }
};

/* ---- Запуск по первому жесту ---- */
// touchend и click дают «user activation»; touchstart в Chrome — нет
const GESTURE_EVENTS = ["pointerdown", "touchend", "click", "keydown"];

const onFirstGesture = async () => {
  const started = await tryPlay();
  if (started) removeGestureListeners();
};

function addGestureListeners() {
  for (const eventName of GESTURE_EVENTS) {
    window.addEventListener(eventName, onFirstGesture, { passive: true });
  }
}

function removeGestureListeners() {
  for (const eventName of GESTURE_EVENTS) {
    window.removeEventListener(eventName, onFirstGesture);
  }
}

onMounted(async () => {
  if (!props.autoplay || !props.musicUrl) return;

  const started = await tryPlay();
  if (!started) addGestureListeners();
});

watch(
  () => props.musicUrl,
  (newUrl) => {
    if (!audioElement) return;
    audioElement.pause();
    audioElement.src = newUrl;
  },
);

const toggleMusic = async () => {
  const audio = getAudio();
  if (!audio) return;

  if (isPlaying.value) {
    stoppedByUser.value = true;
    removeGestureListeners();
    audio.pause();
    return;
  }

  stoppedByUser.value = false;
  const started = await tryPlay();
  if (!started) {
    console.warn("Браузер заблокировал воспроизведение музыки.");
  }
};

onBeforeUnmount(() => {
  removeGestureListeners();
  audioElement?.pause();
});
</script>

<template>
  <section class="hero">
    <video
      ref="videoRef"
      class="hero__video"
      :src="videoUrl"
      :poster="posterUrl || undefined"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      aria-hidden="true"
      @ended="onEnded"
    ></video>

    <div class="hero__content" :class="{ 'hero__content--solo': !isCouple }">
      <div v-if="hostsNames" class="hero__hosts" v-reveal="{ delay: 100 }">
        <span class="hero__hostsLabel">{{ hostsLabel }}</span>
        <span class="hero__hostsNames">{{ hostsNames }}</span>
      </div>

      <div class="hero__kicker" v-reveal="{ from: 'left', delay: 250 }">
        {{ kicker }}
      </div>

      <div
        class="hero__ornament"
        aria-hidden="true"
        v-reveal="{ from: 'zoom', delay: 450 }"
      >
        <span></span>
        <svg class="hero__ornamentGem" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 2 L12.4 7.6 L18 10 L12.4 12.4 L10 18 L7.6 12.4 L2 10 L7.6 7.6 Z"
            fill="currentColor"
          />
        </svg>
        <span></span>
      </div>

      <template v-if="isCouple">
        <h1 class="hero__name" v-reveal="{ from: 'right', delay: 500 }">
          {{ groom }}
        </h1>
        <div class="hero__amp" v-reveal="{ from: 'zoom', delay: 650 }">
          &amp;
        </div>
        <h1 class="hero__name" v-reveal="{ from: 'left', delay: 800 }">
          {{ bride }}
        </h1>
      </template>
      <h1
        v-else
        class="hero__name hero__name--solo"
        v-reveal="{ from: 'right', delay: 550 }"
      >
        {{ bride }}
      </h1>

      <div class="hero__date t-spaced" v-reveal="{ delay: 900 }">
        {{ prettyDate }}
      </div>
    </div>

    <!-- индикатор «скролль вниз» -->
    <div class="hero__scroll" aria-hidden="true">
      <span class="hero__scrollDot"></span>
    </div>

    <!-- круглая кнопка музыки, как в Naz -->
    <button
      v-if="musicUrl"
      class="hero__play"
      type="button"
      @click="toggleMusic"
      :aria-label="isPlaying ? 'Pause music' : 'Play music'"
    >
      <svg v-if="!isPlaying" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7z" fill="currentColor" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="5" width="3.4" height="14" rx="1" fill="currentColor" />
        <rect
          x="13.6"
          y="5"
          width="3.4"
          height="14"
          rx="1"
          fill="currentColor"
        />
      </svg>
    </button>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  /* Пропорция самого видео (720×1560) — кадр виден целиком, без обрезки */
  aspect-ratio: 720 / 1560;
  overflow: hidden;
  background: #f1e8d8; /* фолбэк, пока грузится видео (значение из Naz) */
}

.hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Контент поверх видео: пара видна снизу (padding-bottom 22%, как в Naz) */
.hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 44px 24px 22%;
  text-align: center;
}

/* Той иелері над kicker */
.hero__hosts {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 26px;
}
.hero__hostsLabel {
  font-family: var(--font-body);
  font-size: 13px;
  letter-spacing: 0.3em;
  padding-left: 0.3em;
  text-transform: uppercase;
  color: rgba(42, 50, 54, 0.6);
}
.hero__hostsNames {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 26px;
  color: var(--ink);
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.6);
}

.hero__kicker {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 22px;
  line-height: 1.2;
  color: rgba(42, 50, 54, 0.78);
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.6);
}
/* Режим одного имени (қыз ұзату): всё крупнее, чтобы hero не пустовал */
.hero__content--solo {
  /* поднимаем тексты выше — пара остаётся снизу, надписи над ней */
  padding-bottom: 42%;
}
.hero__content--solo .hero__kicker {
  font-size: 40px;
  letter-spacing: 0.04em;
}

/* Тонкий орнамент-разделитель под kicker */
.hero__ornament {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(210px, 60%);
  color: var(--accent);
}
.hero__ornament span {
  height: 1px;
  flex: 1;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(168, 137, 90, 0.75),
    transparent
  );
}
.hero__ornamentGem {
  width: 13px;
  height: 13px;
  flex: 0 0 auto;
  opacity: 0.9;
}

.hero__name {
  margin-top: 22px;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 52px;
  line-height: 0.95;
  letter-spacing: 0.04em;
  color: var(--ink);
  text-shadow: 0 3px 10px rgba(255, 255, 255, 0.7);
}
.hero__name + .hero__name {
  margin-top: 0;
}

.hero__amp {
  font-family: var(--font-display);
  font-size: 30px;
  color: rgba(42, 50, 54, 0.4);
  margin: 2px 0;
}

.hero__date {
  margin-top: 14px;
}

/* индикатор «скролль вниз» — мышка с бегущей точкой */
.hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  width: 27px;
  height: 44px;
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
  box-shadow: 0 2px 10px rgba(42, 50, 54, 0.25);
  pointer-events: none;
}
.hero__scrollDot {
  width: 4px;
  height: 8px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 1px 4px rgba(42, 50, 54, 0.3);
  animation: heroScroll 1.8s ease-in-out infinite;
}
@keyframes heroScroll {
  0% {
    opacity: 0;
    transform: translateY(-2px);
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(14px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero__scrollDot {
    animation: none;
    opacity: 1;
  }
}

/* круглая кнопка play внизу слева */
.hero__play {
  position: fixed;
  left: 22px;
  bottom: 22px;
  z-index: 90;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--rule);
  color: var(--ink);
  display: grid;
  place-items: center;
  box-shadow: 0 8px 24px rgba(42, 50, 54, 0.18);
  backdrop-filter: blur(6px);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}
.hero__play:hover {
  transform: translateY(-2px);
  background: #fff;
}
.hero__pause {
  font-size: 10px;
  letter-spacing: 1px;
}
</style>
