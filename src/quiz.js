import { reactive, watch } from 'vue'
import { questions } from './data/quiz'

const KEY = 'super-lecture:quiz:v1'

export const QUIZ_LENGTH = 10
export const HISTORY_MAX = 5
const SNOOZE_MS = 24 * 60 * 60 * 1000 // « Plus tard » masque le rappel 24 h

// État persisté :
//  since        date de la première ouverture (sert de référence tant qu'aucun quiz n'a été fait)
//  history      les 5 derniers quiz terminés, du plus récent au plus ancien (copie complète des questions)
//  current      quiz en cours (reprise possible après fermeture), ou null
//  snoozedUntil horodatage jusqu'auquel le rappel de l'accueil est masqué
function load() {
  const base = { since: Date.now(), history: [], current: null, snoozedUntil: 0 }
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (raw && typeof raw === 'object') {
      return {
        ...base,
        ...raw,
        history: Array.isArray(raw.history) ? raw.history.slice(0, HISTORY_MAX) : [],
      }
    }
  } catch {
    /* stockage indisponible ou corrompu */
  }
  return base
}

export const quiz = reactive(load())

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(quiz))
  } catch {
    /* quota / mode privé : l'historique ne sera pas conservé */
  }
}
save() // fige la date de première ouverture
watch(quiz, save, { deep: true })

function shuffle(list) {
  const a = list.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 10 questions au hasard, en évitant celles des deux derniers quiz tant que la banque le permet.
export function startQuiz() {
  const recent = new Set(quiz.history.slice(0, 2).flatMap((h) => h.items.map((i) => i.qid)))
  let pool = questions.filter((q) => !recent.has(q.id))
  if (pool.length < QUIZ_LENGTH) pool = questions

  const items = shuffle(pool)
    .slice(0, QUIZ_LENGTH)
    .map((q) => {
      const options = shuffle([q.ok, ...q.ko])
      return { qid: q.id, topic: q.topic, q: q.q, options, answer: options.indexOf(q.ok), why: q.why, picked: null }
    })

  quiz.current = { id: String(Date.now()), startedAt: new Date().toISOString(), cursor: 0, items }
}

export function answer(index) {
  const item = quiz.current?.items[quiz.current.cursor]
  if (item && item.picked === null) item.picked = index
}

export function next() {
  const c = quiz.current
  if (c && c.cursor < c.items.length - 1) c.cursor++
}

// Enregistre le quiz dans l'historique (5 max) et renvoie son id.
export function finish() {
  const c = quiz.current
  if (!c) return null
  const entry = {
    id: c.id,
    date: new Date().toISOString(),
    score: c.items.filter((i) => i.picked === i.answer).length,
    total: c.items.length,
    items: c.items,
  }
  quiz.history.unshift(entry)
  quiz.history.splice(HISTORY_MAX)
  quiz.current = null
  quiz.snoozedUntil = 0
  return entry.id
}

export function abandon() {
  quiz.current = null
}

export const getResult = (id) => quiz.history.find((h) => h.id === id)

/* ───────────── Rappel mensuel ───────────── */

// Date du dernier quiz terminé, ou null.
export const lastQuizDate = () => (quiz.history[0] ? new Date(quiz.history[0].date) : null)

// Le rappel est dû un mois après le dernier quiz, ou un mois après la première ouverture
// si aucun quiz n'a encore été fait.
export function reminder() {
  const last = lastQuizDate()
  const ref = last ?? new Date(quiz.since)
  const due = new Date(ref)
  due.setMonth(due.getMonth() + 1)
  return { due: Date.now() >= due.getTime(), never: !last, since: ref }
}

export const reminderVisible = () => reminder().due && Date.now() >= quiz.snoozedUntil

export function snoozeReminder() {
  quiz.snoozedUntil = Date.now() + SNOOZE_MS
}
