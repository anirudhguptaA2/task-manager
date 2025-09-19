<template>
  <div class="w-95 min-h-34 bg-[rgba(161,163,171,0.17)] border border-[#A1A3AB] rounded-[14px] p-[14px_18px_14px_18px] cursor-pointer transition-shadow duration-200 flex-col relative flex justify-center" @click="$emit('click')">
    <div class="flex flex-row items-start justify-between w-full">
      <div class="flex-[1_1_0] flex flex-col gap-2 min-w-0 overflow-visible">
        <div class="font-semibold text-lg text-[#111827] mb-0.5 text-left whitespace-nowrap overflow-hidden text-ellipsis">{{ task.title }}</div>
        <div class="font-normal text-[14px] text-justify text-[#444] mb-0.5 line-clamp-4 text-ellipsis leading-snug" :title="task.description">{{ task.desc }}</div>
      </div>
      <div class="w-20 h-20 rounded-[12px] overflow-hidden ml-4 bg-white flex items-center justify-center">
        <img class="w-full h-full object-cover rounded-xl" v-if="task.img" :src="task.img" :alt="task.title" />
        <img class="w-full h-full object-cover rounded-xl" v-else src="@/assets/placeholderImage.svg" alt="">
      </div>
    </div>
    <div class="flex flex-row items-center gap-3 mt-1 text-[12px] font-medium font-inter">
          <span class="font-medium bg-[#f3f4f6] rounded-md py-0.5 px-2.5 inline-block min-w-15 text-center priority" :style="{ color: priorityColor }">{{ task.priority }}</span>
          <span class="font-medium bg-[#f3f4f6] rounded-md py-0.5 px-2.5 inline-block min-w-15 text-center status" :style="{ color: statusColor }">{{ task.status }}</span>
          <span class="font-medium bg-[#f3f4f6] rounded-md py-0.5 px-2.5 inline-block min-w-15 text-center">
            <strong>Created:</strong>
            <span class="text-[#222] rounded-md min-w-0 py-0.5 px-2.5 font-medium">{{ formattedCreatedDate }}</span>
          </span>
        </div>
  </div>
</template>

<script>
export default {
  name: 'TaskCard',
  
  props: {
    task: {
      type: Object,
      required: true
    }
  },

  emits: ['click'],
  
  computed: {
    priorityColor() {
      let colorMap = {};
      try {
        colorMap = JSON.parse(localStorage.getItem('priorityColorMap')) || {};
      } catch (e) {
        colorMap = {};
      }
      return colorMap[this.task.priority] || '#888';
    },
    statusColor() {
      let colorMap = {};
      try {
        colorMap = JSON.parse(localStorage.getItem('statusColorMap')) || {};
      } catch (e) {
        colorMap = {};
      }
      return colorMap[this.task.status] || '#888';
    },
    formattedCreatedDate() {
      if (!this.task.createdDate) return '';
      console.log('Created Date: =============== ', this.task.createdDate);
      const d = new Date(this.task.createdDate);
      if (isNaN(d)) return this.task.createdDate;
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
}
</script>
