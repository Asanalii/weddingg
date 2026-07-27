<script setup>
import dresscodeMenImage from "@/assets/images/dresscode_men.webp";
import dresscodeWomenImage from "@/assets/images/dresscode_women.webp";

const props = defineProps({
  title: { type: String, default: "ДРЕСС-КОД" },
  subtitle: { type: String, default: "Кешіміздің үйлесімді болуы үшін" },
  menTitle: { type: String, default: "Ерлерге" },
  menText: { type: String, default: "Классикалық костюм" },
  womenTitle: { type: String, default: "Әйелдерге" },
  womenText: { type: String, default: "Коктейльді, кешкі көйлектер" },
  menImage: { type: String, default: dresscodeMenImage },
  womenImage: { type: String, default: dresscodeWomenImage },
  palette: {
    type: Array,
    default: () => ["#7a6f5b", "#b8944d", "#d9c39a", "#8a9a7b", "#4a4436"],
  },
});
</script>

<template>
  <section class="dress">
    <div class="dress__container">
      <header class="dress__head">
        <div class="divider"><span class="divider__gem"></span></div>
        <h3 class="dress__title t-display">{{ title }}</h3>
        <p class="dress__subtitle t-serif">{{ subtitle }}</p>
      </header>

      <div class="dress__grid">
        <div class="dress__item">
          <div class="dress__iconWrap">
            <img class="dress__icon" :src="menImage" alt="" />
          </div>
          <div class="dress__label t-display">{{ menTitle }}</div>
          <div class="dress__desc t-serif">{{ menText }}</div>
        </div>

        <div class="dress__divider" aria-hidden="true"></div>

        <div class="dress__item">
          <div class="dress__iconWrap">
            <img class="dress__icon" :src="womenImage" alt="" />
          </div>
          <div class="dress__label t-display">{{ womenTitle }}</div>
          <div class="dress__desc t-serif">{{ womenText }}</div>
        </div>
      </div>

      <div class="dress__palette">
        <span
          v-for="(c, i) in palette"
          :key="i"
          class="dress__swatch"
          :style="{ background: c }"
        ></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dress {
  background: var(--bg-warm);
  padding: clamp(56px, 8vw, 100px) 20px;
}
.dress__container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}
.dress__head { margin-bottom: clamp(40px, 6vw, 64px); }
.divider { margin-bottom: 20px; }
.dress__title {
  font-size: clamp(24px, 3.4vw, 38px);
  margin-bottom: 12px;
}
.dress__subtitle {
  font-size: clamp(16px, 1.6vw, 20px);
  font-style: italic;
  color: var(--ink-soft);
}

.dress__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 44px;
  align-items: center;
  max-width: 620px;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .dress__grid { grid-template-columns: 1fr auto 1fr; gap: 30px; }
}

.dress__iconWrap {
  width: clamp(120px, 16vw, 150px);
  height: clamp(120px, 16vw, 150px);
  margin: 0 auto 22px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--gold-soft);
  box-shadow: var(--shadow-soft);
  display: grid;
  place-items: center;
}
.dress__icon {
  width: 52%;
  height: 52%;
  object-fit: contain;
  filter: sepia(0.35) saturate(0.7) brightness(0.65) hue-rotate(2deg);
}
.dress__label {
  font-size: clamp(18px, 2.2vw, 22px);
  color: var(--gold-deep);
  margin-bottom: 8px;
}
.dress__desc {
  font-size: clamp(16px, 1.7vw, 19px);
  color: var(--ink);
}

.dress__divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, transparent, var(--line), transparent);
  display: none;
}
@media (min-width: 640px) { .dress__divider { display: block; } }

.dress__palette {
  display: inline-flex;
  gap: 12px;
  margin-top: clamp(40px, 6vw, 60px);
  padding: 14px 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--gold-soft);
}
.dress__swatch {
  width: 26px; height: 26px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
</style>
