import { onBeforeUnmount, ref } from 'vue'
import NoSleep from 'nosleep.js'

// Garde l'écran allumé. Utilise l'API Screen Wake Lock ; à défaut (vieux iOS),
// NoSleep.js prend le relais avec une vidéo muette en boucle.
export function useWakeLock() {
  const active = ref(false)
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  let sentinel = null
  let noSleep = null
  let wanted = false

  async function acquire() {
    if (!wanted) return
    if (supported) {
      try {
        sentinel = await navigator.wakeLock.request('screen')
        active.value = true
        sentinel.addEventListener('release', () => {
          active.value = false
          sentinel = null
        })
      } catch {
        active.value = false
      }
      return
    }
    try {
      noSleep ??= new NoSleep()
      await noSleep.enable()
      active.value = true
    } catch {
      active.value = false // nécessite parfois un geste de l'utilisateur : réessayé au démarrage
    }
  }

  // Le verrou est libéré par le navigateur quand l'onglet est masqué : on le redemande au retour.
  function onVisible() {
    if (wanted && document.visibilityState === 'visible' && !sentinel) acquire()
  }

  async function enable() {
    if (!wanted) document.addEventListener('visibilitychange', onVisible)
    wanted = true
    await acquire()
  }

  async function disable() {
    wanted = false
    document.removeEventListener('visibilitychange', onVisible)
    try {
      await sentinel?.release()
    } catch {
      /* déjà libéré */
    }
    sentinel = null
    try {
      noSleep?.disable()
    } catch {
      /* ignore */
    }
    active.value = false
  }

  onBeforeUnmount(disable)

  return { active, supported, enable, disable }
}
