// Principes généraux (brochure CGDIS, chap. 1).

// Les 4 réflexes avant de porter secours (chap. 1.2).
export const reflexes = [
  {
    icon: 'ShieldAlert',
    title: 'Se protéger',
    lead: 'Votre sécurité passe avant tout.',
    text: 'Repérez les dangers (circulation, feu, électricité…). Ne vous mettez jamais en danger. Sur la route : feux de détresse, gilet de sécurité, à l’abri derrière la glissière.',
  },
  {
    icon: 'TriangleAlert',
    title: 'Sécuriser les lieux',
    lead: 'Empêchez un deuxième accident.',
    text: 'Posez le triangle de signalisation à 150–300 m (plus loin avant une côte, une descente ou un virage).',
  },
  {
    icon: 'Eye',
    title: 'Évaluer la situation',
    lead: 'Que s’est-il passé ? Combien de victimes ?',
    text: 'Seulement des dégâts matériels ou des blessés ? Gardez votre calme pour ne rien négliger.',
  },
  {
    icon: 'Phone',
    title: 'Alerter : 112',
    lead: 'Puis seulement, portez secours.',
    text: 'Appelez le 112, répondez calmement et précisément. Une fois l’appel passé, commencez les premiers soins.',
  },
]

// Les 5 questions de l'appel au 112 (chap. 1.3).
export const questions = [
  { k: 'Qui', q: 'Qui êtes-vous ?' },
  { k: 'Où', q: 'Où cela s’est-il passé ?' },
  { k: 'Que', q: 'Que s’est-il passé ?' },
  { k: 'Quoi', q: 'De quoi souffre(nt) la ou les personnes ?' },
  { k: 'Combien', q: 'Combien de personnes ont besoin d’aide ?' },
]

// La chaîne de sauvetage (chap. 1.1).
export const chain = [
  { title: 'Sécurisation', text: 'Protection personnelle' },
  { title: 'Appel d’urgence', text: 'Mesures immédiates' },
  { title: 'Premiers secours', text: 'Autres mesures de secours' },
  { title: 'Service d’urgence', text: 'Prise en charge et transport' },
  { title: 'Hôpital', text: 'Soins spécialisés' },
]
