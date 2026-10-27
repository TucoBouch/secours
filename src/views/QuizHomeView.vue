<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, Play, RotateCcw } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import QuizReminder from '../components/QuizReminder.vue'
import StudyTabs from '../components/StudyTabs.vue'
import { QUESTION_COUNT } from '../data/quiz'
import { ago, formatDateTime } from '../lib/dates'
import { HISTORY_MAX, QUIZ_LENGTH, abandon, quiz, reminder, startQuiz } from '../quiz'

const router = useRouter()

const current = computed(() => quiz.current)
const answered = computed(() => current.value?.items.filter((i) => i.picked !== null).length ?? 0)
const due = computed(() => reminder().due)

function begin() {
  startQuiz()
  router.push('/quiz/jouer')
}
function resume() {
  router.push('/quiz/jouer')
}
function restart() {
  abandon()
  begin()
}

const ok = (item) => item.picked === item.answer
</script>

<template>
  <div class="screen">
    <TopBar title="Apprendre" gear />

    <div class="pad tabs"><StudyTabs /></div>

    <main class="pad stack">
      <QuizReminder v-if="due" variant="page" />

      <section class="intro" aria-labelledby="q-title">
        <h2 id="q-title">Révisez les bons réflexes</h2>
        <p>
          {{ QUIZ_LENGTH }} questions à choix multiple, tirées au hasard parmi {{ QUESTION_COUNT }}. À chaque réponse,
          vous voyez la bonne réponse et pourquoi.
        </p>

        <template v-if="current">
          <p class="progress">Quiz en cours : {{ answered }} question{{ answered > 1 ? 's' : '' }} sur {{ QUIZ_LENGTH }}</p>
          <button type="button" class="btn btn-primary btn-block big" @click="resume">
            <Play :size="22" :stroke-width="2.4" /> Reprendre le quiz
          </button>
          <button type="button" class="btn btn-block" @click="restart">
            <RotateCcw :size="20" /> Abandonner et recommencer
          </button>
        </template>
        <button v-else type="button" class="btn btn-primary btn-block big" @click="begin">
          <Play :size="22" :stroke-width="2.4" /> Commencer un quiz
        </button>
      </section>

      <section aria-labelledby="q-hist">
        <h2 id="q-hist" class="hh">Vos derniers quiz</h2>
        <p v-if="!quiz.history.length" class="empty">Aucun quiz pour l’instant. Le résultat de chaque quiz apparaîtra ici.</p>
        <ul v-else class="hist">
          <li v-for="h in quiz.history" :key="h.id">
            <RouterLink :to="`/quiz/resultat/${h.id}`" class="row">
              <span class="score"><strong>{{ h.score }}</strong>/{{ h.total }}</span>
              <span class="meta">
                <span class="date">{{ formatDateTime(h.date) }}</span>
                <span class="ago">{{ ago(h.date) }}</span>
                <span class="dots" aria-hidden="true">
                  <i v-for="(item, i) in h.items" :key="i" :class="ok(item) ? 'ok' : 'ko'"></i>
                </span>
              </span>
              <ChevronRight :size="22" class="chev" />
            </RouterLink>
          </li>
        </ul>
        <p v-if="quiz.history.length" class="foot">Les {{ HISTORY_MAX }} derniers quiz sont conservés sur cet appareil.</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.tabs { padding-top: var(--s-1); }
.stack { display: grid; gap: var(--s-6); padding-top: var(--s-5); }
.intro { display: grid; gap: var(--s-3); }
.intro h2 { font-size: var(--fs-xl); line-height: 1.05; }
.intro p { color: var(--text-2); line-height: 1.5; }
.intro .progress { color: var(--text); font-weight: 700; margin-top: var(--s-2); }
.big { min-height: 60px; font-size: var(--fs-lg); }
.intro .btn:first-of-type { margin-top: var(--s-2); }

.hh { font-size: var(--fs-lg); margin-bottom: var(--s-3); }
.empty { color: var(--text-2); }
.hist { display: grid; gap: var(--s-2); }
.row {
  display: flex; align-items: center; gap: var(--s-4);
  padding: var(--s-3) var(--s-4); min-height: 76px;
  border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line);
  color: var(--text);
}
.row:active { background: var(--surface-2); }
.score { font-family: var(--font-display); font-weight: 650; font-size: var(--fs-md); color: var(--text-2); min-width: 4rem; }
.score strong { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }
.meta { flex: 1; min-width: 0; display: grid; gap: 1px; }
.date { font-weight: 700; font-size: var(--fs-sm); line-height: 1.3; }
.ago { color: var(--text-2); font-size: var(--fs-xs); }
.dots { display: flex; gap: 3px; margin-top: 6px; }
.dots i { width: 14px; height: 6px; border-radius: 3px; background: var(--line); }
.dots i.ok { background: var(--ok); }
.dots i.ko { background: var(--danger); }
.chev { color: var(--text-2); flex: none; }
.foot { margin-top: var(--s-3); color: var(--text-2); font-size: var(--fs-xs); }
</style>
