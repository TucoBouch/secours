// Navigation au clavier dans un groupe de choix exclusifs (role="radiogroup" / "tablist") :
// une seule tabulation pour entrer dans le groupe, puis les flèches (ou Début / Fin)
// déplacent la sélection, comme le prévoit le motif ARIA « roving tabindex ».
const ITEMS = '[role="radio"],[role="tab"]'
const STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

const items = (el) => [...el.querySelectorAll(ITEMS)]

function sync(el) {
  const all = items(el)
  const current = all.find((i) => i.getAttribute('aria-checked') === 'true' || i.getAttribute('aria-selected') === 'true') ?? all[0]
  all.forEach((i) => (i.tabIndex = i === current ? 0 : -1))
}

function onKey(e) {
  const all = items(e.currentTarget)
  const at = all.indexOf(document.activeElement)
  if (at < 0) return
  let to
  if (e.key in STEP) to = (at + STEP[e.key] + all.length) % all.length
  else if (e.key === 'Home') to = 0
  else if (e.key === 'End') to = all.length - 1
  else return
  e.preventDefault()
  all[to].focus()
  all[to].click()
}

export const vRoving = {
  mounted(el) {
    el.addEventListener('keydown', onKey)
    sync(el)
  },
  updated: sync,
  unmounted(el) {
    el.removeEventListener('keydown', onKey)
  },
}
