<script setup>
import { ref } from 'vue'
import { Check, Monitor, Moon, RotateCcw, Sun } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import SegmentedControl from '../components/SegmentedControl.vue'
import ToggleRow from '../components/ToggleRow.vue'
import { palettes } from '../data/palettes'
import { resetSettings, settings } from '../settings'

const canVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

const themes = [
  { value: 'light', label: 'Clair', icon: Sun },
  { value: 'dark', label: 'Sombre', icon: Moon },
  { value: 'system', label: 'Auto', icon: Monitor },
]
const sizes = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Grand' },
  { value: 'xlarge', label: 'Très grand' },
]

const confirmReset = ref(false)
function doReset() {
  resetSettings()
  confirmReset.value = false
}
</script>

<template>
  <div class="screen">
    <TopBar title="Réglages" />

    <main class="pad stack">
      <section aria-labelledby="s-look">
        <h2 id="s-look">Apparence</h2>

        <div class="field">
          <span class="lab" id="lab-theme">Thème</span>
          <SegmentedControl v-model="settings.theme" :options="themes" label="Thème">
            <template #option="{ option }">
              <component :is="option.icon" :size="18" :stroke-width="2.2" /> {{ option.label }}
            </template>
          </SegmentedControl>
        </div>

        <div class="field">
          <span class="lab" id="lab-palette">Couleur</span>
          <div class="palette" role="radiogroup" aria-labelledby="lab-palette">
            <button
              v-for="p in palettes"
              :key="p.id"
              type="button"
              role="radio"
              class="sw"
              :data-palette="p.id"
              :aria-checked="settings.palette === p.id"
              :aria-label="p.name"
              :class="{ on: settings.palette === p.id }"
              @click="settings.palette = p.id"
            >
              <span class="dot"><Check v-if="settings.palette === p.id" :size="22" :stroke-width="3.2" /></span>
              <span class="nm">{{ p.name }}</span>
            </button>
          </div>
        </div>

        <div class="field">
          <span class="lab">Taille du texte</span>
          <SegmentedControl v-model="settings.textSize" :options="sizes" label="Taille du texte" />
        </div>
      </section>

      <section aria-labelledby="s-cpr">
        <h2 id="s-cpr">Massage cardiaque</h2>
        <div class="field">
          <label class="lab" for="bpm">Tempo : <strong>{{ settings.cpr.bpm }}</strong> compressions / min</label>
          <input id="bpm" v-model.number="settings.cpr.bpm" class="range" type="range" min="100" max="120" step="5" />
          <p class="help">La brochure recommande 100 à 120 par minute.</p>
        </div>
        <ToggleRow v-model="settings.cpr.sound" label="Son du tempo" hint="Sur iPhone, désactivez le mode silencieux pour l’entendre." />
        <div v-if="settings.cpr.sound" class="field tight">
          <label class="lab" for="vol">Volume</label>
          <input id="vol" v-model.number="settings.cpr.volume" class="range" type="range" min="0.2" max="1" step="0.05" />
        </div>
        <ToggleRow v-if="canVibrate" v-model="settings.cpr.vibrate" label="Vibration" hint="Un léger retour à chaque compression." />
        <ToggleRow v-model="settings.cpr.keepAwake" label="Garder l’écran allumé" hint="Évite la mise en veille pendant le massage." />
        <ToggleRow v-model="settings.cpr.ventilations" label="Pause pour les insufflations" hint="Après 30 compressions, 5 secondes pour 2 insufflations (30 : 2)." />
      </section>

      <section aria-labelledby="s-about" class="about">
        <h2 id="s-about">À propos</h2>
        <p>
          <strong>Premiers secours</strong> fonctionne sans connexion. Vos réglages restent sur votre téléphone (stockage local), rien n’est envoyé.
        </p>
        <p>
          Contenu d’après la brochure <em>Premiers secours</em> du CGDIS (Luxembourg, 2021). Cette application ne remplace pas une formation aux premiers secours.
        </p>
        <p class="warn">En cas de doute ou de danger vital : <a href="tel:112">appelez le 112</a>.</p>

        <button v-if="!confirmReset" type="button" class="btn btn-block" @click="confirmReset = true">
          <RotateCcw :size="20" /> Rétablir les réglages d’origine
        </button>
        <div v-else class="confirm">
          <p>Rétablir tous les réglages ?</p>
          <button type="button" class="btn btn-primary" @click="doReset">Oui, rétablir</button>
          <button type="button" class="btn" @click="confirmReset = false">Annuler</button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: var(--s-7); padding-top: var(--s-2); }
section > h2 { font-size: var(--fs-xl); margin-bottom: var(--s-4); }
.field { display: grid; gap: var(--s-2); margin-bottom: var(--s-5); }
.field.tight { margin-top: calc(var(--s-2) * -1); }
.lab { font-weight: 700; }
.help { color: var(--text-2); font-size: var(--fs-sm); }

.palette { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--s-3) var(--s-2); }
.sw { display: grid; justify-items: center; gap: 6px; min-height: 44px; padding: 4px 0; border-radius: 14px; color: var(--text-2); font-size: var(--fs-xs); font-weight: 700; }
.sw .dot {
  display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%;
  background: oklch(56% var(--c) var(--h)); color: oklch(99% 0.01 var(--h));
  box-shadow: inset 0 0 0 1px oklch(0% 0 0 / 0.12);
  transition: transform 0.18s var(--ease), box-shadow 0.18s;
}
:global(:root[data-theme='dark']) .sw .dot { background: oklch(72% var(--c) var(--h)); color: oklch(20% 0.04 var(--h)); }
.sw.on { color: var(--text); }
.sw.on .dot { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5.5px var(--text); }
.sw:active .dot { transform: scale(0.93); }

.range { width: 100%; height: 44px; accent-color: var(--accent); }

.about { display: grid; gap: var(--s-3); }
.about h2 { margin-bottom: 0; }
.about p { color: var(--text-2); line-height: 1.5; }
.about strong { color: var(--text); }
.about .warn { padding: var(--s-4); border-radius: var(--radius); background: var(--danger-soft); border: 1px solid var(--danger-line); color: var(--text); font-weight: 700; }
.about .warn a { color: var(--danger); text-decoration: underline; }
.about .btn { margin-top: var(--s-2); }
.confirm { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-2); margin-top: var(--s-2); }
.confirm p { grid-column: 1 / -1; color: var(--text); font-weight: 700; }
</style>
