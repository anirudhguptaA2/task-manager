<template>
  <Navbar />
  <div class="min-h-screen bg-[#f5f5f5] p-4">
    <div class="max-w-4xl m-[2rem_auto] bg-[#fff] rounded-xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
      <h1 class="text-4xl font-bold mb-6">Sticky Wall</h1>
      <div class="grid grid-cols-3 gap-8 gap-x-6">
        <StickyNote
          v-for="note in notes"
          :key="note.id"
          :note="note"
          @delete="deleteNote(note.id)"
        />
        <div class="flex items-center justify-center bg-[#ededed] rounded-xl min-h-45 text-5xl text-[#222] cursor-pointer transition-colors duration-200 hover:bg-[#e0e0e0]" 
        @click="showModal = true">
          <span>+</span>
        </div>
      </div>
      <StickyNoteModal v-if="showModal" @close="showModal = false" @save="addNote" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import StickyNote from '../../components/StickyNotesComponent/StickyNote.vue';
import StickyNoteModal from '../../components/StickyNotesComponent/StickyNoteModal.vue';
import { getCurrentUserId } from './userUtil.js';
import Navbar from '../../components/NavBarComponent/Navbar.vue';

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
