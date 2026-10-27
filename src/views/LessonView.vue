<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Check, ChevronRight, CircleCheck, Clock } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import LessonBlocks from '../components/LessonBlocks.vue'
import { lessonById, lessons, themeById } from '../data/lessons'
import { isRead, setRead } from '../learn'

const route = useRoute()
const router = useRouter()

const lesson = computed(() => lessonById[route.params.id])
watchEffect(() => {
  if (!lesson.value) router.replace('/apprendre')
})

const theme = computed(() => themeById[lesson.value?.theme])
const index = computed(() => lessons.indexOf(lesson.value))
const prev = computed(() => lessons[index.value - 1])
const next = computed(() => lessons[index.value + 1])
const read = computed(() => !!lesson.value && isRead(lesson.value.id))

// Annonce vocale du changement d'état (lecteurs d'écran).
const announce = ref('')
function toggle() {
  const value = !read.value
  setRead(lesson.value.id, value)
  announce.value = value ? 'Leçon marquée comme lue.' : 'Leçon marquée comme non lue.'
}
</script>

<template>
  <div v-if="lesson" class="screen">
    <TopBar title="Apprendre" back gear />

    <article class="pad">
      <header class="head">
        <h2>{{ lesson.title }}</h2>
        <p class="meta">
          <span class="theme">{{ theme.title }}</span>
          <span class="time"><Clock :size="16" :stroke-width="2.4" aria-hidden="true" /> {{ lesson.minutes }} min de lecture</span>
          <span v-if="read" class="tag"><Check :size="14" :stroke-width="3.4" aria-hidden="true" /> Déjà lue</span>
        </p>
        <p class="lede">{{ lesson.summary }}</p>
      </header>

      <LessonBlocks :blocks="lesson.blocks" />

      <section class="retain" aria-labelledby="retain-t">
        <h3 id="retain-t">À retenir</h3>
        <ul>
          <li v-for="(r, i) in lesson.retain" :key="i">
            <Check :size="18" :stroke-width="3" aria-hidden="true" />
            <span>{{ r }}</span>
          </li>
        </ul>
      </section>

      <nav v-if="lesson.see" class="see" aria-label="Voir aussi">
        <RouterLink v-for="l in lesson.see" :key="l.to" :to="l.to" class="chip">
          {{ l.label }} <ChevronRight :size="18" />
        </RouterLink>
      </nav>

      <div class="mark">
        <button type="button" class="btn btn-block big" :class="{ 'btn-primary': !read, done: read }" :aria-pressed="read" @click="toggle">
          <CircleCheck :size="22" :stroke-width="2.4" aria-hidden="true" />
          {{ read ? 'Lue — marquer comme non lue' : 'Marquer comme lue' }}
        </button>
        <p class="sr-only" role="status" aria-live="polite">{{ announce }}</p>
      </div>

      <nav class="pager" aria-label="Autres leçons">
        <RouterLink v-if="prev" :to="`/apprendre/${prev.id}`" class="pg prev">
          <ArrowLeft :size="20" aria-hidden="true" />
          <span><small>Précédente</small>{{ prev.title }}</span>
        </RouterLink>
        <RouterLink v-if="next" :to="`/apprendre/${next.id}`" class="pg next" :class="{ hot: read }">
          <span><small>Suivante</small>{{ next.title }}</span>
          <ArrowRight :size="20" aria-hidden="true" />
        </RouterLink>
      </nav>
    </article>
  </div>
</template>

<style scoped>
.head { display: grid; gap: var(--s-2); padding-top: var(--s-2); margin-bottom: var(--s-5); }
.head h2 { font-size: var(--fs-xl); line-height: 1.08; }
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3); font-size: var(--fs-sm); color: var(--text-2); }
.theme { font-weight: 700; color: var(--text); }
.time { display: inline-flex; align-items: center; gap: 6px; }
.tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px 2px 8px; border-radius: 999px; background: var(--ok); color: var(--bg); font-weight: 700; font-size: var(--fs-xs); }
.lede { font-size: var(--fs-md); line-height: 1.45; color: var(--text); font-weight: 700; font-family: var(--font-display); }

.retain { margin-top: var(--s-6); padding: var(--s-4); border-radius: var(--radius); background: var(--accent-soft); }
.retain h3 { font-size: var(--fs-md); margin-bottom: var(--s-3); }
.retain ul { display: grid; gap: var(--s-2); }
.retain li { display: grid; grid-template-columns: 18px minmax(0, 1fr); gap: var(--s-3); line-height: 1.45; }
.retain li svg { margin-top: 3px; color: var(--accent-strong); }

.see { display: flex; flex-wrap: wrap; gap: var(--s-2); margin-top: var(--s-5); }
.chip { display: inline-flex; align-items: center; gap: 4px; min-height: 44px; padding: 0 var(--s-3) 0 var(--s-4); border-radius: 999px; background: var(--surface-2); color: var(--text); font-weight: 700; font-size: var(--fs-sm); }

.mark { margin-top: var(--s-6); }
.big { min-height: 60px; font-size: var(--fs-md); }
.btn.done { background: var(--ok-soft); color: var(--ok); box-shadow: inset 0 0 0 1.5px var(--ok); }

.pager { display: grid; gap: var(--s-2); margin-top: var(--s-4); }
.pg { display: flex; align-items: center; gap: var(--s-3); min-height: 64px; padding: var(--s-3) var(--s-4); border-radius: var(--radius); border: 1px solid var(--line); background: var(--surface); color: var(--text); font-family: var(--font-display); font-weight: 700; line-height: 1.2; }
.pg small { display: block; font-family: var(--font-body); font-weight: 400; font-size: var(--fs-xs); color: var(--text-2); }
.pg svg { flex: none; color: var(--accent); }
.pg.next { justify-content: space-between; }
.pg.next.hot { border-color: var(--accent); }
.pg:active { background: var(--surface-2); }
</style>
