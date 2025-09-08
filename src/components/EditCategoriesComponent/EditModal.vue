<template>
  <div class="edit-modal-bg">
    <div class="edit-modal">
      <h4>Edit {{ type === 'status' ? 'Status' : 'Priority' }}</h4>
      <input v-model="localValue" type="text" />
      <div class="color-picker-row">
        <label>Color:</label>
        <input type="color" v-model="localColor" />
      </div>
      <div class="edit-actions">
        <button @click="$emit('save', localValue, localColor)">Save</button>
        <button @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  modelValue: String,
  colorValue: String,
  type: String
});
const emit = defineEmits(['update:modelValue', 'update:colorValue', 'save', 'cancel']);
const localValue = ref(props.modelValue);
const localColor = ref(props.colorValue);

watch(() => props.modelValue, (val) => { localValue.value = val; });
watch(() => props.colorValue, (val) => { localColor.value = val; });
watch(localValue, (val) => { emit('update:modelValue', val); });
watch(localColor, (val) => { emit('update:colorValue', val); });
</script>

<style scoped>
.edit-modal-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.edit-modal {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  padding: 1.5rem 2rem;
  min-width: 260px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.edit-modal h4 {
  margin-bottom: 1rem;
}
.edit-modal input[type="text"] {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
}
.color-picker-row label {
  font-weight: 500;
}
.edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
}
.edit-actions button {
  padding: 0.4rem 1.2rem;
  border: none;
  border-radius: 6px;
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-actions button:last-child {
  background: #ddd;
  color: #333;
}
.edit-actions button:hover {
  background: #dc2626;
}
.edit-actions button:last-child:hover {
  background: #bbb;
}
</style>
