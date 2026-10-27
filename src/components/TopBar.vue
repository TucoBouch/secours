<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft, Phone } from 'lucide-vue-next'
import AppMark from './AppMark.vue'

defineProps({
  title: { type: String, required: true },
  back: Boolean,
  brand: Boolean,
  call: { type: Boolean, default: true },
})

const router = useRouter()

// Revient à l'écran précédent ; si l'écran a été ouvert directement (pas d'historique), va à l'accueil.
function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/')
}
</script>

<template>
  <header class="topbar">
    <button v-if="back" class="icon-btn" type="button" aria-label="Retour" @click="goBack">
      <ArrowLeft :size="24" :stroke-width="2.25" />
    </button>
    <AppMark v-else-if="brand" />
    <h1 class="title">{{ title }}</h1>
    <a v-if="call" class="call" href="tel:112" aria-label="Appeler le 112">
      <Phone :size="18" :stroke-width="2.5" />
      <span>112</span>
    </a>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--s-3);
  min-height: 60px;
  padding: calc(env(safe-area-inset-top) + var(--s-2)) var(--gutter) var(--s-2);
  background: var(--bg);
}
.title {
  flex: 1;
  min-width: 0;
  font-size: 1.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon-btn {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-left: -10px;
  border-radius: 50%;
  color: var(--text);
}
.icon-btn:active { background: var(--surface-2); }
.call {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 var(--s-4);
  border-radius: 999px;
  background: var(--danger);
  color: var(--on-danger);
  font-family: var(--font-display);
  font-weight: 750;
  font-size: var(--fs-md);
  letter-spacing: 0.02em;
}
.call:active { filter: brightness(0.92); }
</style>
