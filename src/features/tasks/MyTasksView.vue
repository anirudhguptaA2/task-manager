
<template>
  <div>
    <div class="tasks-container">
      <div class="task-list-scroll">
        <div class="task-list">
          <h2>My Tasks</h2>
          <TaskCard 
            v-for="task in tasks" 
            :key="task.id" 
            :task="task" 
            :selected="selectedTask?.id === task.id"
            @click="selectTask(task)"
          />
        </div>
      </div>
      <div class="task-detail-panel">
        <TaskDetail :task="selectedTask" @delete="handleTaskDelete" @edit="handleTaskEdit" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TaskCard from '../../components/TaskCard.vue'
import TaskDetail from '../../components/TaskDetail.vue'
import { useRouter } from 'vue-router'
import { auth } from '../../infrastructure/firebase';
const router = useRouter();
function handleTaskEdit(taskId) {
  router.push({ path: '/tasks/add', query: { edit: taskId } });
}
const tasks = ref([]);
const selectedTask = ref(null);
const statusList = ref([]);
const priorityList = ref([]);

function selectTask(task) {
  selectedTask.value = task;
}

function refreshTasks() {
  const user = auth.currentUser;
  if (!user) {
    tasks.value = [];
    return;
  }
  const userKey = `tasks_${user.uid}`;
  tasks.value = JSON.parse(localStorage.getItem(userKey) || '[]');
}

function handleTaskDelete() {
  // If the deleted task was selected, select the first remaining task or null
  if (selectedTask.value && !tasks.value.find(t => t.id === selectedTask.value.id)) {
    selectedTask.value = tasks.value[0] || null;
  }
  refreshTasks();
}

onMounted(() => {
  refreshTasks();
  statusList.value = JSON.parse(localStorage.getItem('statusList') || '["Completed", "In Progress", "Not Started"]');
  priorityList.value = JSON.parse(localStorage.getItem('priorityList') || '["Extreme", "Moderate", "Low"]');
  selectedTask.value = tasks.value[0] || null; // default to first task if available
})
</script>

<style scoped>
/* Only the task list scrolls, not the whole view */
.my-tasks-root {
  position: fixed;
  inset: 0;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tasks-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  padding: 1rem;
  height: calc(92vh - 64px);
  box-sizing: border-box;
  flex: 1 1 auto;
}

.task-list-scroll {
  height: 100%;
  overflow-y: auto;
  min-width: 450px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  background: #f9f9f9;
  min-width: 0;
}

.task-detail-panel {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  background: #f9f9f9;
  min-width: 0;
  max-width: 650px;
}
</style>