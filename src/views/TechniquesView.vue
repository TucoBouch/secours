<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Info } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import StepList from '../components/StepList.vue'
import TorsoFigure from '../components/TorsoFigure.vue'
import { techniqueById, techniques } from '../data/techniques'
import { fmt } from '../lib/fmt'

const route = useRoute()
const router = useRouter()
const chips = ref(null)

const current = computed(() => techniqueById[route.query.t] || techniques[0])

// Changer de technique reste sur le même écran : on remplace l'entrée d'historique,
// pour que « retour » quitte l'écran au lieu de repasser par chaque technique consultée.
function select(id) {
  router.replace({ query: { t: id } })
}

async function revealActive() {
  await nextTick()
  chips.value?.querySelector('[aria-selected="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
}
onMounted(revealActive)
watch(() => current.value.id, revealActive)
</script>

<template>
  <div class="screen">
    <TopBar title="Techniques" gear />

    <div ref="chips" class="chips" role="tablist" aria-label="Techniques">
      <button
        v-for="t in techniques"
        :id="`tab-${t.id}`"
        :key="t.id"
        type="button"
        role="tab"
        class="chip"
        :aria-selected="current.id === t.id"
        :aria-controls="'panel'"
        @click="select(t.id)"
      >
        {{ t.short }}
      </button>
    </div>

    <main id="panel" class="pad body" role="tabpanel" :aria-labelledby="`tab-${current.id}`">
      <header>
        <h2>{{ current.title }}</h2>
        <p class="when">{{ current.when }}</p>
        <p v-if="current.why" class="why">{{ current.why }}</p>
      </header>

      <div v-if="current.figure === 'torso'" class="figure">
        <TorsoFigure />
      </div>

      <StepList v-if="current.steps" :steps="current.steps" />

      <section v-for="sec in current.sections" :key="sec.title" class="sec">
        <h3>{{ sec.title }}</h3>
        <StepList :steps="sec.steps" />
      </section>

      <p v-if="current.note" class="note"><Info :size="20" :stroke-width="2.2" /><span v-html="fmt(current.note)"></span></p>

      <RouterLink v-if="current.cta" :to="current.cta.to" class="btn btn-primary btn-block">{{ current.cta.label }}</RouterLink>
    </main>
  </div>
</template>

<style scoped>
.chips {
  position: sticky;
  top: calc(60px + env(safe-area-inset-top));
  z-index: 9;
  display: flex;
  gap: var(--s-2);
  padding: var(--s-1) var(--gutter) var(--s-3);
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  background: var(--bg);
}
.chips::-webkit-scrollbar { display: none; }
.chip {
  flex: none;
  scroll-snap-align: center;
  min-height: 44px;
  padding: 0 var(--s-4);
  border-radius: 999px;
  border: 1.5px solid var(--line);
  background: var(--surface);
  font-weight: 700;
  font-size: var(--fs-sm);
  white-space: nowrap;
  color: var(--text);
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;
}
.chip[aria-selected='true'] { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }

.body { display: grid; gap: var(--s-5); padding-top: var(--s-3); }
h2 { font-size: var(--fs-xl); line-height: 1.05; }
.when { margin-top: var(--s-2); font-size: var(--fs-md); font-weight: 700; line-height: 1.3; }
.why { margin-top: var(--s-1); color: var(--text-2); }
.figure { max-width: 300px; width: 100%; margin-inline: auto; }
.sec h3 { font-size: var(--fs-md); padding: var(--s-3) var(--s-4); margin-bottom: var(--s-2); border-radius: 12px; background: var(--surface-2); }
.note {
  display: flex; gap: var(--s-3); align-items: flex-start;
  padding: var(--s-4); border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line);
  color: var(--text-2); font-size: var(--fs-sm); line-height: 1.45;
}
.note svg { margin-top: 1px; color: var(--accent); }
</style>
