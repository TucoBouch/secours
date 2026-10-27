<script setup>
import { useRoute } from 'vue-router'
import { reminderVisible } from '../quiz'

// Bascule entre les deux écrans de l'onglet « Apprendre » : Cours et Quiz.
// `replace` : passer de l'un à l'autre ne remplit pas l'historique (le retour quitte la section).
const route = useRoute()
const items = [
  { to: '/apprendre', label: 'Cours' },
  { to: '/quiz', label: 'Quiz', badge: true },
]
</script>

<template>
  <nav class="study" aria-label="Apprendre">
    <RouterLink
      v-for="i in items"
      :key="i.to"
      :to="i.to"
      replace
      class="s"
      :class="{ on: route.path === i.to }"
      :aria-current="route.path === i.to ? 'page' : undefined"
    >
      {{ i.label }}
      <i v-if="i.badge && reminderVisible()" class="dot" aria-hidden="true"></i>
      <span v-if="i.badge && reminderVisible()" class="sr-only">(un quiz est à faire)</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.study {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: var(--surface-2);
}
.s {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  min-height: 46px;
  border-radius: 10px;
  font-weight: 700;
  font-size: var(--fs-sm);
  color: var(--text-2);
  transition: background-color 0.2s var(--ease), color 0.2s;
}
.s.on {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-sm);
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--danger);
}
</style>
