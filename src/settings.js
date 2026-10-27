import { reactive, watch } from 'vue'

const KEY = 'super-lecture:settings:v1'

export const defaults = () => ({
  theme: 'system', // 'system' | 'light' | 'dark'
  palette: 'rouge',
  textSize: 'normal', // 'normal' | 'large' | 'xlarge'
  cpr: {
    bpm: 120,
    sound: true,
    volume: 0.8,
    vibrate: true,
    keepAwake: true,
    ventilations: false, // pause de 2 insufflations après 30 compressions
  },
})

function load() {
  const base = defaults()
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (raw && typeof raw === 'object') {
      return { ...base, ...raw, cpr: { ...base.cpr, ...(raw.cpr || {}) } }
    }
  } catch {
    /* stockage indisponible ou corrompu : on repart des valeurs par défaut */
  }
  return base
}

export const settings = reactive(load())

export function resetSettings() {
  const d = defaults()
  Object.assign(settings, d, { cpr: { ...d.cpr } })
}

const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null

function isDark() {
  return settings.theme === 'dark' || (settings.theme === 'system' && !!mq && mq.matches)
}

// Lit la couleur de fond calculée et la convertit en hex pour <meta name="theme-color">.
function syncThemeColor() {
  try {
    const css = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    if (!css) return
    const g = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    g.fillStyle = '#000'
    g.fillStyle = css
    g.fillRect(0, 0, 1, 1)
    const [r, gr, b] = g.getImageData(0, 0, 1, 1).data
    const hex = '#' + [r, gr, b].map((v) => v.toString(16).padStart(2, '0')).join('')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', hex)
  } catch {
    /* sans importance */
  }
}

export function applySettings() {
  const root = document.documentElement
  root.dataset.theme = isDark() ? 'dark' : 'light'
  root.dataset.palette = settings.palette
  root.dataset.textsize = settings.textSize
  requestAnimationFrame(syncThemeColor)
}

export function initSettings() {
  applySettings()
  watch(
    settings,
    () => {
      applySettings()
      try {
        localStorage.setItem(KEY, JSON.stringify(settings))
      } catch {
        /* quota / mode privé : les réglages ne seront pas conservés */
      }
    },
    { deep: true },
  )
  mq?.addEventListener?.('change', () => {
    if (settings.theme === 'system') applySettings()
  })
}
