<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, ChevronDown, RotateCcw, X } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import { ago, formatDateTime } from '../lib/dates'
import { getResult, startQuiz } from '../quiz'

const route = useRoute()
const router = useRouter()
const letters = ['A', 'B', 'C', 'D']

const result = computed(() => getResult(route.params.id))

// Quiz introuvable (supprimé de l'historique des 5 derniers, lien ancien) : retour à la liste.
watchEffect(() => {
  if (!result.value) router.replace('/quiz')
})

const ok = (item) => item.picked === item.answer
const wrongCount = computed(() => (result.value ? result.value.total - result.value.score : 0))

const message = computed(() => {
  if (!result.value) return ''
  const r = result.value.score / result.value.total
  if (r === 1) return 'Sans faute ! Vous maîtrisez ces réflexes.'
  if (r >= 0.8) return 'Très bien. Quelques points à consolider.'
  if (r >= 0.6) return 'Bien, mais plusieurs points à revoir ci-dessous.'
  return 'À retravailler : relisez les explications ci-dessous, puis refaites un quiz.'
})

function again() {
  startQuiz()
  router.replace('/quiz/jouer')
}
</script>

<template>
  <div v-if="result" class="screen res">
    <TopBar title="Résultat du quiz" back />

    <main class="pad stack">
      <section class="score" aria-labelledby="sc">
        <p id="sc" class="big"><strong>{{ result.score }}</strong><span>/{{ result.total }}</span></p>
        <p class="msg">{{ message }}</p>
        <p class="when">{{ formatDateTime(result.date) }} · {{ ago(result.date) }}</p>
        <div class="dots" aria-hidden="true">
          <i v-for="(it, i) in result.items" :key="i" :class="ok(it) ? 'ok' : 'ko'"></i>
        </div>
      </section>

      <section aria-labelledby="rv">
        <h2 id="rv" class="rv">
          Les questions
          <small v-if="wrongCount">{{ wrongCount }} erreur{{ wrongCount > 1 ? 's' : '' }} à revoir</small>
        </h2>
        <ol class="list">
          <li v-for="(it, n) in result.items" :key="it.qid">
            <details class="item" :class="ok(it) ? 'ok' : 'ko'" :open="!ok(it)">
              <summary>
                <span class="st" aria-hidden="true">
                  <Check v-if="ok(it)" :size="18" :stroke-width="3.2" />
                  <X v-else :size="18" :stroke-width="3.2" />
                </span>
                <span class="sq">{{ n + 1 }}. {{ it.q }}<span class="sn">{{ it.topic }}</span></span>
                <ChevronDown :size="20" class="chev" aria-hidden="true" />
                <span class="sr-only">{{ ok(it) ? 'Réponse juste' : 'Réponse fausse' }}</span>
              </summary>

              <ul class="opts">
                <li
                  v-for="(o, i) in it.options"
                  :key="i"
                  :class="{ right: i === it.answer, wrong: i === it.picked && i !== it.answer }"
                >
                  <span class="letter" aria-hidden="true">{{ letters[i] }}</span>
                  <span class="t">{{ o }}</span>
                  <span v-if="i === it.answer" class="tag good">Bonne réponse</span>
                  <span v-else-if="i === it.picked" class="tag bad">Votre réponse</span>
                  <span v-if="i === it.answer && i === it.picked" class="tag mine">Votre réponse</span>
                </li>
              </ul>
              <p class="why">{{ it.why }}</p>
            </details>
          </li>
        </ol>
      </section>
    </main>

    <div class="dock">
      <button type="button" class="btn btn-primary btn-block again" @click="again">
        <RotateCcw :size="22" :stroke-width="2.4" /> Refaire un quiz
      </button>
    </div>
  </div>
</template>

<style scoped>
.res { padding-bottom: calc(110px + env(safe-area-inset-bottom)); }
.stack { display: grid; gap: var(--s-6); padding-top: var(--s-2); }

.score { display: grid; gap: var(--s-2); padding: var(--s-5) var(--s-4); border-radius: var(--radius); background: var(--accent-soft); text-align: center; justify-items: center; }
.big { font-family: var(--font-display); line-height: 0.9; }
.big strong { font-size: 5rem; font-weight: 800; letter-spacing: -0.04em; color: var(--accent-strong); }
.big span { font-size: var(--fs-xl); font-weight: 650; color: var(--text-2); }
.msg { font-family: var(--font-display); font-weight: 700; font-size: var(--fs-md); line-height: 1.25; max-width: 24ch; }
.when { color: var(--text-2); font-size: var(--fs-sm); }
.dots { display: flex; gap: 4px; margin-top: var(--s-2); }
.dots i { width: 18px; height: 7px; border-radius: 4px; background: var(--line); }
.dots i.ok { background: var(--ok); }
.dots i.ko { background: var(--danger); }

.rv { display: flex; align-items: baseline; justify-content: space-between; gap: var(--s-3); flex-wrap: wrap; font-size: var(--fs-lg); margin-bottom: var(--s-3); }
.rv small { font-family: var(--font-body); font-size: var(--fs-sm); font-weight: 700; color: var(--danger); }
.list { display: grid; }
.list > li { border-top: 1px solid var(--line); }
.list > li:last-child { border-bottom: 1px solid var(--line); }

summary { display: flex; align-items: flex-start; gap: var(--s-3); padding: var(--s-4) 0; cursor: pointer; list-style: none; min-height: 56px; }
summary::-webkit-details-marker { display: none; }
.st { flex: none; display: grid; place-items: center; width: 28px; height: 28px; margin-top: 2px; border-radius: 50%; }
.item.ok .st { background: var(--ok); color: var(--bg); }
.item.ko .st { background: var(--danger); color: var(--on-danger); }
.sq { flex: 1; display: grid; gap: 2px; font-weight: 700; line-height: 1.3; font-size: var(--fs-base); }
.sn { font-size: var(--fs-sm); color: var(--text-2); font-weight: 400; }
.chev { flex: none; margin-top: 4px; color: var(--text-2); transition: transform 0.2s var(--ease); }
details[open] .chev { transform: rotate(180deg); }

.opts { display: grid; gap: 6px; padding: 0 0 var(--s-3); }
.opts li { display: flex; align-items: center; flex-wrap: wrap; gap: var(--s-2); padding: var(--s-2) var(--s-3); border-radius: 12px; background: var(--surface-2); line-height: 1.3; font-size: var(--fs-sm); }
.opts li.right { background: var(--ok-soft); box-shadow: inset 0 0 0 1.5px var(--ok); }
.opts li.wrong { background: var(--danger-soft); box-shadow: inset 0 0 0 1.5px var(--danger); }
.letter { flex: none; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 8px; background: var(--bg); font-family: var(--font-display); font-weight: 800; font-size: var(--fs-xs); color: var(--text-2); }
.t { flex: 1 1 12rem; min-width: 0; }
.tag { padding: 2px 8px; border-radius: 999px; font-size: var(--fs-xs); font-weight: 700; white-space: nowrap; }
.tag.good { background: var(--ok); color: var(--bg); }
.tag.bad { background: var(--danger); color: var(--on-danger); }
.tag.mine { background: var(--bg); color: var(--text-2); }
.why { padding: 0 0 var(--s-4); color: var(--text-2); font-size: var(--fs-sm); line-height: 1.5; }

.dock {
  position: fixed; inset: auto 0 0 0; z-index: 15;
  padding: var(--s-3) var(--gutter) calc(var(--s-3) + env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--bg) 72%, transparent);
}
.again { display: flex; max-width: calc(var(--maxw) - 2 * var(--gutter)); margin-inline: auto; min-height: 60px; font-size: var(--fs-lg); box-shadow: var(--shadow); }
</style>
