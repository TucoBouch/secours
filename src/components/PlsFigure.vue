<script setup>
// Schémas de la position latérale de sécurité, vus de dessus (tête à gauche,
// le secouriste est en bas). Le membre à déplacer à chaque étape est en couleur d'accent.
defineProps({ n: { type: Number, required: true } })
</script>

<template>
  <svg class="pls" viewBox="0 0 150 100" role="img" :aria-label="`Schéma de l’étape ${n}`">
    <defs>
      <marker id="pls-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0 1 L9 5 L0 9z" fill="var(--text-2)" />
      </marker>
    </defs>
    <!-- sol -->
    <rect x="0" y="0" width="150" height="100" rx="12" class="floor" />

    <!-- ÉTAPES 1 à 3 : sur le dos -->
    <g v-if="n < 4" class="body">
      <!-- jambes -->
      <g class="limb">
        <line v-if="n !== 3" x1="70" y1="44" x2="128" y2="44" />
        <line x1="70" y1="58" x2="128" y2="58" />
      </g>
      <!-- tronc + tête -->
      <rect x="34" y="34" width="42" height="34" rx="11" class="torso" />
      <circle cx="21" cy="51" r="11" class="head" />

      <!-- bras éloigné -->
      <line v-if="n === 1" x1="42" y1="35" x2="96" y2="30" class="limb thin" />
      <g v-else>
        <path d="M43 36 Q 72 38 32 61" class="limb thin hot" />
        <circle cx="31" cy="61" r="4.5" class="handdot" />
      </g>
      <!-- bras proche : angle droit -->
      <line x1="44" y1="67" x2="44" y2="92" :class="['limb', 'thin', { hot: n === 1 }]" />

      <!-- jambe éloignée fléchie (étape 3) -->
      <g v-if="n === 3">
        <polyline points="72,44 98,74 120,60" class="limb hot" />
        <path d="M86 18 C 112 18 130 34 126 52" class="arrow" marker-end="url(#pls-arrow)" fill="none" />
      </g>
      <!-- repères -->
      <path v-if="n === 1" d="M44 67 h8 v8" class="angle" fill="none" />
    </g>

    <!-- ÉTAPE 4 : en PLS, sur le côté -->
    <g v-else class="body">
      <!-- jambe inférieure droite -->
      <line x1="72" y1="58" x2="128" y2="58" class="limb" />
      <!-- jambe supérieure fléchie, genou en avant -->
      <polyline points="72,50 104,80 126,64" class="limb hot" />
      <!-- tronc sur le côté -->
      <rect x="34" y="40" width="42" height="26" rx="11" class="torso" />
      <!-- bras supérieur : main sous la joue -->
      <polyline points="46,42 62,60 24,64" class="limb thin" />
      <!-- bras inférieur -->
      <line x1="44" y1="64" x2="44" y2="86" class="limb thin" />
      <!-- tête en arrière -->
      <circle cx="19" cy="52" r="11" class="head" />
      <path d="M12 34 C 20 28 30 29 36 36" class="arrow" fill="none" marker-end="url(#pls-arrow)" />
      <!-- écoulement -->
      <path d="M13 66 q-1 7 2 10" class="drop" fill="none" />
      <ellipse cx="15.5" cy="80" rx="2.2" ry="3" class="dropfill" />
    </g>
  </svg>
</template>

<style scoped>
.pls { width: 100%; max-width: 270px; height: auto; display: block; }
.floor { fill: var(--surface-2); }
.torso { fill: var(--surface); stroke: var(--text-2); stroke-width: 2; }
.head { fill: var(--surface); stroke: var(--text-2); stroke-width: 2; }
.limb { stroke: var(--text-2); stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; fill: none; opacity: 0.55; }
.limb.thin { stroke-width: 6; opacity: 0.7; }
.limb.hot { stroke: var(--accent); opacity: 1; }
.arrow { stroke: var(--text-2); stroke-width: 2.2; stroke-linecap: round; }
.handdot { fill: var(--accent); }
.angle { stroke: var(--accent); stroke-width: 2; }
.drop { stroke: var(--accent); stroke-width: 1.8; stroke-linecap: round; stroke-dasharray: 1 4; }
.dropfill { fill: var(--accent); }
</style>
