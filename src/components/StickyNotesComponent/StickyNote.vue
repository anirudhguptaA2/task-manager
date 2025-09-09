<template>
  <div :class="['sticky-note', note.color]">
    <div class="note-title">{{ note.title }}</div>
    <div class="note-content">{{ note.content }}</div>
    <button class="delete-btn" @click="$emit('delete')">×</button>
  </div>
</template>

<script setup>
defineProps({
  note: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.sticky-note {
  min-height: 180px;
  border-radius: 12px;
  padding: 1.2rem 1rem 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  position: relative;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  word-break: break-word;
}
.sticky-note .note-title {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.sticky-note .note-content {
  flex: 1;
  margin-bottom: 0.5rem;
  text-align: justify;
}
.sticky-note .delete-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.sticky-note .delete-btn:hover {
  color: #e74c3c;
}
.sticky-note.yellow { background: #fff9c4; }
.sticky-note.blue { background: #b3e5fc; }
.sticky-note.pink { background: #ffd1dc; }
.sticky-note.orange { background: #ffe0b2; }
</style>
