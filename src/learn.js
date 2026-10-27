import { reactive, watch } from 'vue'
import { lessons } from './data/lessons'

const KEY = 'super-lecture:learn:v1'

// État persisté : read = { [idLeçon]: date ISO de lecture }
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (raw && typeof raw.read === 'object' && raw.read) {
      // on ignore les leçons qui n'existent plus (contenu mis à jour)
      const known = new Set(lessons.map((l) => l.id))
      return { read: Object.fromEntries(Object.entries(raw.read).filter(([id]) => known.has(id))) }
    }
  } catch {
    /* stockage indisponible ou corrompu */
  }
  return { read: {} }
}

export const learn = reactive(load())

watch(
  learn,
  () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(learn))
    } catch {
      /* quota / mode privé : la progression ne sera pas conservée */
    }
  },
  { deep: true },
)

export const isRead = (id) => !!learn.read[id]
export const readCount = () => lessons.filter((l) => learn.read[l.id]).length

export function setRead(id, value) {
  if (value) learn.read[id] = new Date().toISOString()
  else delete learn.read[id]
}

// Efface toutes les marques « lu » (bouton des Réglages).
export function resetRead() {
  learn.read = {}
}

// Première leçon pas encore lue, dans l'ordre du cours.
export const nextUnread = () => lessons.find((l) => !learn.read[l.id]) ?? null
