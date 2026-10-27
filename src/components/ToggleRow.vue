<script setup>
// Ligne « libellé + interrupteur » (role=switch).
defineProps({
  modelValue: Boolean,
  label: { type: String, required: true },
  hint: String,
  disabled: Boolean,
})
defineEmits(['update:modelValue'])
</script>

<template>
  <button
    type="button"
    class="row"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="txt">
      <span class="lbl">{{ label }}</span>
      <span v-if="hint" class="hint">{{ hint }}</span>
    </span>
    <span class="track" :class="{ on: modelValue }" aria-hidden="true"><span class="thumb"></span></span>
  </button>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: var(--s-4);
  width: 100%;
  min-height: 56px;
  padding: var(--s-2) 0;
  text-align: left;
}
.row:disabled { opacity: 0.5; cursor: not-allowed; }
.txt { flex: 1; display: grid; gap: 1px; }
.lbl { font-weight: 700; }
.hint { font-size: var(--fs-sm); color: var(--text-2); line-height: 1.35; }
.track {
  position: relative;
  flex: none;
  width: 54px;
  height: 32px;
  border-radius: 999px;
  background: var(--surface-2);
  box-shadow: inset 0 0 0 2px var(--line);
  transition: background-color 0.2s var(--ease), box-shadow 0.2s;
}
.track.on { background: var(--accent); box-shadow: none; }
.thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--text-2);
  transition: transform 0.2s var(--ease), background-color 0.2s;
}
.track.on .thumb { transform: translateX(22px); background: var(--on-accent); }
</style>
