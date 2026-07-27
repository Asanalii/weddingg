<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  eventIso: { type: String, required: true },
  label: { type: String, default: "Тойға дейін:" },
  units: {
    type: Object,
    default: () => ({
      days: "күн",
      hours: "сағат",
      minutes: "минут",
      seconds: "секунд",
    }),
  },
  note: { type: String, default: "Тойға келуіңізді растауыңызды сұраймыз!" },
  /* — Той иелері (объединено в один блок с отсчётом) — */
  hostsLabel: { type: String, default: "Той иелері:" },
  hostsNames: { type: String, default: "Амандос - Айым" },
  hostsWelcome: { type: String, default: "Сіздерді тойымызда күтеміз!" },
  bg: { type: String, required: true },
});

const nowMs = ref(Date.now());
let timerId = null;

const timeLeft = computed(() => {
  const targetMs = new Date(props.eventIso).getTime();
  const diffMs = Math.max(0, targetMs - nowMs.value);
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
});

onMounted(() => {
  timerId = window.setInterval(() => (nowMs.value = Date.now()), 1000);
});
onBeforeUnmount(() => {
  if (timerId) window.clearInterval(timerId);
});
</script>

<template>
  <section class="hsec" :style="{ backgroundImage: `url('${bg}')` }">
    <h2 class="hsec__title t-script cd__label" v-reveal="{ from: 'left' }">{{ label }}</h2>

    <div class="cd__row" v-reveal="{ from: 'zoom', delay: 150 }">
      <div class="cd__item">
        <div class="cd__value t-script">{{ timeLeft.days }}</div>
        <div class="cd__unit t-body">{{ units.days }}</div>
      </div>
      <div class="cd__item">
        <div class="cd__value t-script">{{ timeLeft.hours }}</div>
        <div class="cd__unit t-body">{{ units.hours }}</div>
      </div>
      <div class="cd__item">
        <div class="cd__value t-script">{{ timeLeft.minutes }}</div>
        <div class="cd__unit t-body">{{ units.minutes }}</div>
      </div>
      <div class="cd__item">
        <div class="cd__value t-script">{{ timeLeft.seconds }}</div>
        <div class="cd__unit t-body">{{ units.seconds }}</div>
      </div>
    </div>

    <p class="cd__note t-body" v-reveal="{ delay: 250 }">{{ note }}</p>

    <!-- Той иелері — в том же блоке -->
    <h2 class="hsec__title t-script cd__hostsLabel" v-reveal="{ from: 'right' }">{{ hostsLabel }}</h2>
    <div class="cd__hostsNames t-script" v-reveal="{ delay: 130 }">{{ hostsNames }}</div>
    <p class="cd__hostsWelcome t-body" v-reveal="{ delay: 230 }">{{ hostsWelcome }}</p>
  </section>
</template>

<style scoped>
.cd__label { letter-spacing: 0.2em; }

.cd__row {
  margin-top: 26px;
  display: flex;
  justify-content: center;
  gap: clamp(18px, 6vw, 30px);
}
.cd__value {
  font-size: clamp(38px, 11vw, 48px);
  letter-spacing: 0.02em;
  line-height: 1;
}
.cd__unit {
  margin-top: 8px;
  font-style: italic;
  font-size: 15px;
  color: var(--ink-soft);
}

.cd__note {
  margin: 32px auto 0;
  max-width: 300px;
  font-style: italic;
  font-size: 18px;
  color: var(--ink);
}

/* Той иелері */
.cd__hostsLabel {
  margin-top: clamp(44px, 12vw, 56px);
  letter-spacing: 0.2em;
}
.cd__hostsNames {
  margin-top: 18px;
  font-size: clamp(26px, 7.6vw, 32px);
  letter-spacing: 0.14em;
}
.cd__hostsWelcome {
  margin-top: 20px;
  font-style: italic;
  font-size: 18px;
  color: var(--ink);
}
</style>
