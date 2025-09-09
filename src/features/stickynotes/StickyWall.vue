<template>
  <div class="sticky-wall">
    <h1>Sticky Wall</h1>
    <div class="sticky-grid">
      <StickyNote
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @delete="deleteNote(note.id)"
      />
      <div class="sticky-add" @click="showModal = true">
        <span>+</span>
      </div>
    </div>
    <StickyNoteModal v-if="showModal" @close="showModal = false" @save="addNote" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import StickyNote from '../../components/StickyNotesComponent/StickyNote.vue';
import StickyNoteModal from '../../components/StickyNotesComponent/StickyNoteModal.vue';
import { getCurrentUserId } from './userUtil.js';

const showModal = ref(false);
const notes = ref([]);

function getUserKey() {
  const uid = getCurrentUserId();
  return uid ? `stickyNotes_${uid}` : null;
}

function loadNotes() {
  const key = getUserKey();
  if (!key) return [];
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
}

function saveNotes(val) {
  const key = getUserKey();
  if (key) localStorage.setItem(key, JSON.stringify(val));
}

onMounted(() => {
  notes.value = loadNotes();
});

watch(notes, (val) => {
  saveNotes(val);
}, { deep: true });

function addNote(note) {
  notes.value.push({ ...note, id: Date.now() });
  showModal.value = false;
}

function deleteNote(id) {
  notes.value = notes.value.filter(n => n.id !== id);
}
</script>

<style scoped>
.sticky-wall {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}
.sticky-wall h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
.sticky-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 1.5rem;
}
.sticky-add {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ededed;
  border-radius: 12px;
  min-height: 180px;
  font-size: 3rem;
  color: #222;
  cursor: pointer;
  transition: background 0.2s;
}
.sticky-add:hover {
  background: #e0e0e0;
}
</style>
