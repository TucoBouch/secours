import { createRouter, createWebHashHistory } from 'vue-router'
import { ref } from 'vue'
import HomeView from './views/HomeView.vue'
import SituationView from './views/SituationView.vue'
import PrinciplesView from './views/PrinciplesView.vue'
import TechniquesView from './views/TechniquesView.vue'
import CprView from './views/CprView.vue'
import SettingsView from './views/SettingsView.vue'
import QuizHomeView from './views/QuizHomeView.vue'
import QuizPlayView from './views/QuizPlayView.vue'
import QuizResultView from './views/QuizResultView.vue'

// Chaque écran est une entrée de l'historique du navigateur (routes en « # »).
// Le bouton retour du téléphone remonte donc l'historique au lieu de fermer l'application.
// Le mode « hash » fonctionne aussi quand le fichier est ouvert directement (file://).
const history = createWebHashHistory()

// Sens de la navigation, pour orienter l'animation d'entrée (avant / retour).
export const direction = ref('fwd')
let popDirection = ''
history.listen((_to, _from, info) => {
  popDirection = info.direction
})

export const router = createRouter({
  history,
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { tabs: true } },
    { path: '/situation/:id', name: 'situation', component: SituationView },
    { path: '/principes', name: 'principes', component: PrinciplesView, meta: { tabs: true } },
    { path: '/techniques', name: 'techniques', component: TechniquesView, meta: { tabs: true } },
    { path: '/massage', name: 'massage', component: CprView },
    { path: '/quiz', name: 'quiz', component: QuizHomeView, meta: { tabs: true } },
    { path: '/quiz/jouer', name: 'quiz-jouer', component: QuizPlayView },
    { path: '/quiz/resultat/:id', name: 'quiz-resultat', component: QuizResultView },
    { path: '/reglages', name: 'reglages', component: SettingsView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: (_to, _from, saved) => saved || { top: 0 },
})

router.beforeEach(() => {
  direction.value = popDirection === 'back' ? 'back' : 'fwd'
  popDirection = ''
})
