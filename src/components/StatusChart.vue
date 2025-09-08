<template>
  <div class="status-chart">
    <svg width="60" height="60">
      <circle cx="30" cy="30" r="26" stroke="#e5e7eb" stroke-width="8" fill="none" />
      <circle cx="30" cy="30" r="26" :stroke="color" stroke-width="8" fill="none"
        :stroke-dasharray="2 * Math.PI * 26"
        :stroke-dashoffset="2 * Math.PI * 26 * (1 - percent / 100)"
        stroke-linecap="round"
      />
    </svg>
    <div class="status-percent">{{ percent }}%</div>
    <div class="status-label" :style="{ color }">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  color: String,
  percent: Number
});
</script>

<style scoped>
.status-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}
.status-percent {
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 0.2rem;
}
.status-label {
  font-size: 0.98rem;
  font-weight: 600;
}
</style>
