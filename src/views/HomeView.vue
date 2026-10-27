<script setup>
import { computed, ref } from 'vue'
import { HeartPulse, Phone, Search, X } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import QuizReminder from '../components/QuizReminder.vue'
import { groups, situations } from '../data/situations'
import { icons } from '../icons'
import { normalize } from '../lib/fmt'
import { reminderVisible } from '../quiz'
import { settings } from '../settings'

const query = ref('')

const results = computed(() => {
  const q = normalize(query.value.trim())
  if (!q) return null
  return situations.filter((s) => normalize(`${s.title} ${s.sub || ''} ${s.keywords || ''}`).includes(q))
})

const byGroup = computed(() =>
  groups.map((g) => ({ ...g, items: situations.filter((s) => s.group === g.id) })),
)
</script>

<template>
  <div class="screen">
    <TopBar title="Premiers secours" brand gear :call="false" />

    <section class="pad hero" aria-label="Actions rapides">
      <h2 class="ask">Que se passe-t-il ?</h2>
      <div class="quick">
        <a class="act danger" href="tel:112">
          <Phone :size="26" :stroke-width="2.4" />
          <span class="t">Appeler le 112</span>
          <span class="s">Urgences, toute l’Europe</span>
        </a>
        <RouterLink class="act accent" to="/massage">
          <HeartPulse :size="26" :stroke-width="2.4" />
          <span class="t">Massage cardiaque</span>
          <span class="s">Tempo {{ settings.cpr.bpm }}/min + son</span>
        </RouterLink>
      </div>
    </section>

    <div v-if="reminderVisible()" class="pad remind">
      <QuizReminder />
    </div>

    <div class="pad find">
      <label class="search">
        <Search :size="20" :stroke-width="2.25" aria-hidden="true" />
        <span class="sr-only">Chercher une situation</span>
        <input
          v-model="query"
          type="search"
          inputmode="search"
          enterkeyhint="search"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Chercher : brûlure, nez, étouffement…"
        />
        <button v-if="query" type="button" class="clear" aria-label="Effacer la recherche" @click="query = ''">
          <X :size="18" />
        </button>
      </label>
    </div>

    <main class="pad groups">
      <template v-if="results">
        <p v-if="!results.length" class="empty">
          Aucune situation ne correspond. Si la personne est en danger, <a href="tel:112">appelez le 112</a>.
        </p>
        <ul v-else class="grid">
          <li v-for="s in results" :key="s.id">
            <RouterLink :to="`/situation/${s.id}`" class="tile" :class="{ vital: s.group === 'vital' }">
              <component :is="icons[s.icon]" :size="30" :stroke-width="2" class="ico" />
              <span class="tt">{{ s.title }}</span>
              <span v-if="s.sub" class="ts">{{ s.sub }}</span>
            </RouterLink>
          </li>
        </ul>
      </template>

      <template v-else>
        <section v-for="g in byGroup" :key="g.id" class="group">
          <div class="gh">
            <h2>{{ g.title }}</h2>
          </div>
          <ul class="grid">
            <li v-for="s in g.items" :key="s.id">
              <RouterLink :to="`/situation/${s.id}`" class="tile" :class="{ vital: g.id === 'vital' }">
                <component :is="icons[s.icon]" :size="30" :stroke-width="2" class="ico" />
                <span class="tt">{{ s.title }}</span>
                <span v-if="s.sub" class="ts">{{ s.sub }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.hero { display: grid; gap: var(--s-3); padding-top: var(--s-2); }
.ask { font-size: var(--fs-xl); line-height: 1.05; }
.quick { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--s-3); }
.act {
  display: grid;
  align-content: start;
  gap: 2px;
  min-height: 116px;
  padding: var(--s-4);
  border-radius: var(--radius);
  transition: transform 0.15s var(--ease);
  user-select: none;
  -webkit-user-select: none;
}
.act:active { transform: scale(0.97); }
.act svg { margin-bottom: var(--s-2); }
.act .t { font-family: var(--font-display); font-weight: 750; font-size: var(--fs-md); line-height: 1.1; hyphens: auto; overflow-wrap: break-word; }
.act .s { font-size: var(--fs-xs); opacity: 0.85; line-height: 1.25; }
.act.danger { background: var(--danger); color: var(--on-danger); }
.act.accent { background: var(--accent-soft); color: var(--accent-strong); box-shadow: inset 0 0 0 2px var(--accent); }

.remind { margin-top: var(--s-4); }
.find { margin-top: var(--s-4); }
.search {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  min-height: 54px;
  padding: 0 var(--s-2) 0 var(--s-4);
  border-radius: 14px;
  background: var(--surface);
  border: 1.5px solid var(--line);
  color: var(--text-2);
}
.search:focus-within { border-color: var(--accent); }
.search input {
  flex: 1;
  min-width: 0;
  height: 52px;
  border: 0;
  outline: 0;
  background: none;
  font-size: 1rem;
  color: var(--text);
}
.search input::placeholder { color: var(--text-2); opacity: 0.8; }
.search input::-webkit-search-cancel-button { display: none; }
.clear { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; color: var(--text-2); }

.groups { margin-top: var(--s-5); display: grid; gap: var(--s-6); }
.gh { margin-bottom: var(--s-3); }
.gh h2 { font-size: var(--fs-lg); }
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--s-3); }

.tile {
  display: grid;
  align-content: start;
  gap: 2px;
  height: 100%;
  min-height: 112px;
  padding: var(--s-4) clamp(0.75rem, 4vw, 1rem);
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--line);
  transition: transform 0.15s var(--ease), border-color 0.15s;
  user-select: none;
  -webkit-user-select: none;
}
.tile:active { transform: scale(0.97); }
.tile .ico { color: var(--accent); margin-bottom: var(--s-2); }
.tile .tt { font-family: var(--font-display); font-weight: 700; font-size: clamp(1.05rem, 4.8vw, 1.1875rem); line-height: 1.15; hyphens: auto; overflow-wrap: break-word; }
.tile .ts { font-size: var(--fs-sm); color: var(--text-2); line-height: 1.3; overflow-wrap: break-word; }
.tile.vital { background: var(--danger-soft); border-color: var(--danger-line); }
.tile.vital .ico { color: var(--danger); }

.empty { padding: var(--s-5) 0; color: var(--text-2); }
.empty a { color: var(--danger); font-weight: 700; text-decoration: underline; }

@media (hover: hover) {
  .tile:hover { border-color: var(--accent); }
}
</style>
