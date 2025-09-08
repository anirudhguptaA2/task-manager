<template>
  <div v-if="localTask" class="detail-card">
    
    <div class="header">
      <img v-if="localTask.img" :src="localTask.img" alt="" class="thumb" />
      <div class="meta">
        <h2 class="title">{{ localTask.title }}</h2>

        <div class="meta-row">
          <span class="meta-label">Priority:</span>
          <span :class="['meta-value', priorityClass]">{{ localTask.priority }}</span>
        </div>

        <div class="meta-row">
          <span class="meta-label">Status:</span>
          <span :class="['meta-value', statusClass]">{{ localTask.status }}</span>
        </div>

        <div class="meta-row muted">
          <span class="meta-label">Date of Completion:</span>
          <span class="meta-value">{{ localTask.date }}</span>
        </div>
      </div>
    </div>

    <div class="body">
      <p class="block">
        <span class="label">Task Description:</span>
        {{ localTask.desc }}
      </p>
    </div>

    <div class="actions" v-if="showActions">
      <button class="icon danger" aria-label="Delete" @click="handleDelete">
  <img src="@/assets/delete.svg" alt="">
      </button>
      <button class="icon edit" aria-label="Edit" @click="handleEdit">
  <img src="@/assets/edit.svg" alt="">
      </button>
    </div>
  </div>

  <div v-else class="detail-card empty">Select a task to see details</div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'


const emit = defineEmits(['delete', 'edit']);

function handleEdit() {
  if (!localTask.value?.id) return;
  emit('edit', localTask.value.id);
}

// removed duplicate import of auth
function handleDelete() {
  if (!localTask.value?.id) return;
  const user = auth.currentUser;
  if (!user) return;
  const userKey = `tasks_${user.uid}`;
  const tasks = JSON.parse(localStorage.getItem(userKey) || '[]');
  const updated = tasks.filter(t => t.id !== localTask.value.id);
  localStorage.setItem(userKey, JSON.stringify(updated));
  localTask.value = null;
  emit('delete');
}

const props = defineProps({
  task: { type: Object, default: null },
  showActions: { type: Boolean, default: true }
})

const localTask = ref(props.task)

import { auth } from '../../infrastructure/firebase';
function fetchTaskFromStorage(id) {
  if (!id) return null;
  const user = auth.currentUser;
  if (!user) return null;
  const userKey = `tasks_${user.uid}`;
  const tasks = JSON.parse(localStorage.getItem(userKey) || '[]');
  return tasks.find(t => t.id === id) || null;
}

watch(
  () => props.task?.id,
  (id) => {
    if (id) {
      localTask.value = fetchTaskFromStorage(id)
    } else {
      localTask.value = null
    }
  },
  { immediate: true }
)

const priorityClass = computed(() => {
  switch (localTask.value?.priority) {
    case 'Extreme': return 'red'
    case 'Moderate': return 'amber'
    case 'Low': return 'green'
    default: return ''
  }
})

const statusClass = computed(() => {
  switch (localTask.value?.status) {
    case 'Not Started': return 'red'
    case 'In Progress': return 'blue'
    case 'Completed': return 'green'
    default: return ''
  }
})
</script>

<style scoped>
.detail-card{
  position: relative;
  border: 1px solid #e5e7eb;
  background:#fff;
  border-radius:16px;
  padding:16px;
  box-shadow: 0 1px 2px rgba(0,0,0,.04);
}
.detail-card.empty{ color:#9ca3af; padding:48px 16px; }

.header{
  display:flex; gap:16px; align-items:flex-start; margin-bottom:12px;
}
.thumb{
  width:96px; height:96px; object-fit:cover; border-radius:12px;
}
.meta{ flex:1; }
.title{ margin:0 0 4px; font-size:20px; font-weight:700; color:#111827; }

.meta-row{ display:flex; gap:6px; align-items:center; line-height:1.4; }
.meta-label{ font-weight:600; color:#4b5563; }
.meta-value{ font-weight:600; }
.muted{ color:#9ca3af; }
.red{ color:#ef4444; }
.blue{ color:#3b82f6; }
.green{ color:#10b981; }
.amber{ color:#f59e0b; }

.body{ 
  margin-top:8px; 
  margin-bottom:48px; 
  color:#374151;
  text-align:left; 
}

.label{ 
  font-weight:700; 
  color:#111827; 
}
.block{ 
  margin-top:10px; 
}
.notes{ 
  margin:6px 0 0 18px; 
}
.notes li{ 
  margin:6px 0; 
}

.actions{
  position:absolute; 
  right:12px; 
  bottom:12px; 
  display:flex; 
  gap:8px;
}
.icon{
  width:40px;
  height:40px;
  border:none;
  border-radius:10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor:pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,.08);
  padding: 0;
}
.icon.danger{ 
  background:#ef4444; 
}
.icon.edit{ 
  background:#f43f5e; 
}
.icon:active{ 
  transform: translateY(1px); 
  }
</style>