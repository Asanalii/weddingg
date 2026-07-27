<script setup>
const props = defineProps({
  label: { type: String, default: "Той иелері:" },
  names: { type: String, default: "Амандос - Айым" },
  welcome: { type: String, default: "Сіздерді тойымызда күтеміз!" },
  bg: { type: String, required: true },
});
</script>

<template>
  <section class="hsec" :style="{ backgroundImage: `url('${bg}')` }">
    <h2 class="hsec__title t-script hosts__label">{{ label }}</h2>
    <div class="hosts__names t-script">{{ names }}</div>
    <p class="hosts__welcome t-body">{{ welcome }}</p>
  </section>
</template>

<style scoped>
.hosts__label { letter-spacing: 0.2em; }
.hosts__names {
  margin-top: 18px;
  font-size: clamp(26px, 7.6vw, 32px);
  letter-spacing: 0.14em;
}
.hosts__welcome {
  margin-top: 20px;
  font-style: italic;
  font-size: 18px;
  color: var(--ink);
}
</style>
