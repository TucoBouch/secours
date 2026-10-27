<script setup>
import { BookOpen, GraduationCap, HeartPulse, LayoutGrid, ListChecks } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { reminderVisible } from '../quiz'

const route = useRoute()

const tabs = [
  { to: '/', label: 'Situations', icon: LayoutGrid },
  { to: '/principes', label: 'Principes', icon: ListChecks },
  { to: '/massage', label: 'Massage', icon: HeartPulse, cpr: true },
  { to: '/techniques', label: 'Techniques', icon: BookOpen },
  // « Apprendre » regroupe les cours et le quiz : l'onglet reste actif sur les deux écrans.
  { to: '/apprendre', label: 'Apprendre', icon: GraduationCap, also: ['/apprendre', '/quiz'], quiz: true },
]
const isActive = (t) =>
  route.path === t.to || !!t.also?.some((p) => route.path === p || route.path.startsWith(p + '/'))
</script>

<template>
  <nav class="tabbar" aria-label="Navigation principale">
    <div class="inner">
      <RouterLink
        v-for="t in tabs"
        :key="t.to"
        :to="t.to"
        class="tab"
        :class="{ cpr: t.cpr, 'is-active': isActive(t) }"
        :aria-current="isActive(t) ? 'page' : undefined"
      >
        <span class="ico">
          <component :is="t.icon" :size="t.cpr ? 28 : 24" :stroke-width="2.1" />
          <i v-if="t.quiz && reminderVisible()" class="badge" aria-hidden="true"></i>
        </span>
        <span v-if="t.quiz && reminderVisible()" class="sr-only">Rappel : un quiz est à faire</span>
        <span class="lbl">{{ t.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 20;
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding-bottom: env(safe-area-inset-bottom);
}
.inner {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  max-width: var(--maxw);
  margin-inline: auto;
  height: var(--tabbar-h);
}
.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 0;
  color: var(--text-2);
  font-size: min(0.72rem, 11.5px); /* barre de navigation : le réglage « texte agrandi » ne doit pas la faire déborder */
  font-weight: 700;
  letter-spacing: 0.01em;
  user-select: none;
  -webkit-user-select: none;
}
.tab.is-active { color: var(--accent-strong); }
.tab.is-active:not(.cpr) .ico {
  background: var(--accent-soft);
}
.ico {
  position: relative;
  display: grid;
  place-items: center;
  width: 56px;
  height: 32px;
  border-radius: 999px;
  transition: background-color 0.2s var(--ease);
}
.badge {
  position: absolute;
  top: 3px;
  right: 15px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--danger);
  box-shadow: 0 0 0 2px var(--surface);
}
.tab.cpr { color: var(--text); }
.tab.cpr .ico {
  width: 60px;
  height: 60px;
  margin-top: -26px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--on-accent);
  box-shadow: 0 0 0 5px var(--surface), var(--shadow);
}
.tab.cpr .lbl { margin-top: -1px; }
.lbl { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tab.cpr.is-active { color: var(--accent-strong); }
.tab:active .ico { transform: scale(0.94); }
</style>
