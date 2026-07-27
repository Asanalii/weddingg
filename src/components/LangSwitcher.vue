<script setup>
defineProps({
  languages: { type: Array, required: true },
  current: { type: String, required: true },
});

// Базовый префикс сайта (напр. "/wedding") — берём из <base> или BASE_URL Vite
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const href = (path) => `${base}${path}`;
</script>

<template>
  <nav class="lang" aria-label="Language">
    <template v-for="(l, i) in languages" :key="l.code">
      <a
        class="lang__item"
        :class="{ 'lang__item--on': l.code === current }"
        :href="href(l.path)"
      >
        {{ l.label }}
      </a>
      <span v-if="i < languages.length - 1" class="lang__sep">·</span>
    </template>
  </nav>
</template>

<style scoped>
.lang {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(248, 240, 228, 0.82);
  border: 1px solid var(--rule);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(42, 50, 54, 0.12);
}
.lang__item {
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 11px;
  color: var(--ink-mute);
  transition: color 0.2s;
}
.lang__item--on {
  color: var(--ink);
  font-weight: 600;
}
.lang__item:hover { color: var(--ink); }
.lang__sep { color: var(--rule); font-size: 11px; }
</style>
