<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Ban, ChevronDown, ChevronRight, Info, Phone } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import StepList from '../components/StepList.vue'
import { lessonsForSituation } from '../data/lessons'
import { situationById } from '../data/situations'
import { icons } from '../icons'
import { fmt } from '../lib/fmt'

const route = useRoute()
const router = useRouter()
const s = computed(() => situationById[route.params.id])

watchEffect(() => {
  if (!s.value) router.replace('/')
})

const vital = computed(() => s.value?.group === 'vital')
const lessonLinks = computed(() => (s.value ? lessonsForSituation(s.value.id) : []))
</script>

<template>
  <div v-if="s" class="screen" :class="{ withCta: s.cta }">
    <TopBar :title="s.title" back />

    <header class="pad head">
      <component :is="icons[s.icon]" :size="40" :stroke-width="1.9" class="hico" :class="{ vital }" />
      <div>
        <h2>{{ s.title }}</h2>
        <p v-if="s.sub" class="sub">{{ s.sub }}</p>
      </div>
    </header>

    <div class="pad stack">
      <a v-if="s.call === 'now'" class="callbar now" href="tel:112">
        <Phone :size="28" :stroke-width="2.4" />
        <span class="ct">
          <strong>Appelez le 112</strong>
          <small>Gratuit · toute l’Europe</small>
        </span>
        <ChevronRight :size="24" />
      </a>
      <div v-else-if="s.call === 'maybe'" class="callbar maybe">
        <Phone :size="22" :stroke-width="2.4" />
        <p class="ct">{{ s.callWhen }}</p>
        <a class="mini" href="tel:112">112</a>
      </div>

      <section v-if="s.hub" class="hub" aria-labelledby="hub-q">
        <h3 id="hub-q">{{ s.hub.question }}</h3>
        <ul>
          <li v-for="c in s.hub.choices" :key="c.to">
            <RouterLink :to="c.to" class="choice">
              <span>{{ c.label }}</span>
              <ChevronRight :size="22" />
            </RouterLink>
          </li>
        </ul>
      </section>

      <template v-for="(sec, i) in s.sections" :key="i">
        <details v-if="sec.collapsed" class="sec">
          <summary class="sec-head" :class="sec.tone">
            <span class="sh-text">
              <h3>{{ sec.title }}</h3>
              <span v-if="sec.sub" class="sub2">{{ sec.sub }}</span>
            </span>
            <ChevronDown :size="22" class="chev" />
          </summary>
          <StepList :steps="sec.steps" />
        </details>

        <section v-else class="sec">
          <div v-if="sec.title" class="sec-head" :class="sec.tone">
            <span class="sh-text">
              <h3>{{ sec.title }}</h3>
              <span v-if="sec.sub" class="sub2">{{ sec.sub }}</span>
            </span>
          </div>
          <StepList :steps="sec.steps" />
        </section>
      </template>

      <section v-if="s.avoid" class="avoid" aria-label="À ne pas faire">
        <h3><Ban :size="20" :stroke-width="2.4" /> À ne pas faire</h3>
        <ul>
          <li v-for="(a, i) in s.avoid" :key="i" v-html="fmt(a)"></li>
        </ul>
      </section>

      <section v-if="s.signs" class="signs">
        <h3 class="eyebrow">À reconnaître</h3>
        <ul>
          <li v-for="(g, i) in s.signs" :key="i">{{ g }}</li>
        </ul>
      </section>

      <p v-if="s.note" class="note"><Info :size="20" :stroke-width="2.2" /><span v-html="fmt(s.note)"></span></p>

      <nav v-if="s.see || lessonLinks.length" class="see" aria-label="Voir aussi">
        <span class="eyebrow">Voir aussi</span>
        <RouterLink v-for="l in lessonLinks" :key="l.id" :to="`/apprendre/${l.id}`" class="chip">
          Approfondir : {{ l.title }} <ChevronRight :size="18" />
        </RouterLink>
        <RouterLink v-for="l in s.see" :key="l.to" :to="l.to" class="chip">
          {{ l.label }} <ChevronRight :size="18" />
        </RouterLink>
      </nav>
    </div>

    <div v-if="s.cta" class="cta">
      <RouterLink :to="s.cta.to" class="btn btn-primary btn-block big">{{ s.cta.label }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.withCta { padding-bottom: calc(96px + env(safe-area-inset-bottom)); }
.head { display: flex; align-items: center; gap: var(--s-4); padding-top: var(--s-2); padding-bottom: var(--s-4); }
.head h2 { font-size: var(--fs-xl); line-height: 1.05; }
.hico { color: var(--accent); }
.hico.vital { color: var(--danger); }
.sub { color: var(--text-2); margin-top: 2px; }

.stack { display: grid; gap: var(--s-5); }

/* Bandeau d'appel */
.callbar { display: flex; align-items: center; gap: var(--s-3); border-radius: var(--radius); }
.callbar.now {
  padding: var(--s-4);
  background: var(--danger);
  color: var(--on-danger);
  min-height: 68px;
  transition: transform 0.15s var(--ease);
}
.callbar.now:active { transform: scale(0.98); }
.callbar .ct { flex: 1; display: grid; line-height: 1.2; }
.callbar.now strong { font-family: var(--font-display); font-size: var(--fs-lg); font-weight: 750; }
.callbar.now small { font-size: var(--fs-sm); opacity: 0.9; }
.callbar.maybe { padding: var(--s-3) var(--s-3) var(--s-3) var(--s-4); background: var(--danger-soft); color: var(--text); border: 1px solid var(--danger-line); }
.callbar.maybe > svg { color: var(--danger); }
.callbar.maybe p { font-weight: 700; line-height: 1.3; }
.mini {
  display: grid; place-items: center; min-width: 64px; min-height: 48px; padding: 0 var(--s-3);
  border-radius: 12px; background: var(--danger); color: var(--on-danger);
  font-family: var(--font-display); font-weight: 750; font-size: var(--fs-md);
}

/* Aiguillage « malaise » */
.hub h3 { font-size: var(--fs-lg); margin-bottom: var(--s-3); }
.hub ul { display: grid; gap: var(--s-2); }
.choice {
  display: flex; align-items: center; justify-content: space-between; gap: var(--s-3);
  min-height: 58px; padding: var(--s-3) var(--s-4);
  border-radius: 14px; background: var(--surface); border: 1px solid var(--line);
  font-weight: 700; line-height: 1.25; color: var(--text);
}
.choice svg { color: var(--accent); }
.choice:active { background: var(--surface-2); }

/* Sections d'étapes */
.sec-head {
  display: flex; align-items: center; justify-content: space-between; gap: var(--s-3);
  padding: var(--s-3) var(--s-4); margin-bottom: var(--s-2);
  border-radius: 12px; background: var(--surface-2); color: var(--text);
  list-style: none; cursor: default;
}
.sec-head h3 { font-size: var(--fs-md); }
.sec-head .sub2 { display: block; font-size: var(--fs-sm); color: var(--text-2); margin-top: 2px; line-height: 1.3; font-weight: 400; }
.sec-head.ok { background: var(--ok-soft); }
.sec-head.ok h3 { color: var(--ok); }
.sec-head.danger { background: var(--danger-soft); }
.sec-head.danger h3 { color: var(--danger); }
details.sec > summary { cursor: pointer; }
details.sec > summary::-webkit-details-marker { display: none; }
.chev { flex: none; transition: transform 0.2s var(--ease); }
details[open] .chev { transform: rotate(180deg); }

/* À ne pas faire */
.avoid { padding: var(--s-4); border-radius: var(--radius); background: var(--danger-soft); border: 1px solid var(--danger-line); }
.avoid h3 { display: flex; align-items: center; gap: var(--s-2); font-size: var(--fs-md); color: var(--danger); margin-bottom: var(--s-2); }
.avoid ul { display: grid; gap: var(--s-2); }
.avoid li { line-height: 1.35; }

.signs ul { margin-top: var(--s-2); display: grid; gap: 6px; }
.signs li { position: relative; padding-left: var(--s-4); color: var(--text-2); line-height: 1.35; }
.signs li::before { content: ''; position: absolute; left: 2px; top: 0.6em; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }

.note {
  display: flex; gap: var(--s-3); align-items: flex-start;
  padding: var(--s-4); border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line);
  color: var(--text-2); font-size: var(--fs-sm); line-height: 1.45;
}
.note svg { margin-top: 1px; color: var(--accent); }

.see { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-2); }
.see .eyebrow { width: 100%; }
.chip {
  display: inline-flex; align-items: center; gap: 4px; min-height: 44px; padding: 0 var(--s-3) 0 var(--s-4);
  border-radius: 999px; background: var(--accent-soft); color: var(--accent-strong); font-weight: 700; font-size: var(--fs-sm);
}

.cta {
  position: fixed; inset: auto 0 0 0; z-index: 15;
  padding: var(--s-3) var(--gutter) calc(var(--s-3) + env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--bg) 70%, transparent);
}
.cta .btn { max-width: calc(var(--maxw) - 2 * var(--gutter)); margin-inline: auto; display: flex; }
.big { min-height: 60px; font-size: var(--fs-md); box-shadow: var(--shadow); text-align: center; }
</style>
