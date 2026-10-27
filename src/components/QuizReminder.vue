<script setup>
import { computed } from 'vue'
import { BellRing, X } from 'lucide-vue-next'
import { ago } from '../lib/dates'
import { QUIZ_LENGTH, reminder, snoozeReminder } from '../quiz'

// variant « home » : bandeau compact avec bouton et « Plus tard » (écran d'accueil)
// variant « page » : simple message, sans action (déjà sur la page du quiz)
defineProps({ variant: { type: String, default: 'home' } })

const info = computed(() => reminder())
const text = computed(() =>
  info.value.never
    ? 'Vous n’avez pas encore fait de quiz.'
    : `Votre dernier quiz remonte à ${ago(info.value.since).replace('il y a ', '')}.`,
)
</script>

<template>
  <aside class="reminder" :class="variant" role="status">
    <BellRing :size="24" :stroke-width="2.2" class="bell" />
    <div class="txt">
      <strong>Un petit quiz pour réviser ?</strong>
      <span>{{ text }} {{ QUIZ_LENGTH }} questions pour vous rafraîchir la mémoire.</span>
      <div v-if="variant === 'home'" class="actions">
        <RouterLink to="/quiz" class="go">Réviser</RouterLink>
        <button type="button" class="later" @click="snoozeReminder">Plus tard</button>
      </div>
    </div>
    <button v-if="variant === 'home'" type="button" class="x" aria-label="Masquer le rappel" @click="snoozeReminder">
      <X :size="20" />
    </button>
  </aside>
</template>

<style scoped>
.reminder {
  display: flex;
  gap: var(--s-3);
  align-items: flex-start;
  padding: var(--s-4);
  border-radius: var(--radius);
  background: var(--accent-soft);
  box-shadow: inset 0 0 0 1.5px var(--accent);
  color: var(--text);
}
.bell { flex: none; color: var(--accent-strong); margin-top: 1px; }
.txt { flex: 1; display: grid; gap: 2px; line-height: 1.35; font-size: var(--fs-sm); }
.txt strong { font-family: var(--font-display); font-size: var(--fs-md); }
.actions { display: flex; align-items: center; gap: var(--s-2); margin-top: var(--s-2); }
.go {
  display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--s-4);
  border-radius: 12px; background: var(--accent); color: var(--on-accent);
  font-family: var(--font-display); font-weight: 700;
}
.later { min-height: 44px; padding: 0 var(--s-3); font-weight: 700; color: var(--accent-strong); }
.x { flex: none; display: grid; place-items: center; width: 44px; height: 44px; margin: -10px -10px 0 0; border-radius: 50%; color: var(--text-2); }
.x:active { background: var(--surface-2); }
</style>
