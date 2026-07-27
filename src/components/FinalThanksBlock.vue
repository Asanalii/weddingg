<script setup>
import finalBackgroundImage from "@/assets/images/final_block.webp";

const props = defineProps({
  backgroundImage: { type: String, default: finalBackgroundImage },
  topText: { type: String, default: "ҚҰРМЕТПЕН, ТОЙ ИЕЛЕРІ" },
  namesText: { type: String, default: "Daniyar & Amanat" },
});
</script>

<template>
  <section class="final" :style="{ '--final-bg': `url('${backgroundImage}')` }">
    <div class="final__overlay">
      <div class="final__content">
        <div class="final__top t-display">{{ topText }}</div>
        <div class="final__divider">
          <span></span><i></i><span></span>
        </div>
        <div class="final__names t-script">{{ namesText }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final {
  min-height: 70vh;
  background-image: var(--final-bg);
  background-size: cover;
  background-position: center;
}
.final__overlay {
  min-height: 70vh;
  display: grid;
  place-items: center;
  padding: clamp(60px, 10vw, 120px) 20px;
  background: linear-gradient(
    180deg,
    rgba(40, 32, 20, 0.35),
    rgba(40, 32, 20, 0.55)
  );
}
.final__content {
  text-align: center;
  color: #fff;
  max-width: 720px;
}
.final__top {
  font-size: clamp(14px, 2vw, 20px);
  letter-spacing: 0.24em;
  padding-left: 0.24em;
  opacity: 0.95;
}
.final__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 28px auto;
  width: min(220px, 60%);
}
.final__divider span {
  height: 1px; flex: 1;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
}
.final__divider i {
  width: 6px; height: 6px; transform: rotate(45deg);
  background: var(--gold-soft); flex: 0 0 auto;
}
.final__names {
  font-size: clamp(48px, 9vw, 96px);
  text-shadow: 0 6px 28px rgba(0, 0, 0, 0.4);
  color: #fff;
}
</style>
