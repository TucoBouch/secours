<script setup>
defineProps({ size: { type: Number, default: 34 } })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="18" fill="var(--accent)" />
    <path d="M26 13h12v13h13v12H38v13H26V38H13V26h13z" fill="var(--on-accent)" />
  </svg>
</template>
