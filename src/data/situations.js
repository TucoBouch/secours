// Contenu issu de la brochure « Premiers secours » du CGDIS (Luxembourg, 2021).
// Formulations volontairement courtes : on agit d'abord, on lit peu.
// Les **mots** entre doubles astérisques sont mis en gras à l'affichage.
//
// call : 'now'  → bandeau « Appelez le 112 » ; 'maybe' → bandeau conditionnel (callWhen)
// steps : string | { badge, title, text }

export const groups = [
  { id: 'vital', title: 'Urgences vitales', hint: 'Agir tout de suite' },
  { id: 'trauma', title: 'Accidents et blessures' },
  { id: 'malaise', title: 'Malaises et respiration' },
]

export const situations = [
  /* ───────────────────────── URGENCES VITALES ───────────────────────── */
  {
    id: 'perte-connaissance',
    group: 'vital',
    icon: 'Bed',
    title: 'Perte de connaissance',
    sub: 'Ne répond plus',
    keywords: 'inconscient evanoui evanouissement malaise ne reagit pas pls coma',
    call: 'now',
    sections: [
      {
        steps: [
          '**Secouez doucement** les épaules et parlez fort : réagit-elle ?',
          'Pas de réaction : **criez à l’aide** et **appelez le 112**.',
          'Basculez la **tête en arrière**, menton levé. Regardez, écoutez, sentez : **respire-t-elle ? (10 s)**',
        ],
      },
      {
        title: 'Elle respire',
        tone: 'ok',
        steps: [
          'Mettez-la en **PLS** (position latérale de sécurité).',
          '**Surveillez sa respiration** en continu.',
          'Couvrez-la (couverture de survie, veste).',
        ],
      },
      {
        title: 'Elle ne respire pas (ou pas normalement)',
        tone: 'danger',
        steps: ['Commencez le **massage cardiaque** sans attendre.', 'Faites apporter un **DEA** (défibrillateur).'],
      },
    ],
    avoid: ['Ne la laissez pas sur le dos.', 'Ne lui donnez ni à boire ni à manger.'],
    see: [
      { to: '/techniques?t=pls', label: 'Technique : PLS' },
      { to: '/massage', label: 'Massage cardiaque' },
    ],
    cta: { to: '/massage', label: 'Massage cardiaque : lancer le tempo' },
  },
  {
    id: 'arret-cardiaque',
    group: 'vital',
    icon: 'HeartOff',
    title: 'Ne respire plus',
    sub: 'Arrêt cardiaque',
    keywords: 'arret cardiaque reanimation rcp massage cardiaque dea defibrillateur ne respire pas',
    call: 'now',
    signs: ['Ne réagit pas', 'Ne respire pas, ou respiration anormale'],
    sections: [
      {
        steps: [
          '**Appelez le 112** (ou faites-le appeler). Dites : « réanimation ».',
          'Faites apporter un **DEA**.',
          'Mains **superposées au centre de la poitrine**, bras tendus.',
          '**30 compressions** : enfoncez de **5 à 6 cm**, **100 à 120 par minute**.',
          'Si vous savez : **2 insufflations** (nez pincé), puis 30 : 2. Sinon, compressions seules, sans arrêt.',
          '**DEA** dès qu’il arrive : suivez ses instructions vocales.',
          'Continuez jusqu’à l’arrivée des secours ou la reprise de la respiration.',
        ],
      },
      {
        title: 'Enfant et nourrisson',
        collapsed: true,
        steps: [
          'Commencez par **5 insufflations**.',
          'Enfant : **une main** (deux pour un adolescent). Nourrisson : **deux doigts**.',
          'Enfoncez de **1/3** de l’épaisseur de la poitrine.',
          'Même rythme (100–120/min) et même rapport : 30 compressions, 2 insufflations.',
        ],
      },
    ],
    see: [
      { to: '/techniques?t=rcp', label: 'Technique : massage + bouche-à-bouche' },
      { to: '/techniques?t=dea', label: 'Technique : DEA' },
    ],
    cta: { to: '/massage', label: 'Lancer le tempo du massage' },
  },
  {
    id: 'etouffement',
    group: 'vital',
    icon: 'Cookie',
    title: 'Étouffement',
    sub: 'Corps étranger',
    keywords: 'etouffe etouffer heimlich avale de travers gorge obstruction enfant nourrisson toux',
    call: 'maybe',
    callWhen: 'Dès que la toux devient inefficace : 112.',
    signs: ['Mains à la gorge, panique', 'Ne peut plus parler ni respirer', 'Visage rouge puis bleuté'],
    sections: [
      {
        title: 'Elle tousse fort, parle, respire',
        tone: 'ok',
        steps: ['**Encouragez-la à tousser.**', 'Surveillez-la en continu.', 'Si ça persiste, appelez le 112.'],
      },
      {
        title: 'Toux faible ou silencieuse, ne peut plus parler',
        sub: 'Adulte et enfant (plus d’un an)',
        tone: 'danger',
        steps: [
          'Demandez de l’aide : faites **appeler le 112**.',
          '**5 claques vigoureuses** dans le dos, entre les omoplates, penchée en avant.',
          '**5 compressions abdominales** (Heimlich) : poing au creux de l’estomac, vers le haut.',
          'Répétez **5 + 5** jusqu’à ce que ça sorte.',
        ],
      },
      {
        title: 'Nourrisson (moins d’un an)',
        tone: 'danger',
        steps: [
          '**5 tapes** dans le dos.',
          '**5 compressions thoraciques** au centre de la poitrine.',
          'Répétez jusqu’à ce que ça sorte.',
        ],
      },
      {
        title: 'Elle perd connaissance',
        tone: 'danger',
        steps: ['Allongez-la et commencez la **réanimation** (massage cardiaque).'],
      },
    ],
    note: 'Après une manœuvre de Heimlich, un contrôle à l’hôpital est obligatoire.',
    see: [{ to: '/techniques?t=etouffement', label: 'Technique : désobstruction' }],
  },
  {
    id: 'hemorragie',
    group: 'vital',
    icon: 'Droplet',
    title: 'Saignement important',
    sub: 'Hémorragie',
    keywords: 'hemorragie sang saigne beaucoup garrot ligature pansement compressif plaie grave',
    call: 'now',
    signs: ['Sang rouge vif qui gicle : artère', 'Sang foncé qui coule : veine'],
    sections: [
      {
        steps: [
          'Protégez-vous : **gants** si possible.',
          '**Appuyez fort, sans lâcher**, sur la plaie avec une compresse ou un tissu propre.',
          'Allongez la victime. **Surélevez le membre** au-dessus du cœur si possible.',
          'Ça saigne encore : **pansement compressif**.',
          'Membre, saignement qui ne s’arrête pas : **ligature (garrot)**. Notez l’**heure** sur la victime.',
        ],
      },
    ],
    avoid: ['Ne retirez pas un objet planté : calez-le avec des compresses.', 'Ne défaites jamais une ligature.'],
    see: [{ to: '/situation/plaie', label: 'Plaie, coupure' }],
  },
  {
    id: 'crise-cardiaque',
    group: 'vital',
    icon: 'HeartPulse',
    title: 'Douleur dans la poitrine',
    sub: 'Crise cardiaque',
    keywords: 'infarctus crise cardiaque coeur douleur thoracique oppression bras gauche machoire',
    call: 'now',
    signs: [
      'Douleur forte ou oppression derrière le sternum',
      'Douleur vers la mâchoire, le bras gauche, le dos',
      'Sueurs froides, teint pâle, nausées',
      'Peur intense, agitation',
    ],
    sections: [
      {
        steps: [
          '**Toujours appeler le 112.**',
          'Installez la personne, **buste surélevé**.',
          'Rassurez-la. **Aucun effort** : elle ne bouge pas.',
          'Aidez-la à prendre **ses médicaments** si besoin.',
          'Elle perd connaissance et ne respire plus : **massage cardiaque**.',
        ],
      },
    ],
    cta: { to: '/massage', label: 'Massage cardiaque : lancer le tempo' },
  },
  {
    id: 'avc',
    group: 'vital',
    icon: 'Brain',
    title: 'AVC',
    sub: 'Visage, bras, parole',
    keywords: 'avc accident vasculaire cerebral fast paralysie parole visage bras apoplexie',
    call: 'now',
    signs: ['Visage qui tombe d’un côté', 'Bras faible, engourdi', 'Parole confuse', 'Troubles de la vue, maux de tête'],
    sections: [
      {
        title: 'Test FAST',
        sub: 'Un seul signe suffit',
        steps: [
          { badge: 'F', title: 'Visage', text: 'Demandez de **sourire**. Grimace, coin de la bouche affaissé ?' },
          { badge: 'A', title: 'Bras', text: 'Demandez de **lever les deux bras**, paumes vers le haut. Un côté plus faible ?' },
          { badge: 'S', title: 'Parole', text: 'Faites **répéter une phrase**. Élocution confuse ou ralentie ?' },
          { badge: 'T', title: 'Temps', text: '**Appelez le 112 immédiatement.** Notez l’heure des premiers signes.' },
        ],
      },
      {
        title: 'En attendant les secours',
        steps: [
          'Position confortable, **buste surélevé**.',
          'Surveillez la respiration. Gardez la personne au chaud.',
          'Perte de connaissance : **PLS**.',
        ],
      },
    ],
    see: [{ to: '/techniques?t=pls', label: 'Technique : PLS' }],
  },

  /* ───────────────────────── ACCIDENTS ET BLESSURES ───────────────────────── */
  {
    id: 'accident-route',
    group: 'trauma',
    icon: 'Car',
    title: 'Accident de la route',
    keywords: 'accident route voiture circulation triangle gilet glissiere collision',
    call: 'now',
    sections: [
      {
        steps: [
          '**Feux de détresse.** Gilet de sécurité pour tous.',
          'Tout le monde sort et se met **à l’abri** (derrière la glissière).',
          '**Triangle** de signalisation à **150–300 m** (plus loin avant une côte ou un virage).',
          'Évaluez : combien de blessés ? Restez calme.',
          '**Appelez le 112**, puis portez secours.',
        ],
      },
    ],
    avoid: ['Ne vous mettez jamais en danger pour porter secours.'],
    see: [{ to: '/principes', label: 'Les principes du secours' }],
  },
  {
    id: 'motard',
    group: 'trauma',
    icon: 'Bike',
    title: 'Motard blessé',
    sub: 'Casque',
    keywords: 'moto motard casque retrait casque scooter velo',
    call: 'now',
    sections: [
      {
        title: 'Il est conscient',
        tone: 'ok',
        steps: ['**Ne retirez pas le casque.**', 'Parlez-lui, rassurez-le, **immobilisez sa tête**.', 'Appelez le **112**.'],
      },
      {
        title: 'Il est inconscient',
        tone: 'danger',
        steps: [
          'Appelez le **112**. Cherchez de l’aide : il faut **2 secouristes**.',
          'Retirez le casque **à deux**, la tête toujours dans l’axe.',
          'Il respire : **PLS**. Il ne respire pas : **massage cardiaque**.',
        ],
      },
    ],
    see: [{ to: '/techniques?t=casque', label: 'Technique : retrait du casque' }],
  },
  {
    id: 'brulure',
    group: 'trauma',
    icon: 'Flame',
    title: 'Brûlure',
    keywords: 'brulure feu eau chaude soleil chimique flamme cloque',
    call: 'maybe',
    callWhen: 'Brûlure étendue, profonde, chimique ou électrique : 112.',
    sections: [
      {
        title: 'Petite brûlure',
        tone: 'ok',
        steps: [
          'Faites couler de l’**eau tiède** dessus pendant **10 minutes**.',
          'Retirez avec précaution bijoux et vêtements amples **non collés**.',
          'Couvrez proprement.',
        ],
      },
      {
        title: 'Brûlure étendue',
        tone: 'danger',
        steps: [
          'Vêtements en feu : **étouffez les flammes** (couverture, eau).',
          '**Appelez le 112.**',
          'Retirez bijoux et vêtements non collés.',
          'Couvrez de **compresses stériles ou propres**.',
          'Ne refroidissez pas (risque d’hypothermie) : **gardez au chaud**, couverture de survie.',
        ],
      },
      {
        title: 'Brûlure chimique',
        tone: 'danger',
        steps: [
          '**Rincez abondamment** à l’eau tempérée, sans éclabousser les zones saines.',
          'Gardez le produit pour l’identifier. Protégez-vous.',
        ],
      },
    ],
    avoid: ['Pas de pommade ni de produit « maison ».'],
    note: 'Urgence : adulte ≥ 15 % de peau au 2ᵉ degré ou ≥ 10 % au 3ᵉ ; enfant ≥ 10 % ou ≥ 5 %. La paume de la main de la victime, doigts compris, ≈ 1 % de sa peau.',
  },
  {
    id: 'electrique',
    group: 'trauma',
    icon: 'Zap',
    title: 'Accident électrique',
    keywords: 'electrocution electricite courant choc electrique foudre',
    call: 'now',
    sections: [
      {
        steps: [
          '**Votre sécurité d’abord** : l’électricité peut tuer. Coupez le courant si possible.',
          '**Appelez le 112** — toujours.',
          'Elle respire mais est inconsciente : **PLS**. Elle ne respire pas : **massage cardiaque**.',
          'Couvrez les brûlures (entrée et sortie du courant) avec un pansement stérile ou propre.',
        ],
      },
    ],
    avoid: ['Ne touchez pas la victime tant que le danger persiste.'],
    note: 'La plus grande part de la brûlure est interne, donc invisible.',
  },
  {
    id: 'plaie',
    group: 'trauma',
    icon: 'Bandage',
    title: 'Plaie, coupure',
    keywords: 'plaie coupure ecorchure blessure pansement morsure piqure saignement leger',
    call: 'maybe',
    callWhen: 'Plaie profonde, large ou qui saigne beaucoup : voir « Saignement important ».',
    sections: [
      {
        steps: [
          'Mettez des **gants** si possible. Ne touchez pas la plaie à mains nues.',
          'Ça saigne : **appuyez** avec une compresse propre.',
          'Posez un **pansement** qui couvre toute la plaie (compresse stérile + bande).',
          'Objet planté : **laissez-le en place** et calez-le avec des compresses.',
        ],
      },
    ],
    note: 'Infection possible si : douleur lancinante, rougeur, chaleur, gonflement, pus, fièvre. Consultez un médecin.',
    see: [{ to: '/situation/hemorragie', label: 'Saignement important' }],
  },
  {
    id: 'amputation',
    group: 'trauma',
    icon: 'Scissors',
    title: 'Membre sectionné',
    sub: 'Amputation',
    keywords: 'amputation doigt main section sectionne membre greffe',
    call: 'now',
    sections: [
      {
        title: 'La victime d’abord',
        steps: [
          '**Appelez le 112.**',
          '**Pressez le moignon** sans lâcher. Hémorragie grave : ligature, le plus vite possible.',
        ],
      },
      {
        title: 'La partie sectionnée',
        steps: [
          '**Enveloppez-la** dans un tissu propre ou stérile.',
          'Mettez-la dans un **sac plastique** fermé hermétiquement.',
          'Placez ce sac dans un **second sac** rempli d’**eau et de glace**. Fermez.',
          'Elle part **avec la victime** à l’hôpital.',
        ],
      },
    ],
  },
  {
    id: 'fracture',
    group: 'trauma',
    icon: 'Bone',
    title: 'Fracture',
    keywords: 'fracture os casse cote bassin ouverte fermee immobiliser echarpe',
    call: 'maybe',
    callWhen: 'Fracture ouverte, bassin, côtes avec gêne respiratoire : 112.',
    signs: ['Os déformé, mobilité anormale', 'Douleur, gonflement, hématome', 'Os visible : fracture ouverte'],
    sections: [
      {
        steps: [
          '**Ne bougez pas** la partie blessée.',
          'Aidez la victime à trouver une **position confortable**.',
          'Fracture ouverte : **stoppez le saignement**, couvrez la plaie proprement.',
          'Bras ou épaule : immobilisez avec une **écharpe triangulaire**.',
          'Au moindre doute : examen à l’hôpital.',
        ],
      },
      {
        title: 'Côtes',
        collapsed: true,
        steps: [
          'Position **semi-assise**.',
          'Difficulté à respirer : appelez le 112.',
          'Inconsciente : **PLS**, côté touché vers le sol.',
        ],
      },
      {
        title: 'Bassin',
        tone: 'danger',
        collapsed: true,
        steps: [
          '**Ne déplacez pas** la victime. Appelez le **112**.',
          'Gardez-la au chaud (couverture de survie).',
          'Danger : hémorragie interne, jusqu’à 5 litres de sang.',
        ],
      },
    ],
  },
  {
    id: 'tete',
    group: 'trauma',
    icon: 'HardHat',
    title: 'Choc à la tête',
    sub: 'Traumatisme crânien',
    keywords: 'tete crane traumatisme cranien commotion choc chute nausee vomissement',
    call: 'maybe',
    callWhen: 'Perte de connaissance, vomissements, confusion, saignement d’oreille ou de nez : 112.',
    signs: ['Maux de tête, nausées, vomissements', 'Désorientation, trous de mémoire', 'Pupilles inégales, vision double', 'Saignement de l’oreille ou du nez'],
    sections: [
      {
        steps: [
          'Couvrez proprement les plaies de la tête.',
          'Lésion du dos ou de la nuque possible : **laissez-la allongée**. Sinon, position **semi-assise**.',
          'Inconsciente : **PLS** (saignement d’oreille : côté du saignement).',
          'Appelez le **112**.',
        ],
      },
    ],
    see: [{ to: '/situation/dos-nuque', label: 'Dos, nuque' }],
  },
  {
    id: 'dos-nuque',
    group: 'trauma',
    icon: 'Accessibility',
    title: 'Dos, nuque',
    sub: 'Colonne vertébrale',
    keywords: 'colonne vertebrale dos nuque cervicale paralysie chute plongeon',
    call: 'now',
    signs: ['Douleur intense au dos ou à la nuque', 'Fourmillements, perte de sensibilité, paralysie', 'Difficulté à respirer'],
    sections: [
      {
        steps: [
          '**Ne la déplacez pas**, sauf danger immédiat.',
          '**Stabilisez sa tête** avec vos deux mains.',
          'Apaisez-la. **Appelez le 112.**',
          'Inconsciente : **PLS**.',
        ],
      },
    ],
    note: 'Une lésion de la nuque peut gêner la respiration, voire causer une paralysie.',
  },
  {
    id: 'entorse',
    group: 'trauma',
    icon: 'Footprints',
    title: 'Entorse',
    sub: 'Cheville, poignet…',
    keywords: 'entorse cheville poignet genou grec glace foulure',
    call: null,
    sections: [
      {
        title: 'Méthode GREC',
        steps: [
          { badge: 'G', title: 'Glace', text: '**Refroidissez** pour limiter le gonflement.' },
          { badge: 'R', title: 'Repos', text: '**Ne sollicitez plus** l’articulation.' },
          { badge: 'E', title: 'Élévation', text: '**Surélevez** le membre pour diminuer la douleur.' },
          { badge: 'C', title: 'Compression', text: '**Bandage** sur la zone gonflée.' },
        ],
      },
    ],
    note: 'Gonflement, hématome, douleur vive, mobilité réduite. En cas de doute, consultez.',
  },
  {
    id: 'luxation',
    group: 'trauma',
    icon: 'Unplug',
    title: 'Luxation',
    sub: 'Articulation déboîtée',
    keywords: 'luxation epaule deboite articulation deplacement',
    call: 'maybe',
    callWhen: 'Si doute ou douleur intense : médecin ou 112.',
    signs: ['Position anormale', 'Douleur aiguë, gonflement', 'Impossible de bouger la partie touchée'],
    sections: [
      {
        steps: [
          '**Immobilisez** l’articulation.',
          'Aidez la personne à prendre **la position de son choix**, en douceur.',
          '**Refroidissez**. Surélevez le membre si possible.',
        ],
      },
    ],
    avoid: ['Ne remettez jamais l’articulation en place : c’est le travail d’un médecin.'],
  },
  {
    id: 'poitrine',
    group: 'trauma',
    icon: 'Stethoscope',
    title: 'Blessure à la poitrine',
    sub: 'Choc, coup, perforation',
    keywords: 'poitrine thorax traumatisme thoracique cote pneumothorax coup couteau',
    call: 'maybe',
    callWhen: 'Gêne respiratoire ou plaie ouverte : appelez le 112.',
    signs: ['Essoufflement, respiration rapide et superficielle', 'Douleur au toucher', 'Hématomes, plaies, crachats de sang'],
    sections: [
      {
        steps: [
          'Apaisez la personne, **surélevez le haut du corps**.',
          'Couvrez les plaies ouvertes **proprement, sans serrer**.',
          'Gardez-la au chaud (couverture de survie).',
          'Inconsciente : **PLS**, côté blessé vers le sol.',
        ],
      },
    ],
  },

  /* ───────────────────────── MALAISES ET RESPIRATION ───────────────────────── */
  {
    id: 'malaise',
    group: 'malaise',
    icon: 'CircleHelp',
    title: 'Malaise',
    sub: 'Je ne sais pas ce que c’est',
    keywords: 'malaise vertige pale faible mal en point tourne de l oeil',
    call: null,
    hub: {
      question: 'Que constatez-vous ?',
      choices: [
        { label: 'Elle ne répond plus', to: '/situation/perte-connaissance' },
        { label: 'Elle ne respire pas', to: '/situation/arret-cardiaque' },
        { label: 'Douleur dans la poitrine, sueurs froides', to: '/situation/crise-cardiaque' },
        { label: 'Visage qui tombe, bras faible, parole confuse', to: '/situation/avc' },
        { label: 'Pâle, tremblante, en sueur (diabète)', to: '/situation/diabete' },
        { label: 'Convulsions', to: '/situation/epilepsie' },
        { label: 'Respiration sifflante ou difficile', to: '/situation/asthme' },
        { label: 'Respire vite, fourmillements, angoisse', to: '/situation/hyperventilation' },
      ],
    },
    sections: [
      {
        title: 'Dans tous les cas',
        steps: [
          'Installez la personne **dans la position où elle est le mieux**.',
          '**Rassurez-la.** Surveillez conscience et respiration.',
          'Au moindre doute, **appelez le 112**.',
        ],
      },
    ],
  },
  {
    id: 'diabete',
    group: 'malaise',
    icon: 'Syringe',
    title: 'Malaise diabétique',
    sub: 'Hypo / hyperglycémie',
    keywords: 'diabete diabetique glycemie hypoglycemie hyperglycemie sucre insuline',
    call: 'maybe',
    callWhen: 'Hypoglycémie, somnolence ou perte de connaissance : 112.',
    sections: [
      {
        title: 'Manque de sucre (hypoglycémie)',
        sub: 'Pâleur, sueurs, tremblements, faim, irritable. Évolue vite !',
        tone: 'danger',
        steps: [
          'Elle est **consciente** : faites-lui prendre **du sucre** (sirop, morceaux de sucre).',
          'Installez-la confortablement, rassurez-la.',
          '**Appelez rapidement le 112.**',
          'Perte de connaissance : **PLS**. Surveillez la respiration, gardez-la au chaud.',
        ],
      },
      {
        title: 'Trop de sucre (hyperglycémie)',
        sub: 'Soif, fatigue, urines fréquentes, haleine d’acétone. Évolue sur des heures.',
        steps: [
          'Position confortable.',
          'Somnolence ou perte de connaissance : **PLS + 112**.',
          'Surveillez la respiration, gardez-la au chaud.',
        ],
      },
    ],
  },
  {
    id: 'epilepsie',
    group: 'malaise',
    icon: 'Activity',
    title: 'Convulsions',
    sub: 'Épilepsie',
    keywords: 'epilepsie convulsion crise spasme tremble crampes grand mal',
    call: 'maybe',
    callWhen: 'Crise de plus de 5 minutes ou qui se répète : urgence vitale, 112.',
    signs: ['Cri, perte de connaissance, raideur', 'Secousses musculaires', 'Lèvres bleues, bave, perte d’urine', 'Somnolence ensuite'],
    sections: [
      {
        steps: [
          '**Éloignez** les objets dangereux, protégez sa tête.',
          'À la fin des convulsions, si elle somnole ou est inconsciente : **PLS**.',
          'Surveillez la respiration. Couvrez-la.',
          'Appelez le **112**.',
        ],
      },
    ],
    avoid: ['Rien entre les dents (risque de blessure).'],
  },
  {
    id: 'asthme',
    group: 'malaise',
    icon: 'Wind',
    title: 'Crise d’asthme',
    sub: 'Difficulté à respirer',
    keywords: 'asthme essoufflement respiration sifflante bronches crise respiratoire souffle',
    call: 'now',
    signs: ['Respiration sifflante, expiration longue', 'Essoufflement, teint grisâtre, sueurs', 'Buste penché, agitation'],
    sections: [
      {
        steps: [
          '**Rassurez-la.** Desserrez les vêtements qui gênent.',
          '**Relevez le haut du corps** : assise, penchée en avant.',
          'Aidez-la à prendre **son traitement**.',
          '**Frein labial** : souffler lentement, lèvres presque fermées.',
          '**Appelez le 112.**',
        ],
      },
    ],
  },
  {
    id: 'hyperventilation',
    group: 'malaise',
    icon: 'Gauge',
    title: 'Hyperventilation',
    sub: 'Crise d’angoisse',
    keywords: 'hyperventilation angoisse panique stress respire vite fourmillements spasmophilie',
    call: 'maybe',
    callWhen: 'Si vous ne parvenez pas à l’apaiser : 112.',
    signs: ['Respire vite et fort, nerveuse', 'Picotements dans les doigts, bouche engourdie', 'Doigts crispés, vertiges'],
    sections: [
      {
        steps: [
          'Restez **calme**, parlez doucement, rassurez.',
          'Invitez la personne à respirer **plus lentement**.',
          'Si besoin : respiration **dans un sac en plastique** (elle expire dedans et réinspire cet air).',
        ],
      },
    ],
  },
  {
    id: 'saignement-nez',
    group: 'malaise',
    icon: 'Droplets',
    title: 'Saignement de nez',
    keywords: 'nez saignement epistaxis',
    call: null,
    sections: [
      {
        steps: [
          '**Asseyez-la**, dos droit, **tête penchée en avant**.',
          '**Pincez les narines** l’une contre l’autre pendant quelques minutes.',
          'Refroidissez la nuque.',
          'Le saignement continue : consultez un médecin.',
        ],
      },
    ],
  },
  {
    id: 'saignement-autre',
    group: 'malaise',
    icon: 'Ear',
    title: 'Autres saignements',
    sub: 'Oreille, crachats, vomissements',
    keywords: 'oreille otorragie crachat de sang hemoptysie vomissement sang selles digestif',
    call: 'maybe',
    callWhen: 'Selon la gravité : consultez un médecin ou appelez le 112.',
    sections: [
      {
        title: 'Saignement de l’oreille',
        steps: ['Couvrez l’oreille d’un **pansement stérile**.', '**Laissez le sang s’écouler.**', 'Surélevez le haut du corps.'],
      },
      {
        title: 'Crachat de sang',
        sub: 'Toux avec sang rouge vif, gêne respiratoire',
        steps: ['Position **semi-assise**.', 'Parlez à la victime pour l’apaiser.', 'Médecin ou 112 selon la situation.'],
      },
      {
        title: 'Vomissements de sang, sang dans les selles',
        steps: [
          'Toujours **consulter un médecin** ; 112 si nécessaire.',
          'Position qui détend le ventre, selon le souhait de la personne.',
        ],
      },
    ],
  },
]

export const situationById = Object.fromEntries(situations.map((s) => [s.id, s]))
