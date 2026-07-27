<script setup>
import { computed } from "vue";

const props = defineProps({
  eventIso: { type: String, required: true },
  title: { type: String, default: "Құрметті қонақтар!" },
  invitationText: { type: String, default: "" },
  dateText: { type: String, default: "1 Қазан 2026" },
  timeText: { type: String, default: "Сағат 18:00" },
  locationTitle: { type: String, default: "Мекен-жай" },
  locationSubtitle: { type: String, default: "Той орны" },
  locationCity: { type: String, default: "Құлсары қаласы" },
  locationAddress: { type: String, default: "Сырым Датов, 57" },
  locationName: { type: String, default: '"Grand Hall"' },
  mapText: { type: String, default: "" },
  twoGisLink: { type: String, default: "" },
  weekdays: {
    type: Array,
    default: () => ["дс", "сс", "ср", "бс", "жм", "сн", "жс"],
  },
  bgInvite: { type: String, required: true },
  bgAddress: { type: String, required: true },
});

const eventDate = computed(() => new Date(props.eventIso));
const dayNumber = computed(() => eventDate.value.getDate());
const monthIndex = computed(() => eventDate.value.getMonth());

function getMondayBasedWeekdayIndex(dateObject) {
  const jsDay = dateObject.getDay();
  return (jsDay + 6) % 7;
}
function getDaysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

const calendarCells = computed(() => {
  const y = eventDate.value.getFullYear();
  const firstDay = new Date(y, monthIndex.value, 1);
  const startOffset = getMondayBasedWeekdayIndex(firstDay);
  const totalDays = getDaysInMonth(y, monthIndex.value);
  const cells = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let d = 1; d <= totalDays; d += 1) cells.push(d);
  return cells;
});
</script>

<template>
  <!-- Приглашение + дата + календарь + сағат (фон heritage-2) -->
  <section class="hsec" :style="{ backgroundImage: `url('${bgInvite}')` }">
    <h2 class="hsec__title t-script invite__title">{{ title }}</h2>

    <p class="invite__text t-body">{{ invitationText }}</p>

    <div class="invite__date t-script">{{ dateText }}</div>

    <!-- Календарь heritage: минималистичный, цифры каллиграфией -->
    <div class="cal">
      <div class="cal__weekdays">
        <div v-for="wd in weekdays" :key="wd" class="cal__weekday">
          {{ wd }}
        </div>
      </div>
      <div class="cal__days">
        <div
          v-for="(dayItem, dayIndex) in calendarCells"
          :key="dayIndex"
          class="cal__day"
          :class="{ 'cal__day--selected': dayItem === dayNumber }"
        >
          <span v-if="dayItem !== null" class="cal__num">{{ dayItem }}</span>
          <svg
            v-if="dayItem === dayNumber"
            class="cal__heart"
            viewBox="0 0 64 58"
            aria-hidden="true"
          >
            <path
              d="M32 54 C 18 44, 6 35, 6 22 C 6 12, 14 6, 22 6 C 27 6, 30 9, 32 12 C 34 9, 37 6, 42 6 C 50 6, 58 12, 58 22 C 58 35, 46 44, 32 54 Z"
              fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="invite__time t-script">{{ timeText }}</div>
  </section>

  <!-- Мекен-жай (фон heritage-1) -->
  <section class="hsec" :style="{ backgroundImage: `url('${bgAddress}')` }">
    <h2 class="hsec__title t-script addr__title">{{ locationTitle }}</h2>
    <div class="hsec__subtitle">{{ locationSubtitle }}</div>

    <div class="addr__lines t-body">
      <div>{{ locationCity }}</div>
      <div>{{ locationAddress }}</div>
      <div class="addr__hall">{{ locationName }}</div>
    </div>

    <a
      v-if="twoGisLink && mapText"
      class="addr__map"
      :href="twoGisLink"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ mapText }}
    </a>
  </section>
</template>

<style scoped>
.invite__title { letter-spacing: 0.16em; }

.invite__text {
  margin: 26px auto 0;
  max-width: 340px;
  font-size: 18px;
}

.invite__date {
  margin-top: 34px;
  font-size: clamp(28px, 8vw, 34px);
}

/* Календарь */
.cal {
  max-width: 330px;
  margin: 22px auto 0;
}
.cal__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.cal__weekday {
  font-family: var(--font-body);
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--ink-soft);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--rule);
}
.cal__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 8px;
}
.cal__day {
  aspect-ratio: 1 / 0.92;
  display: grid;
  place-items: center;
  position: relative;
}
.cal__num {
  position: relative;
  z-index: 2;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 16px;
  color: var(--ink-soft);
}
.cal__day--selected .cal__num { color: var(--ink); }
.cal__heart {
  position: absolute;
  width: 130%;
  height: 130%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: var(--accent);
  z-index: 1;
}

.invite__time {
  margin-top: 34px;
  font-size: clamp(26px, 7.4vw, 32px);
  letter-spacing: 0.22em;
}

/* Мекен-жай */
.addr__title { letter-spacing: 0.2em; }
.addr__lines {
  margin-top: 26px;
  font-size: 20px;
  color: var(--ink);
  display: grid;
  gap: 12px;
}
.addr__hall { font-style: italic; }
.addr__map {
  display: inline-block;
  margin-top: 26px;
  padding: 11px 26px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 15px;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
  transition: background 0.25s, color 0.25s;
}
.addr__map:hover { background: var(--primary); color: var(--primary-ink); }
</style>
