<script setup>
import { Phone, Scale } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import { chain, questions, reflexes } from '../data/principles'
import { icons } from '../icons'
</script>

<template>
  <div class="screen">
    <TopBar title="Principes" gear />

    <main class="pad stack">
      <section aria-labelledby="p-reflexes">
        <p class="eyebrow">Avant de porter secours</p>
        <h2 id="p-reflexes" class="h">4 réflexes, dans cet ordre</h2>
        <ol class="reflexes">
          <li v-for="(r, i) in reflexes" :key="r.title" class="reflex">
            <span class="n">{{ i + 1 }}</span>
            <div class="rb">
              <div class="rt">
                <component :is="icons[r.icon]" :size="22" :stroke-width="2.2" />
                <h3>{{ r.title }}</h3>
              </div>
              <p class="lead">{{ r.lead }}</p>
              <p class="txt">{{ r.text }}</p>
            </div>
          </li>
        </ol>
        <p class="then">Ensuite seulement : <strong>secourir</strong>, en attendant les secours professionnels.</p>
      </section>

      <section aria-labelledby="p-112" class="call112">
        <p class="eyebrow">Au téléphone</p>
        <h2 id="p-112" class="h">L’appel au 112 : 5 questions</h2>
        <ul class="qs">
          <li v-for="q in questions" :key="q.k">
            <span class="k">{{ q.k }} ?</span>
            <span class="q">{{ q.q }}</span>
          </li>
        </ul>
        <p class="tip">Répondez calmement et précisément. Ne raccrochez que lorsque l’opérateur vous le dit. Le 112 fonctionne dans toute l’Europe, sur fixe comme sur mobile.</p>
        <p class="tip">À votre demande, l’opérateur peut vous guider pas à pas dans la réanimation.</p>
        <a class="btn btn-danger btn-block" href="tel:112"><Phone :size="22" :stroke-width="2.4" /> Appeler le 112</a>
      </section>

      <section aria-labelledby="p-chain">
        <p class="eyebrow">Vue d’ensemble</p>
        <h2 id="p-chain" class="h">La chaîne de sauvetage</h2>
        <ol class="chain">
          <li v-for="(c, i) in chain" :key="c.title" :class="{ you: i < 3 }">
            <span class="dot" aria-hidden="true">{{ i + 1 }}</span>
            <div>
              <h3>{{ c.title }}</h3>
              <p>{{ c.text }}</p>
            </div>
            <span v-if="i < 3" class="tag">Vous</span>
          </li>
        </ol>
        <p class="tip">Les secours et l’hôpital ne servent à rien si les premiers gestes manquent dans les premières minutes : vous êtes le maillon le plus important.</p>
      </section>

      <section aria-labelledby="p-law" class="law">
        <Scale :size="26" :stroke-width="2" />
        <div>
          <h2 id="p-law">Obligation d’assistance</h2>
          <p>Tout citoyen doit porter secours à une personne en détresse, s’il n’y a pas de danger direct pour lui (Code pénal luxembourgeois, art. 410-1 et 410-2). Passer un appel d’urgence compte comme une assistance.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: var(--s-7); padding-top: var(--s-2); }
.h { font-size: var(--fs-xl); line-height: 1.05; margin-top: 2px; margin-bottom: var(--s-4); }

.reflexes { display: grid; gap: 0; counter-reset: none; }
.reflex { display: grid; grid-template-columns: 2.25rem 1fr; gap: var(--s-3); padding-block: var(--s-4); border-top: 1px solid var(--line); }
.reflex:first-child { border-top: 0; padding-top: 0; }
.n { font-family: var(--font-display); font-weight: 800; font-size: 2rem; line-height: 1; color: var(--accent); }
.rt { display: flex; align-items: center; gap: var(--s-2); color: var(--text); }
.rt svg { color: var(--accent); }
.rt h3 { font-size: var(--fs-lg); }
.lead { margin-top: 4px; font-weight: 700; font-size: var(--fs-md); line-height: 1.3; }
.txt { margin-top: 4px; color: var(--text-2); line-height: 1.45; }
.then { padding: var(--s-4); border-radius: var(--radius); background: var(--accent-soft); color: var(--text); }

.call112 { padding: var(--s-5) var(--gutter); margin-inline: calc(var(--gutter) * -1); background: var(--surface); border-block: 1px solid var(--line); }
.qs { display: grid; gap: var(--s-2); margin-bottom: var(--s-4); }
.qs li { display: grid; grid-template-columns: 6.25rem 1fr; align-items: baseline; gap: var(--s-3); padding: var(--s-2) 0; border-bottom: 1px dashed var(--line); }
.qs li:last-child { border-bottom: 0; }
.k { font-family: var(--font-display); font-weight: 800; font-size: var(--fs-lg); color: var(--accent-strong); }
.q { line-height: 1.3; }
.tip { color: var(--text-2); line-height: 1.45; margin-bottom: var(--s-3); }
.call112 .btn { margin-top: var(--s-2); }

.chain { display: grid; gap: 0; margin-bottom: var(--s-4); }
.chain li { position: relative; display: grid; grid-template-columns: 2.25rem 1fr auto; align-items: center; gap: var(--s-3); padding-block: var(--s-3); }
.chain li:not(:last-child)::after { content: ''; position: absolute; left: calc(1.125rem - 1px); top: calc(var(--s-3) + 2.25rem); bottom: calc(var(--s-3) * -1); width: 2px; background: var(--line); }
.dot { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; border-radius: 50%; border: 2px solid var(--line); background: var(--bg); font-family: var(--font-display); font-weight: 800; z-index: 1; }
.chain .you .dot { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.chain h3 { font-size: var(--fs-md); }
.chain p { color: var(--text-2); font-size: var(--fs-sm); }
.tag { padding: 4px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-strong); font-weight: 700; font-size: var(--fs-xs); }

.law { display: flex; gap: var(--s-4); padding: var(--s-4); border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line); }
.law svg { color: var(--accent); margin-top: 2px; }
.law h2 { font-size: var(--fs-md); margin-bottom: var(--s-1); }
.law p { color: var(--text-2); font-size: var(--fs-sm); line-height: 1.5; }
</style>
