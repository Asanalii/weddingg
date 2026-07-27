<script setup>
import guestsIcon from "@/assets/images/naz/guests.webp";
import brideIcon from "@/assets/images/naz/bride.png";
import archIcon from "@/assets/images/naz/arch.webp";
import celebrationIcon from "@/assets/images/naz/celebration.webp";
import cakeIcon from "@/assets/images/naz/wedding-cake.svg";

const props = defineProps({
  kicker: { type: String, default: "Бағдарлама" },
  title: { type: String, default: "Той бағдарламасы" },
  items: {
    type: Array,
    default: () => [
      { time: "17:00", text: "Қонақтарды қарсы алу", icon: "guests" },
      { time: "18:00", text: "Беташар рәсімі", icon: "bride" },
      { time: "19:00", text: "Құдаларды қарсы алу", icon: "arch" },
      { time: "20:00", text: "Той салтанаты", icon: "celebration" },
      { time: "22:00", text: "Тойдың торты", icon: "cake" },
    ],
  },
  bg: { type: String, required: true },
});

// Ключ иконки из конфига -> line-art картинка из Naz
const iconMap = {
  guests: guestsIcon,
  bride: brideIcon,
  arch: archIcon,
  celebration: celebrationIcon,
  cake: cakeIcon,
};
const iconFor = (key) => iconMap[key] || archIcon;
</script>

<template>
  <section class="hsec" :style="{ backgroundImage: `url('${bg}')` }">
    <h2 class="hsec__title t-script prog__kicker">{{ kicker }}</h2>
    <div class="hsec__subtitle">{{ title }}</div>

    <ol class="prog">
      <li v-for="(it, i) in items" :key="i" class="prog__row">
        <div class="prog__icon">
          <img :src="iconFor(it.icon)" alt="" loading="lazy" />
        </div>

        <div class="prog__mid" aria-hidden="true">
          <span class="prog__heart">
            <svg viewBox="0 0 64 58">
              <path
                d="M32 54 C 18 44, 6 35, 6 22 C 6 12, 14 6, 22 6 C 27 6, 30 9, 32 12 C 34 9, 37 6, 42 6 C 50 6, 58 12, 58 22 C 58 35, 46 44, 32 54 Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span v-if="i < items.length - 1" class="prog__line"></span>
        </div>

        <div class="prog__info">
          <div class="prog__time t-script">{{ it.time }}</div>
          <div class="prog__text t-body">{{ it.text }}</div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.prog__kicker { letter-spacing: 0.2em; }

.prog {
  list-style: none;
  margin: 34px auto 0;
  padding: 0;
  max-width: 320px;
  text-align: left;
}

.prog__row {
  display: grid;
  grid-template-columns: 64px 30px 1fr;
  align-items: start;
  min-height: 104px;
}

.prog__icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  justify-self: center;
}
.prog__icon img {
  width: 46px;
  height: 46px;
  object-fit: contain;
  /* line-art иконки затемняем под чернильный цвет */
  filter: grayscale(1) brightness(0.35);
  opacity: 0.9;
}

.prog__mid {
  position: relative;
  height: 100%;
  display: grid;
  justify-items: center;
}
.prog__heart {
  width: 14px;
  height: 13px;
  color: var(--accent);
  margin-top: 20px;
  z-index: 2;
}
.prog__line {
  position: absolute;
  top: 38px;
  bottom: -20px;
  width: 1px;
  background: var(--rule);
}

.prog__info { padding-left: 8px; }
.prog__time {
  font-size: 27px;
  letter-spacing: 0.06em;
}
.prog__text {
  margin-top: 2px;
  font-size: 17px;
  color: var(--ink-soft);
}
</style>
