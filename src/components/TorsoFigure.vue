<script setup>
import { ref } from 'vue'

// Torse vu de dessus, mains posées au centre de la poitrine.
// Le parent appelle pulse() à chaque compression.
const hands = ref(null)
const ring = ref(null)
const chest = ref(null)

const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

function pulse(period = 500) {
  const d = Math.min(260, period * 0.55)
  if (!reduced) {
    hands.value?.animate(
      [
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(9px) scale(0.93)', offset: 0.35 },
        { transform: 'translateY(0) scale(1)' },
      ],
      { duration: d, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
    chest.value?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(0.985)', offset: 0.35 }, { transform: 'scale(1)' }],
      { duration: d, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
  }
  ring.value?.animate(
    [
      { opacity: 0.75, transform: 'scale(0.8)' },
      { opacity: 0, transform: reduced ? 'scale(0.8)' : 'scale(2.1)' },
    ],
    { duration: Math.min(480, period * 0.95), easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  )
}

defineExpose({ pulse })
</script>

<template>
  <svg class="torso" viewBox="0 0 320 340" role="img" aria-label="Torse : placer les mains au centre de la poitrine">
    <g ref="chest" class="chest">
      <!-- silhouette : cou, épaules, tronc -->
      <path
        d="M130 0 V28 C130 42 96 50 62 62 C30 72 10 88 8 116 C6 150 22 168 30 200 C38 240 52 290 66 336 H254 C268 290 282 240 290 200 C298 168 314 150 312 116 C310 88 290 72 258 62 C224 50 190 42 190 28 V0 Z"
        class="skin"
      />
      <!-- clavicules, sternum, côtes -->
      <path d="M160 64 C140 66 112 72 92 86" class="detail" />
      <path d="M160 64 C180 66 208 72 228 86" class="detail" />
      <path d="M160 72 V238" class="detail strong" />
      <path d="M160 104 C128 108 100 120 84 140" class="detail faint" />
      <path d="M160 104 C192 108 220 120 236 140" class="detail faint" />
      <path d="M160 146 C124 150 98 164 84 188" class="detail faint" />
      <path d="M160 146 C196 150 222 164 236 188" class="detail faint" />
      <!-- zone de compression -->
      <circle cx="160" cy="186" r="46" class="zone" />
      <circle ref="ring" cx="160" cy="186" r="46" class="ring" />
    </g>

    <!-- mains + bras tendus -->
    <g ref="hands" class="hands" style="transform-origin: 160px 186px">
      <path d="M143 206 H177 L184 348 H136 Z" class="arm" stroke-linejoin="round" />
      <path d="M138 318 H182" class="cuff" />
      <rect x="116" y="162" width="88" height="56" rx="24" class="hand under" />
      <rect x="124" y="156" width="72" height="50" rx="22" class="hand over" />
      <path d="M142 170 v22 M154 166 v26 M166 166 v26 M178 170 v22" class="fingers" />
    </g>
  </svg>
</template>

<style scoped>
.torso { width: 100%; height: auto; display: block; overflow: visible; }
.skin { fill: var(--surface-2); stroke: var(--line); stroke-width: 2.5; }
.detail { fill: none; stroke: var(--text-2); stroke-width: 2.5; stroke-linecap: round; opacity: 0.4; }
.detail.strong { opacity: 0.55; stroke-width: 3; }
.detail.faint { opacity: 0.22; }
.chest { transform-origin: 160px 186px; transform-box: view-box; }
.zone { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 3; stroke-dasharray: 3 8; stroke-linecap: round; }
.ring { fill: none; stroke: var(--accent); stroke-width: 5; opacity: 0; transform-origin: 160px 186px; transform-box: view-box; }
.arm { fill: var(--accent); stroke: var(--accent); stroke-width: 10; }
.cuff { stroke: var(--on-accent); stroke-width: 3; stroke-linecap: round; opacity: 0.55; }
.hand { stroke: var(--accent-strong); stroke-width: 3; }
.hand.under { fill: var(--accent-soft); }
.hand.over { fill: var(--surface); }
.fingers { stroke: var(--accent-strong); stroke-width: 3; stroke-linecap: round; opacity: 0.55; }
</style>
