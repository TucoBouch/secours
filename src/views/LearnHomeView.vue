<script setup>
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import StudyTabs from '../components/StudyTabs.vue'
import { LESSON_COUNT, lessons, themes } from '../data/lessons'
import { icons } from '../icons'
import { isRead, nextUnread, readCount } from '../learn'

const byTheme = computed(() => themes.map((t) => ({ ...t, items: lessons.filter((l) => l.theme === t.id) })))
const done = computed(() => readCount())
const percent = computed(() => Math.round((done.value / LESSON_COUNT) * 100))
const next = computed(() => nextUnread())
const readIn = (theme) => theme.items.filter((l) => isRead(l.id)).length
</script>

<template>
  <div class="screen">
    <TopBar title="Apprendre" gear />

    <div class="pad tabs"><StudyTabs /></div>

    <main class="pad stack">
      <section class="intro" aria-labelledby="l-title">
        <h2 id="l-title">Approfondir, thème par thème</h2>
        <p>
          {{ LESSON_COUNT }} leçons détaillées, tirées de la brochure du CGDIS : causes, mécanismes, signes, conduite à tenir.
          Marquez chaque leçon comme lue pour suivre votre progression.
        </p>

        <div class="meter">
          <div
            class="bar"
            role="progressbar"
            aria-label="Leçons lues"
            :aria-valuenow="done"
            aria-valuemin="0"
            :aria-valuemax="LESSON_COUNT"
          >
            <i :style="{ width: percent + '%' }"></i>
          </div>
          <p class="count"><strong>{{ done }}</strong> sur {{ LESSON_COUNT }} leçons lues</p>
        </div>

        <RouterLink v-if="next" :to="`/apprendre/${next.id}`" class="btn btn-primary btn-block go">
          {{ done ? 'Continuer' : 'Commencer' }} : {{ next.title }}
        </RouterLink>
        <p v-else class="all">Tout est lu ! Testez ce que vous avez retenu avec le <RouterLink to="/quiz" replace>quiz</RouterLink>.</p>
      </section>

      <section v-for="t in byTheme" :key="t.id" class="theme" :aria-labelledby="`th-${t.id}`">
        <div class="th">
          <component :is="icons[t.icon]" :size="26" :stroke-width="2" class="thi" aria-hidden="true" />
          <h2 :id="`th-${t.id}`">{{ t.title }}</h2>
          <span class="tc">{{ readIn(t) }}/{{ t.items.length }}</span>
        </div>
        <p class="blurb">{{ t.blurb }}</p>

        <ul class="rows">
          <li v-for="l in t.items" :key="l.id">
            <RouterLink :to="`/apprendre/${l.id}`" class="row">
              <span class="st" :class="{ read: isRead(l.id) }" aria-hidden="true">
                <Check v-if="isRead(l.id)" :size="18" :stroke-width="3.2" />
              </span>
              <span class="rt">
                <span class="rtt">{{ l.title }}</span>
                <span class="rts">{{ l.summary }}</span>
              </span>
              <span class="min">{{ l.minutes }} min</span>
              <span class="sr-only">{{ isRead(l.id) ? 'Déjà lue' : 'Pas encore lue' }}</span>
            </RouterLink>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.tabs { padding-top: var(--s-1); }
.stack { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-6); padding-top: var(--s-5); }

.intro { display: grid; gap: var(--s-3); }
.intro h2 { font-size: var(--fs-xl); line-height: 1.05; }
.intro > p { color: var(--text-2); line-height: 1.5; }
.meter { display: grid; gap: var(--s-2); margin-top: var(--s-1); }
.bar { height: 8px; border-radius: 4px; background: var(--line); overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 4px; background: var(--ok); transition: width 0.4s var(--ease); }
.count { font-size: var(--fs-sm); color: var(--text-2); }
.count strong { color: var(--text); font-family: var(--font-display); font-size: var(--fs-md); }
.go { min-height: 56px; padding-block: var(--s-3); text-align: center; line-height: 1.2; }
.all { padding: var(--s-4); border-radius: var(--radius); background: var(--ok-soft); color: var(--text); font-weight: 700; }
.all a { color: var(--accent-strong); text-decoration: underline; text-underline-offset: 3px; }

.th { display: flex; align-items: center; gap: var(--s-3); }
.thi { flex: none; color: var(--accent); }
.th h2 { flex: 1; min-width: 0; font-size: var(--fs-lg); line-height: 1.15; }
.tc { flex: none; font-family: var(--font-display); font-weight: 700; font-size: var(--fs-sm); color: var(--text-2); font-variant-numeric: tabular-nums; }
.blurb { margin-top: var(--s-1); color: var(--text-2); font-size: var(--fs-sm); line-height: 1.4; }

.rows { margin-top: var(--s-3); border-top: 1px solid var(--line); }
.rows li { border-bottom: 1px solid var(--line); }
.row {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--s-3);
  min-height: 64px;
  padding: var(--s-3) 0;
  color: var(--text);
}
.row:active { background: var(--surface-2); }
.st {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-top: 1px;
  border-radius: 50%;
  border: 2px solid var(--line);
}
.st.read { background: var(--ok); border-color: var(--ok); color: var(--bg); }
.rt { display: grid; gap: 2px; }
.rtt { font-family: var(--font-display); font-weight: 700; font-size: var(--fs-md); line-height: 1.2; }
.rts { color: var(--text-2); font-size: var(--fs-sm); line-height: 1.35; }
.min { padding-top: 3px; color: var(--text-2); font-size: var(--fs-xs); font-weight: 700; white-space: nowrap; }
</style>
