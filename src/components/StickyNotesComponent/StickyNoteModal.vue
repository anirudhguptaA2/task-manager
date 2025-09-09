<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>Add Sticky Note</h2>
      <form @submit.prevent="save">
        <input v-model="title" placeholder="Title" maxlength="32" required />
        <textarea v-model="content" placeholder="Content" rows="4" maxlength="300" required />
        <div class="color-row">
          <label v-for="c in colors" :key="c" :style="{ background: colorMap[c] }" class="color-radio">
            <input type="radio" v-model="color" :value="c" />
            <span></span>
          </label>
        </div>
        <div class="modal-actions">
          <button type="button" @click="$emit('close')">Cancel</button>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['close', 'save']);
const title = ref('');
const content = ref('');
const color = ref('yellow');
const colors = ['yellow', 'blue', 'pink', 'orange'];
const colorMap = {
  yellow: '#fff9c4',
  blue: '#b3e5fc',
  pink: '#ffd1dc',
  orange: '#ffe0b2',
};
function save() {
  emit('save', { title: title.value, content: content.value, color: color.value });
  title.value = '';
  content.value = '';
  color.value = 'yellow';
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.13);
}
.modal h2 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 700;
}
.modal input, .modal textarea {
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  padding: 0.6rem;
  font-size: 1rem;
}
.color-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;
}
.color-radio {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  position: relative;
}
.color-radio input {
  display: none;
}
.color-radio span {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #888;
  background: transparent;
  position: absolute;
  top: 3px; left: 3px;
}
.color-radio input:checked + span {
  border: 2px solid #222;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
.modal-actions button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  background: #ededed;
  color: #222;
  transition: background 0.2s;
}
.modal-actions button[type="submit"] {
  background: #222;
  color: #fff;
}
.modal-actions button:hover {
  background: #e0e0e0;
}
</style>
