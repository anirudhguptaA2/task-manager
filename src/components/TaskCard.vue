<template>
  <div class="task-card" @click="$emit('click')">
    <div class="task-content">
      <div class="task-main">
        <div class="task-title">{{ task.title }}</div>
        <div class="task-desc" :title="task.description">{{ task.desc }}</div>
      </div>
      <div class="task-image">
        <img v-if="task.img" :src="task.img" :alt="task.title" />
        <img v-else src="../assets/placeholderImage.svg" alt="">
      </div>
    </div>
    <div class="task-meta-row">
          <span class="meta priority" :style="{ color: priorityColor }">{{ task.priority }}</span>
          <span class="meta status" :style="{ color: statusColor }">{{ task.status }}</span>
          <span class="meta date"><strong>Created:</strong> {{ formattedCreatedDate }}</span>
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

<style scoped>
.task-card {
  width: 370px;
  min-height: 134px;
  background: rgba(161, 163, 171, 0.17);
  border: 1px solid #A1A3AB;
  border-radius: 14px;
  padding: 14px 18px 14px 18px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.task-card:hover {
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.task-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.task-main {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  overflow: visible;
}

.task-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 17px;
  color: #111827;
  margin-bottom: 2px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-desc {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  text-align: justify;
  color: #444;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4em;
}

.task-meta-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  margin-top: 2px;
  font-size: 12px;
  font-family: 'Inter', sans-serif;
}

.meta {
  font-weight: 500;
  background: #f3f4f6;
  border-radius: 6px;
  padding: 2px 10px;
  display: inline-block;
  min-width: 60px;
  text-align: center;
}

.meta.date {
  color: #222;
  background: #e5e7eb;
  border-radius: 6px;
  min-width: 0;
  padding: 2px 8px;
  font-weight: 500;
}

.task-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  margin-left: 18px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}
</style>
