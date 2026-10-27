import { onBeforeUnmount, ref } from 'vue'

const LOOKAHEAD = 0.2 // secondes planifiées à l'avance
const TICK_MS = 25

// Métronome de précision : les bips sont planifiés sur l'horloge audio (Web Audio),
// pas sur setInterval, pour garder un tempo stable même si l'interface rame.
// Le rendu visuel (onBeat) est déclenché quand l'horloge audio atteint chaque temps.
//
// options :
//   getBpm()        tempo courant
//   getCycle()      nombre de temps par cycle (30) ou 0 pour un flux continu
//   isSound()       bip audible ?
//   getVolume()     0..1
//   onBeat(pos)     pos = 1..cycle (ou numéro de temps si continu)
//   onCycleEnd()    appelé après le dernier temps d'un cycle ; le métronome attend resume()
export function useMetronome(options) {
  const running = ref(false)
  let ctx = null
  let timer = 0
  let raf = 0
  let nextTime = 0
  let scheduled = 0
  let held = false
  let queue = []

  const now = () => (ctx ? ctx.currentTime : performance.now() / 1000)

  function ensureContext() {
    if (ctx || typeof window === 'undefined') return
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    try {
      ctx = new AC({ latencyHint: 'interactive' })
    } catch {
      ctx = null
    }
  }

  function bip(time, accent) {
    if (!ctx) return
    const vol = Math.max(0, Math.min(1, options.getVolume())) ** 2 * 0.9
    if (vol <= 0) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(accent ? 1320 : 990, time)
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(vol, time + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09)
    osc.connect(gain).connect(ctx.destination)
    osc.start(time)
    osc.stop(time + 0.1)
  }

  function schedule() {
    const horizon = now() + LOOKAHEAD
    while (!held && nextTime < horizon) {
      const cycle = options.getCycle()
      const pos = cycle ? scheduled % cycle : scheduled
      if (options.isSound()) bip(nextTime, pos === 0)
      const last = cycle > 0 && pos === cycle - 1
      queue.push({ time: nextTime, pos: pos + 1, last })
      nextTime += 60 / Math.max(40, options.getBpm())
      scheduled++
      if (last) held = true
    }
  }

  function tick() {
    const t = now()
    while (queue.length && queue[0].time <= t) {
      const b = queue.shift()
      options.onBeat(b.pos)
      if (b.last) options.onCycleEnd?.()
    }
    raf = requestAnimationFrame(tick)
  }

  // Doit être appelé depuis un geste de l'utilisateur (politique autoplay des navigateurs).
  async function start() {
    ensureContext()
    try {
      await ctx?.resume()
    } catch {
      /* ignore */
    }
    queue = []
    scheduled = 0
    held = false
    nextTime = now() + 0.15
    running.value = true
    clearInterval(timer)
    cancelAnimationFrame(raf)
    timer = setInterval(schedule, TICK_MS)
    schedule()
    raf = requestAnimationFrame(tick)
  }

  // Reprise après la pause d'insufflations : nouveau cycle.
  function resume() {
    if (!running.value) return
    scheduled = 0
    held = false
    nextTime = now() + 0.15
  }

  function stop() {
    running.value = false
    clearInterval(timer)
    cancelAnimationFrame(raf)
    queue = []
    held = false
  }

  onBeforeUnmount(() => {
    stop()
    try {
      ctx?.close()
    } catch {
      /* ignore */
    }
    ctx = null
  })

  return { running, start, stop, resume }
}
