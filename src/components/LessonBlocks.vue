<script setup>
import { Info, TriangleAlert } from 'lucide-vue-next'
import { fmt } from '../lib/fmt'

// Affiche le contenu d'une leçon (voir src/data/lessons.js pour les types de blocs).
defineProps({ blocks: { type: Array, required: true } })

// Définition très courte (« 9 % », « 500 ml ») : affichée sur la même ligne que son terme.
const isShort = (def) => def.length <= 14
</script>

<template>
  <div class="blocks">
    <template v-for="(b, i) in blocks" :key="i">
      <h3 v-if="b.t === 'h'" class="bh">{{ b.text }}</h3>
      <p v-else-if="b.t === 'p'" class="bp" v-html="fmt(b.text)"></p>

      <ul v-else-if="b.t === 'ul'" class="bl">
        <li v-for="(it, j) in b.items" :key="j" v-html="fmt(it)"></li>
      </ul>

      <ol v-else-if="b.t === 'ol'" class="bo">
        <li v-for="(it, j) in b.items" :key="j">
          <span class="n" aria-hidden="true">{{ j + 1 }}</span>
          <span class="t" v-html="fmt(it)"></span>
        </li>
      </ol>

      <dl v-else-if="b.t === 'dl'" class="bd">
        <div v-for="([term, def], j) in b.items" :key="j" :class="{ short: isShort(def) }">
          <dt v-html="fmt(term)"></dt>
          <dd v-html="fmt(def)"></dd>
        </div>
      </dl>

      <aside v-else-if="b.t === 'note'" class="call note">
        <Info :size="22" :stroke-width="2.2" aria-hidden="true" />
        <div>
          <strong>{{ b.title }}</strong>
          <p v-html="fmt(b.text)"></p>
        </div>
      </aside>

      <aside v-else-if="b.t === 'warn'" class="call warn">
        <TriangleAlert :size="22" :stroke-width="2.2" aria-hidden="true" />
        <div>
          <strong>{{ b.title }}</strong>
          <p v-html="fmt(b.text)"></p>
        </div>
      </aside>
    </template>
  </div>
</template>

<style scoped>
.blocks { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-3); }
.bh { margin-top: var(--s-5); font-size: var(--fs-lg); line-height: 1.15; }
.bp { line-height: 1.6; }

.bl { display: grid; gap: var(--s-2); }
.bl li { position: relative; padding-left: var(--s-4); line-height: 1.55; }
.bl li::before { content: ''; position: absolute; left: 2px; top: 0.7em; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }

.bo { display: grid; gap: var(--s-3); }
.bo li { display: grid; grid-template-columns: 1.75rem minmax(0, 1fr); gap: var(--s-3); line-height: 1.55; }
.bo .n { font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; line-height: 1.05; color: var(--accent); font-variant-numeric: tabular-nums; }

.bd { display: grid; }
.bd > div { padding: var(--s-3) 0; border-top: 1px solid var(--line); }
.bd > div:first-child { border-top: 0; padding-top: var(--s-1); }
.bd dt { font-family: var(--font-display); font-weight: 700; font-size: var(--fs-md); line-height: 1.2; }
.bd dd { margin: 2px 0 0; line-height: 1.55; }
.bd > div.short { display: flex; align-items: baseline; justify-content: space-between; gap: var(--s-4); }
.bd > div.short dd { margin: 0; font-family: var(--font-display); font-weight: 700; font-size: var(--fs-md); font-variant-numeric: tabular-nums; color: var(--accent-strong); white-space: nowrap; }

.call { display: flex; gap: var(--s-3); align-items: flex-start; padding: var(--s-4); border-radius: var(--radius); line-height: 1.5; }
.call > svg { margin-top: 1px; }
.call strong { font-family: var(--font-display); font-size: var(--fs-md); }
.call p { margin-top: 2px; font-size: var(--fs-sm); }
.call.note { background: var(--surface); border: 1px solid var(--line); }
.call.note > svg { color: var(--accent); }
.call.warn { background: var(--danger-soft); border: 1px solid var(--danger-line); }
.call.warn > svg, .call.warn strong { color: var(--danger); }
</style>
