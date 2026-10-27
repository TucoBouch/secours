<script setup>
import { fmt } from '../lib/fmt'
import PlsFigure from './PlsFigure.vue'

// steps : string | { text } | { badge, title, text } | { fig, text }
defineProps({ steps: { type: Array, required: true } })

const isObj = (s) => typeof s === 'object' && s !== null
</script>

<template>
  <ol class="steps">
    <li v-for="(s, i) in steps" :key="i" class="step" :class="{ lettered: isObj(s) && s.badge }">
      <span v-if="isObj(s) && s.badge" class="badge" aria-hidden="true">{{ s.badge }}</span>
      <span v-else class="num" aria-hidden="true">{{ i + 1 }}</span>
      <div class="body">
        <p v-if="isObj(s) && s.title" class="kicker">{{ s.title }}</p>
        <p class="text" v-html="fmt(isObj(s) ? s.text : s)"></p>
        <PlsFigure v-if="isObj(s) && s.fig && s.fig.startsWith('pls-')" class="fig" :n="Number(s.fig.slice(4))" />
      </div>
    </li>
  </ol>
</template>

<style scoped>
.steps { display: grid; }
.step {
  display: grid;
  grid-template-columns: 2.25rem 1fr;
  gap: var(--s-3);
  padding-block: var(--s-3);
  border-top: 1px solid var(--line);
}
.step:first-child { border-top: 0; padding-top: var(--s-1); }
.num {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.75rem;
  line-height: 1.05;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.badge {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  background: var(--accent);
  color: var(--on-accent);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.25rem;
}
.kicker {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-md);
  line-height: 1.2;
  margin-bottom: 2px;
}
.text { font-size: var(--fs-md); line-height: 1.4; }
.lettered .text { font-size: var(--fs-base); color: var(--text); }
.fig { margin-top: var(--s-3); }
</style>
