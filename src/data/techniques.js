// Techniques de base (brochure CGDIS, chap. 2.3 à 2.5).
// steps : string | { text, fig } — fig : « pls-1 » … « pls-4 »

export const techniques = [
  {
    id: 'pls',
    short: 'PLS',
    title: 'Position latérale de sécurité',
    when: 'Personne inconsciente qui respire.',
    why: 'Libère les voies respiratoires et laisse vomi ou sang s’écouler.',
    steps: [
      { fig: 'pls-1', text: 'Vérifiez qu’elle respire. **Allongez ses jambes.** Placez le bras le plus proche de vous **à angle droit**.' },
      { fig: 'pls-2', text: 'Placez l’autre bras **en travers de la poitrine**, dos de la main **contre sa joue**. Gardez cette main en place.' },
      { fig: 'pls-3', text: 'Saisissez la **jambe opposée**, fléchissez-la, puis **tournez la personne vers vous**.' },
      { fig: 'pls-4', text: '**Basculez la tête en arrière**, bouche vers le sol. Surveillez la respiration, couvrez-la.' },
    ],
    note: 'Si elle ne respire plus : massage cardiaque, pas de PLS.',
  },
  {
    id: 'mc',
    short: 'Massage cardiaque',
    title: 'Massage cardiaque',
    when: 'Personne inconsciente qui ne respire pas.',
    why: 'Fait circuler le sang jusqu’au cerveau en attendant les secours.',
    figure: 'torso',
    steps: [
      '**Appelez le 112**, faites apporter un DEA.',
      'Personne sur le dos, sur un sol dur. Genoux à côté de sa poitrine.',
      'Paumes **superposées au centre de la poitrine**, bras tendus à la verticale.',
      'Enfoncez le sternum de **5 à 6 cm**, laissez la poitrine **remonter complètement**.',
      'Rythme : **100 à 120 par minute**. Ne vous interrompez pas.',
    ],
    cta: { to: '/massage', label: 'Ouvrir le métronome' },
  },
  {
    id: 'rcp',
    short: 'Massage + bouche-à-bouche',
    title: 'Massage + bouche-à-bouche',
    when: 'Si vous vous sentez capable de ventiler. Sinon : massage seul.',
    why: 'Cycle de 30 compressions et 2 insufflations, répété sans pause.',
    steps: [
      '**30 compressions** thoraciques (5–6 cm, 100–120/min).',
      'Basculez la **tête en arrière**, menton levé. **Pincez le nez.**',
      'Bouche sur bouche : **insufflez 2 fois**, la poitrine doit se soulever.',
      '**Recommencez : 30 : 2**, sans vous interrompre.',
      'Continuez jusqu’à l’arrivée des secours, la reprise de la respiration ou l’épuisement.',
    ],
    cta: { to: '/massage', label: 'Ouvrir le métronome' },
  },
  {
    id: 'dea',
    short: 'DEA',
    title: 'Défibrillateur (DEA)',
    when: 'Dès qu’un DEA est disponible. Tout le monde peut l’utiliser.',
    why: 'Un choc électrique, associé au massage, relance un rythme efficace.',
    steps: [
      'Ne **cessez pas** le massage pendant que le DEA arrive.',
      'Dénudez le torse (soutien-gorge compris), essuyez la sueur, rasez si besoin.',
      'Allumez le DEA et **collez les électrodes** : une sur le côté du thorax, l’autre sous la clavicule, près du sternum.',
      '**Suivez les instructions vocales.** Pendant l’analyse et le choc : **plus personne ne touche** la victime.',
      'Au signal, appuyez sur le bouton de choc. **Reprenez le massage** immédiatement.',
    ],
    note: 'Pas de choc dans l’eau ou en milieu humide, sur surface conductrice, en environnement explosif ou inflammable, ni sur un bébé de moins d’un an.',
  },
  {
    id: 'enfant',
    short: 'Enfant, nourrisson',
    title: 'Réanimation enfant et nourrisson',
    when: 'Arrêt cardiaque d’un enfant ou d’un nourrisson.',
    why: 'Mêmes principes que l’adulte, avec quelques adaptations.',
    steps: [
      'Commencez par **5 insufflations** dans la bouche.',
      'Enfant : compressions avec **une main** (deux pour un adolescent).',
      'Nourrisson : **deux doigts** au centre de la poitrine, tête en position neutre (« reniflement »).',
      'Enfoncez de **1/3** de l’épaisseur de la poitrine.',
      '**100–120/min**, rapport **30 : 2**. Adaptez le volume insufflé à l’âge.',
      'DEA : seulement au-delà d’un an. Électrodes enfant si disponibles, sans qu’elles se touchent.',
    ],
    cta: { to: '/massage', label: 'Ouvrir le métronome' },
  },
  {
    id: 'etouffement',
    short: 'Étouffement',
    title: 'Désobstruction des voies aériennes',
    when: 'Toux inefficace : ne peut plus parler, toux faible ou silencieuse.',
    why: 'Expulse le corps étranger qui bloque la respiration.',
    sections: [
      {
        title: 'Adulte et enfant (plus d’un an)',
        steps: [
          'Faites **appeler le 112**.',
          '**5 claques vigoureuses** dans le dos, entre les omoplates.',
          '**5 compressions abdominales** (Heimlich) : poing au creux de l’estomac, tiré vers le haut et l’arrière.',
          'Alternez **5 + 5** jusqu’à ce que ça sorte, ou jusqu’à la perte de connaissance.',
        ],
      },
      {
        title: 'Nourrisson (moins d’un an)',
        steps: [
          '**5 tapes** dans le dos.',
          '**5 compressions thoraciques** au centre de la poitrine.',
          'Alternez jusqu’à ce que ça sorte, ou jusqu’à la perte de connaissance.',
        ],
      },
    ],
    note: 'Perte de connaissance : réanimation. Après un Heimlich, contrôle médical obligatoire.',
  },
  {
    id: 'casque',
    short: 'Casque de moto',
    title: 'Retrait du casque',
    when: 'Motard inconscient (qu’il respire ou non). À deux secouristes minimum.',
    why: 'Permet de libérer les voies respiratoires sans plier la nuque.',
    steps: [
      'Secouriste 1 **stabilise la tête** par le haut, en tenant casque et mâchoire.',
      'Secouriste 2 **ouvre la visière**, retire les lunettes éventuelles, **détache la sangle**.',
      'Secouriste 2 **tient la nuque et la mâchoire**, sans relâcher.',
      'Secouriste 1 **retire doucement le casque**.',
      'Secouriste 1 reprend le maintien de la tête. Secouriste 2 est libéré.',
      'Basculez-le en **PLS** ensemble, **tête toujours dans l’axe**.',
      'Contrôlez régulièrement la respiration. Elle s’arrête : **massage cardiaque**.',
    ],
  },
]

export const techniqueById = Object.fromEntries(techniques.map((t) => [t.id, t]))
