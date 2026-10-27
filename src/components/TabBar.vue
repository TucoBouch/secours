<script setup>
import { BookOpen, GraduationCap, HeartPulse, LayoutGrid, ListChecks } from 'lucide-vue-next'
import { reminderVisible } from '../quiz'

const tabs = [
  { to: '/', label: 'Situations', icon: LayoutGrid },
  { to: '/principes', label: 'Principes', icon: ListChecks },
  { to: '/massage', label: 'Massage', icon: HeartPulse, cpr: true },
  { to: '/techniques', label: 'Techniques', icon: BookOpen },
  { to: '/quiz', label: 'Quiz', icon: GraduationCap, quiz: true },
]
</script>

<template>
  <nav class="tabbar" aria-label="Navigation principale">
    <div class="inner">
      <RouterLink
        v-for="t in tabs"
        :key="t.to"
        :to="t.to"
        class="tab"
        :class="{ cpr: t.cpr }"
        exact-active-class="is-active"
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
  grid-template-columns: repeat(5, 1fr);
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
  color: var(--text-2);
  font-size: 0.75rem;
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
.tab.cpr.is-active { color: var(--accent-strong); }
.tab:active .ico { transform: scale(0.94); }
</style>
