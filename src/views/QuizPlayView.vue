<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Check, X } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import { answer, finish, next, quiz } from '../quiz'

const router = useRouter()
const heading = ref(null)
const feedback = ref(null)
const letters = ['A', 'B', 'C', 'D']

const c = computed(() => quiz.current)
const item = computed(() => c.value?.items[c.value.cursor])
const total = computed(() => c.value?.items.length ?? 0)
const answered = computed(() => item.value?.picked !== null && item.value?.picked !== undefined)
const right = computed(() => answered.value && item.value.picked === item.value.answer)
const isLast = computed(() => c.value && c.value.cursor === total.value - 1)

// Pas de quiz en cours (lien direct, quiz déjà terminé) : retour à la page du quiz.
onMounted(() => {
  if (!quiz.current) router.replace('/quiz')
})

function stateOf(i) {
  if (!answered.value) return ''
  if (i === item.value.answer) return 'right'
  if (i === item.value.picked) return 'wrong'
  return 'dim'
}

async function pick(i) {
  if (answered.value) return
  answer(i)
  await nextTick()
  feedback.value?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

function advance() {
  if (isLast.value) {
    const id = finish()
    // replace : « retour » depuis le résultat ramène à la page du quiz, pas à la dernière question
    router.replace(`/quiz/resultat/${id}`)
  } else {
    next()
  }
}

// À chaque nouvelle question : haut de page et focus sur l'énoncé (lecteurs d'écran).
watch(
  () => c.value?.cursor,
  async () => {
    window.scrollTo({ top: 0 })
    await nextTick()
    heading.value?.focus({ preventScroll: true })
  },
)

const seg = (i) => {
  const it = c.value.items[i]
  if (it.picked === null) return i === c.value.cursor ? 'now' : ''
  return it.picked === it.answer ? 'ok' : 'ko'
}
</script>

<template>
  <div v-if="c && item" class="screen play">
    <TopBar title="Quiz" back :call="false" />

    <div class="pad">
      <div class="bar" role="progressbar" :aria-valuenow="c.cursor + 1" aria-valuemin="1" :aria-valuemax="total" :aria-label="`Question ${c.cursor + 1} sur ${total}`">
        <i v-for="(_, i) in c.items" :key="i" :class="seg(i)"></i>
      </div>
      <p class="count">Question {{ c.cursor + 1 }} sur {{ total }} · {{ item.topic }}</p>

      <h2 ref="heading" class="q" tabindex="-1">{{ item.q }}</h2>

      <ul class="opts">
        <li v-for="(o, i) in item.options" :key="i">
          <button type="button" class="opt" :class="stateOf(i)" :disabled="answered" @click="pick(i)">
            <span class="letter" aria-hidden="true">{{ letters[i] }}</span>
            <span class="txt">{{ o }}</span>
            <Check v-if="stateOf(i) === 'right'" :size="24" :stroke-width="3" class="mark" />
            <X v-else-if="stateOf(i) === 'wrong'" :size="24" :stroke-width="3" class="mark" />
          </button>
        </li>
      </ul>

      <section v-if="answered" ref="feedback" class="fb" :class="right ? 'ok' : 'ko'" aria-live="polite">
        <h3>{{ right ? 'Bonne réponse !' : 'Pas tout à fait' }}</h3>
        <p v-if="!right" class="good">La bonne réponse : <strong>{{ item.options[item.answer] }}</strong></p>
        <p class="why">{{ item.why }}</p>
      </section>
    </div>

    <div v-if="answered" class="dock">
      <button type="button" class="btn btn-primary btn-block next" @click="advance">
        {{ isLast ? 'Voir le résultat' : 'Question suivante' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.play { padding-bottom: calc(110px + env(safe-area-inset-bottom)); }

.bar { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 4px; margin-top: var(--s-1); }
.bar i { height: 6px; border-radius: 3px; background: var(--line); transition: background-color 0.25s var(--ease); }
.bar i.now { background: var(--accent); }
.bar i.ok { background: var(--ok); }
.bar i.ko { background: var(--danger); }
.count { margin-top: var(--s-3); font-size: var(--fs-xs); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-2); }

.q { margin-top: var(--s-2); font-size: var(--fs-lg); line-height: 1.2; outline: none; }

.opts { display: grid; gap: var(--s-2); margin-top: var(--s-5); }
.opt {
  display: flex; align-items: center; gap: var(--s-3); width: 100%; min-height: 64px;
  padding: var(--s-3) var(--s-4); border-radius: 16px; text-align: left;
  background: var(--surface); border: 1.5px solid var(--line); color: var(--text);
  transition: transform 0.15s var(--ease), background-color 0.2s, border-color 0.2s, opacity 0.2s;
}
.opt:not(:disabled):active { transform: scale(0.985); background: var(--surface-2); }
.opt:disabled { cursor: default; }
.letter {
  flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 10px;
  background: var(--surface-2); font-family: var(--font-display); font-weight: 800; color: var(--text-2);
}
.txt { flex: 1; line-height: 1.3; font-size: var(--fs-base); }
.mark { flex: none; }
.opt.right { background: var(--ok-soft); border-color: var(--ok); }
.opt.right .letter { background: var(--ok); color: var(--bg); }
.opt.right .mark { color: var(--ok); }
.opt.wrong { background: var(--danger-soft); border-color: var(--danger); }
.opt.wrong .letter { background: var(--danger); color: var(--on-danger); }
.opt.wrong .mark { color: var(--danger); }
.opt.dim { opacity: 0.55; }

.fb { margin-top: var(--s-5); padding: var(--s-4); border-radius: var(--radius); display: grid; gap: var(--s-2); line-height: 1.45; }
.fb h3 { font-size: var(--fs-md); }
.fb.ok { background: var(--ok-soft); }
.fb.ok h3 { color: var(--ok); }
.fb.ko { background: var(--danger-soft); box-shadow: inset 0 0 0 1px var(--danger-line); }
.fb.ko h3 { color: var(--danger); }
.good strong { font-weight: 700; }
.why { color: var(--text-2); font-size: var(--fs-sm); }
.fb.ko .why, .fb.ok .why { color: var(--text); opacity: 0.85; }

.dock {
  position: fixed; inset: auto 0 0 0; z-index: 15;
  padding: var(--s-3) var(--gutter) calc(var(--s-3) + env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--bg) 72%, transparent);
}
.next { display: flex; max-width: calc(var(--maxw) - 2 * var(--gutter)); margin-inline: auto; min-height: 60px; font-size: var(--fs-lg); box-shadow: var(--shadow); }
</style>
