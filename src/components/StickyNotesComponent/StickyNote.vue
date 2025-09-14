<template>
  <div :class="['min-h-45 rounded-xl p-[1.2rem_1rem_0.5rem_1rem] shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative text-lg flex flex-col justify-start break-words', 
    {
      'bg-yellow-100': note.color === 'yellow',
      'bg-sky-200': note.color === 'blue',
      'bg-pink-200': note.color === 'pink',
      'bg-orange-200': note.color === 'orange',
    }]">
    <div class="font-bold text-xl mb-2">{{ note.title }}</div>
    <div class="flex-1 mb-2 text-justify">{{ note.content }}</div>
    <button class="absolute top-2 right-2.5 text-[1.3rem] text-[#888] cursor-pointer transition-colors duration-200 hover:text-[#e74c3c]" @click="$emit('delete')">×</button>
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
