<script setup>
// Choix exclusif : options = [{ value, label }]
import { vRoving } from '../directives/roving'
defineProps({
  modelValue: { type: String, required: true },
  options: { type: Array, required: true },
  label: { type: String, required: true },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div v-roving class="seg" role="radiogroup" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      class="opt"
      :aria-checked="modelValue === o.value"
      :class="{ on: modelValue === o.value }"
      @click="$emit('update:modelValue', o.value)"
    >
      <slot name="option" :option="o">{{ o.label }}</slot>
    </button>
  </div>
</template>

<style scoped>
.seg {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: var(--surface-2);
}
.opt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  min-height: 46px;
  padding: var(--s-1) var(--s-2);
  text-align: center;
  line-height: 1.15;
  border-radius: 10px;
  font-weight: 700;
  font-size: var(--fs-sm);
  color: var(--text-2);
  transition: background-color 0.2s var(--ease), color 0.2s;
}
.opt.on {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-sm);
}
</style>
