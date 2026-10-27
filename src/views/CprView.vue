<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { Play, Square, Sun, Timer, Vibrate, Volume2, VolumeX } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import TorsoFigure from '../components/TorsoFigure.vue'
import { useMetronome } from '../composables/useMetronome'
import { useWakeLock } from '../composables/useWakeLock'
import { settings } from '../settings'

const router = useRouter()
const torso = ref(null)

const CYCLE = 30
const BREATH_SECONDS = 5
const TEMPOS = [100, 110, 120]

const pos = ref(0) // 1..30 : position dans la série de compressions
const total = ref(0)
const elapsed = ref(0)
const breathing = ref(false)
const breathLeft = ref(0)
const wakeTried = ref(false)
const canVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

let clock = 0
let breathTimer = 0
let t0 = 0

const wake = useWakeLock()

const metro = useMetronome({
  getBpm: () => settings.cpr.bpm,
  getCycle: () => (settings.cpr.ventilations ? CYCLE : 0),
  isSound: () => settings.cpr.sound,
  getVolume: () => settings.cpr.volume,
  onBeat: (p) => {
    pos.value = ((p - 1) % CYCLE) + 1
    total.value++
    torso.value?.pulse(60000 / settings.cpr.bpm)
    if (settings.cpr.vibrate && canVibrate) navigator.vibrate(18)
  },
  onCycleEnd: startBreaths,
})

const running = metro.running

function startBreaths() {
  breathing.value = true
  breathLeft.value = BREATH_SECONDS
  if (canVibrate && settings.cpr.vibrate) navigator.vibrate([60, 80, 60])
  clearInterval(breathTimer)
  breathTimer = setInterval(() => {
    breathLeft.value--
    if (breathLeft.value <= 0) endBreaths()
  }, 1000)
}

function endBreaths() {
  clearInterval(breathTimer)
  breathing.value = false
  metro.resume()
}

async function start() {
  pos.value = 0
  total.value = 0
  elapsed.value = 0
  breathing.value = false
  t0 = performance.now()
  clearInterval(clock)
  clock = setInterval(() => (elapsed.value = Math.floor((performance.now() - t0) / 1000)), 250)
  await metro.start()
  if (settings.cpr.keepAwake) wake.enable().finally(() => (wakeTried.value = true))
}

function stop() {
  metro.stop()
  clearInterval(clock)
  clearInterval(breathTimer)
  breathing.value = false
}

function toggle() {
  if (running.value) stop()
  else start()
}

onMounted(() => {
  if (settings.cpr.keepAwake) wake.enable().finally(() => (wakeTried.value = true))
  else wakeTried.value = true
})

onBeforeUnmount(() => {
  clearInterval(clock)
  clearInterval(breathTimer)
})

/* Un retour accidentel ne doit pas couper le tempo en pleine réanimation. */
const confirmLeave = ref(false)
let leaveOk = false
onBeforeRouteLeave(() => {
  if (running.value && !leaveOk) {
    confirmLeave.value = true
    return false
  }
})
function leave() {
  leaveOk = true
  stop()
  if (window.history.state?.back) router.back()
  else router.push('/')
}

const time = computed(() => {
  const m = Math.floor(elapsed.value / 60)
  const s = elapsed.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const wakeText = computed(() => {
  if (wake.active.value) return 'Écran maintenu allumé'
  if (!settings.cpr.keepAwake) return 'Maintien de l’écran désactivé (réglages)'
  return wakeTried.value ? 'Maintien de l’écran indisponible' : 'Activation du maintien de l’écran…'
})
</script>

<template>
  <div class="screen cpr">
    <TopBar title="Massage cardiaque" back />

    <main class="pad">
      <p class="status" :class="{ on: wake.active.value }">
        <Sun :size="16" :stroke-width="2.4" />{{ wakeText }}
      </p>

      <div class="stage-wrap">
        <div class="stage" :class="{ live: running, paused: breathing }">
          <TorsoFigure ref="torso" />
          <p class="where">Centre de la poitrine<br /><span>bras tendus, à la verticale</span></p>
        </div>
        <div v-if="breathing" class="breaths" role="status">
          <strong>2 insufflations</strong>
          <span>Reprise dans {{ breathLeft }} s</span>
          <button type="button" class="resume" @click="endBreaths">Reprendre maintenant</button>
        </div>
      </div>

      <div class="readout" aria-live="off">
        <div class="count" :class="{ idle: !running }">
          <span class="big">{{ running ? pos || 1 : 0 }}</span>
          <span class="of">/ {{ CYCLE }}</span>
        </div>
        <dl class="meta">
          <div><dt>Tempo</dt><dd>{{ settings.cpr.bpm }}<small>/min</small></dd></div>
          <div><dt>Durée</dt><dd>{{ time }}</dd></div>
          <div><dt>Total</dt><dd>{{ total }}</dd></div>
        </dl>
      </div>

      <p class="hint">
        Enfoncez de <strong>5 à 6 cm</strong>, laissez la poitrine <strong>remonter complètement</strong>.
      </p>

      <section class="tune" aria-label="Réglages du tempo">
        <div class="tempos" role="radiogroup" aria-label="Tempo">
          <button
            v-for="b in TEMPOS"
            :key="b"
            type="button"
            role="radio"
            :aria-checked="settings.cpr.bpm === b"
            :class="{ on: settings.cpr.bpm === b }"
            @click="settings.cpr.bpm = b"
          >
            {{ b }}
          </button>
        </div>
        <div class="toggles">
          <button type="button" class="tg" :aria-pressed="settings.cpr.sound" @click="settings.cpr.sound = !settings.cpr.sound">
            <component :is="settings.cpr.sound ? Volume2 : VolumeX" :size="22" /> Son
          </button>
          <button v-if="canVibrate" type="button" class="tg" :aria-pressed="settings.cpr.vibrate" @click="settings.cpr.vibrate = !settings.cpr.vibrate">
            <Vibrate :size="22" /> Vibration
          </button>
          <button type="button" class="tg" :aria-pressed="settings.cpr.ventilations" @click="settings.cpr.ventilations = !settings.cpr.ventilations">
            <Timer :size="22" /> Pause 30 : 2
          </button>
        </div>
      </section>

      <section class="recap" aria-labelledby="rc">
        <h2 id="rc">Rappel</h2>
        <ul>
          <li><strong>Appelez le 112</strong>, faites apporter un DEA.</li>
          <li>Personne <strong>sur le dos</strong>, sur un sol dur.</li>
          <li>Mains superposées, <strong>bras tendus</strong>, épaules au-dessus des mains.</li>
          <li>DEA arrivé : <strong>suivez ses instructions</strong> vocales.</li>
          <li>Ne vous arrêtez pas avant l’arrivée des secours.</li>
          <li>Enfant : une main. Nourrisson : deux doigts, 1/3 de la poitrine.</li>
        </ul>
        <RouterLink to="/techniques?t=rcp" class="more">Technique complète, avec bouche-à-bouche</RouterLink>
      </section>
    </main>

    <div class="dock">
      <button type="button" class="go" :class="{ stop: running }" @click="toggle">
        <component :is="running ? Square : Play" :size="26" :stroke-width="2.6" :fill="running ? 'currentColor' : 'none'" />
        {{ running ? 'Arrêter le tempo' : 'Démarrer le tempo' }}
      </button>
    </div>

    <div v-if="confirmLeave" class="scrim" @click.self="confirmLeave = false">
      <div class="sheet" role="alertdialog" aria-labelledby="lv-t" aria-modal="true">
        <h2 id="lv-t">Arrêter le massage ?</h2>
        <p>Le tempo s’arrête si vous quittez cet écran.</p>
        <button type="button" class="btn btn-primary btn-block" @click="confirmLeave = false">Continuer le massage</button>
        <button type="button" class="btn btn-block" @click="leave">Quitter</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cpr { padding-bottom: calc(110px + env(safe-area-inset-bottom)); }

.status {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: var(--fs-xs); font-weight: 700; color: var(--text-2);
}
.status.on { color: var(--ok); }

.stage-wrap { position: relative; width: min(100%, 300px); margin: var(--s-3) auto 0; }
.stage { position: relative; transition: filter 0.2s; }
.stage.paused { filter: saturate(0.3) opacity(0.55); }
.where {
  position: absolute; right: -4px; top: 46%;
  max-width: 110px; padding: 6px 10px; border-radius: 10px;
  background: var(--surface); border: 1px solid var(--line);
  font-size: var(--fs-xs); font-weight: 700; line-height: 1.2; color: var(--text);
  box-shadow: var(--shadow);
  pointer-events: none;
}
.where span { font-weight: 400; color: var(--text-2); }

.readout { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: var(--s-4); margin-top: var(--s-3); }
.count { display: flex; align-items: baseline; gap: 6px; white-space: nowrap; }
.big {
  font-family: var(--font-display); font-weight: 800; font-variant-numeric: tabular-nums;
  font-size: clamp(4rem, 22vw, 5.5rem); line-height: 0.9; letter-spacing: -0.03em;
  color: var(--accent-strong);
}
.count.idle .big { color: var(--text-2); opacity: 0.5; }
.of { font-family: var(--font-display); font-weight: 650; font-size: var(--fs-lg); color: var(--text-2); }
.meta { display: grid; gap: 2px; margin: 0; min-width: 0; }
.meta div { display: flex; align-items: baseline; justify-content: space-between; gap: var(--s-3); padding-block: 3px; border-bottom: 1px solid var(--line); }
.meta div:last-child { border-bottom: 0; }
.meta dt { font-size: var(--fs-xs); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-2); }
.meta dd { margin: 0; font-family: var(--font-display); font-weight: 750; font-size: var(--fs-md); font-variant-numeric: tabular-nums; white-space: nowrap; }
.meta small { font-size: var(--fs-xs); font-weight: 600; color: var(--text-2); margin-left: 1px; }

.hint { margin-top: var(--s-3); text-align: center; color: var(--text-2); font-size: var(--fs-sm); }
.hint strong { color: var(--text); }
.breaths {
  position: absolute; inset: 18% 4% auto; z-index: 2;
  display: grid; gap: 2px; justify-items: center; padding: var(--s-4);
  border-radius: var(--radius); background: var(--accent); color: var(--on-accent); text-align: center;
  box-shadow: var(--shadow);
}
.breaths strong { font-family: var(--font-display); font-size: var(--fs-xl); line-height: 1.05; }
.resume { margin-top: var(--s-2); min-height: 44px; padding: 0 var(--s-4); border-radius: 999px; background: var(--on-accent); color: var(--accent-strong); font-weight: 700; }

.tune { margin-top: var(--s-5); display: grid; gap: var(--s-3); }
.tempos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 4px; border-radius: 14px; background: var(--surface-2); }
.tempos button {
  min-height: 50px; border-radius: 10px;
  font-family: var(--font-display); font-weight: 750; font-size: var(--fs-lg); color: var(--text-2);
}
.tempos button.on { background: var(--surface); color: var(--text); box-shadow: 0 1px 3px oklch(30% 0.03 var(--h) / 0.2); }
.toggles { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: var(--s-2); }
.tg {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  min-height: 64px; padding: var(--s-2); border-radius: 14px;
  border: 1.5px solid var(--line); background: var(--surface); color: var(--text-2);
  font-size: var(--fs-xs); font-weight: 700; text-align: center; line-height: 1.15;
}
.tg[aria-pressed='true'] { background: var(--accent-soft); border-color: var(--accent); color: var(--accent-strong); }

.recap { margin-top: var(--s-6); padding: var(--s-4); border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line); }
.recap h2 { font-size: var(--fs-md); margin-bottom: var(--s-2); }
.recap ul { display: grid; gap: 8px; }
.recap li { position: relative; padding-left: var(--s-4); font-size: var(--fs-sm); line-height: 1.4; color: var(--text-2); }
.recap li::before { content: ''; position: absolute; left: 2px; top: 0.55em; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
.recap strong { color: var(--text); }
.more { display: inline-block; margin-top: var(--s-3); font-weight: 700; color: var(--accent-strong); text-decoration: underline; text-underline-offset: 3px; }

.dock {
  position: fixed; inset: auto 0 0 0; z-index: 15;
  padding: var(--s-3) var(--gutter) calc(var(--s-3) + env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--bg) 72%, transparent);
}
.go {
  display: flex; align-items: center; justify-content: center; gap: var(--s-3);
  width: 100%; max-width: calc(var(--maxw) - 2 * var(--gutter)); min-height: 68px; margin-inline: auto;
  border-radius: 18px; background: var(--accent); color: var(--on-accent);
  font-family: var(--font-display); font-weight: 750; font-size: var(--fs-lg);
  box-shadow: var(--shadow);
  transition: transform 0.15s var(--ease);
}
.go:active { transform: scale(0.98); }
.go.stop { background: var(--surface-2); color: var(--text); box-shadow: inset 0 0 0 2px var(--line); }

.scrim { position: fixed; inset: 0; z-index: 40; display: flex; align-items: flex-end; justify-content: center; background: oklch(15% 0.02 var(--h) / 0.55); }
.sheet {
  width: 100%; max-width: var(--maxw); display: grid; gap: var(--s-3);
  padding: var(--s-5) var(--gutter) calc(var(--s-5) + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0; background: var(--surface);
  animation: sheet-in 0.25s var(--ease);
}
.sheet h2 { font-size: var(--fs-lg); }
.sheet p { color: var(--text-2); }
@keyframes sheet-in { from { transform: translateY(24px); opacity: 0; } to { transform: none; opacity: 1; } }
</style>
