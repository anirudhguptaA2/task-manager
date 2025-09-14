<template>
  <div v-if="localTask" class="relative border border-[#e5e7eb] bg-[#fff] rounded-2xl p-4 shadow-xs flex flex-col">

    <div class="flex gap-4 items-start mb-3">
      <img v-if="localTask.img" :src="localTask.img" alt="" class="w-24 h-24 object-cover rounded-xl" />
      <div class="flex-1">
        <h2 class="m-[0_0_4px] text-xl font-bold text-[#111827]">{{ localTask.title }}</h2>

        <div class="flex gap-1 items-center leading-[1.4]">
          <span class="font-semibold text-[#4b5563]">Priority:</span>
          <span class="font-semibold" :style="{ color: getPriorityColor }">{{ localTask.priority }}</span>
        </div>

        <div class="flex gap-1 items-center leading-[1.4]">
          <span class="font-semibold text-[#4b5563]">Status:</span>
          <span class="font-semibold" :style="{ color: getStatusColor }">{{ localTask.status }}</span>
        </div>

        <div class="flex gap-1 items-center leading-[1.4] text-[#9ca3af]">
          <span class="font-semibold text-[#4b5563]">Date of Completion:</span>
          <span class="font-semibold">{{ localTask.date }}</span>
        </div>
      </div>
    </div>

  <div class="mt-2 mb-4 text-[#374151] text-left">
      <p class="mt-2.5">
        <span class="font-bold text-[#111827]">Task Description:</span>
        {{ localTask.desc }}
      </p>
    </div>

  <div class="mt-auto flex justify-end gap-2" v-if="showActions">
      <button class="w-10 h-10 border-none rounded-lg flex items-center justify-center cursor-pointer shadow-sm p-0 bg-[#ef4444]" aria-label="Delete" @click="handleDelete">
        <img src="@/assets/delete.svg" alt="">
      </button>
      <button class="w-10 h-10 border-none rounded-lg flex items-center justify-center cursor-pointer shadow-sm p-0 bg-[#f43f5e]" aria-label="Edit" @click="handleEdit">
        <img src="@/assets/edit.svg" alt="">
      </button>
    </div>
  </div>

  <div v-else class="relative border border-[#e5e7eb] bg-[#fff] rounded-2xl p-4 shadow-xs text-[#9ca3af] py-12 px-4">
    Select a task to see details
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { auth } from '../../infrastructure/firebase';

const emit = defineEmits(['delete', 'edit']);

const props = defineProps({
  task: { type: Object, default: null },
  showActions: { type: Boolean, default: true }
})

const localTask = ref(props.task)

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

const getPriorityColor = computed(() => {
  if (!localTask.value?.priority) return '';
  const colorMap = JSON.parse(localStorage.getItem('priorityColorMap') || '{}');
  return colorMap[localTask.value.priority] || '';
});

const getStatusColor = computed(() => {
  if (!localTask.value?.status) return '';
  const colorMap = JSON.parse(localStorage.getItem('statusColorMap') || '{}');
  return colorMap[localTask.value.status] || '';
});
</script>