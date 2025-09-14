<template>
  <div class="flex flex-col items-center gap-1.5">
    <svg width="60" height="60">
      <circle cx="30" cy="30" r="26" stroke="#e5e7eb" stroke-width="8" fill="none" />
      <circle cx="30" cy="30" r="26" :stroke="color" stroke-width="8" fill="none"
        :stroke-dasharray="2 * Math.PI * 26"
        :stroke-dashoffset="2 * Math.PI * 26 * (1 - percent / 100)"
        stroke-linecap="round"
      />
    </svg>
    <div class="text-xl font-bold mt-1">{{ percent }}%</div>
    <div class="text-sm font-semibold" :style="{ color }">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  color: String,
  percent: Number
});
</script>
