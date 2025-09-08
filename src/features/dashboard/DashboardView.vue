<template>
  <div>
    <div class="dashboard-main">
      <div class="dashboard-header">
        <h1>Welcome back, {{ userName }} <span class="wave">👋</span></h1>
      </div>
      <div class="dashboard-content">
        <div class="dashboard-left">
          <div class="todo-section">
            <div class="section-header">
              <span class="todo-title">To-Do</span>
              <button class="add-task" @click="goToAddTask">+ Add task</button>
            </div>
            <div class="todo-list">
                <TaskCard v-for="task in todoTasks" :key="task.id" :task="task" @click="() => openTaskDetail(task)" />
            </div>
          </div>
        </div>
        <div class="dashboard-right">
          <div class="status-section">
            <span class="status-title">Task Status</span>
            <div class="status-charts">
              <StatusChart v-for="status in statusList" :key="status" :label="status" :color="getStatusColor(status)" :percent="getStatusPercent(status)" />
            </div>
          </div>
          <div class="completed-section">
            <span class="completed-title">Completed Task</span>
            <div class="completed-list">
                <TaskCard v-for="task in completedTasks" :key="task.id" :task="task" completed @click="() => openTaskDetail(task)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDetail" class="dashboard-detail-modal" @click.self="closeTaskDetail">
      <div class="dashboard-detail-modal-content">
        <TaskDetail :task="detailTask" :showActions="false" @delete="closeTaskDetail" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../../infrastructure/firebase';
import { signOut } from 'firebase/auth';
import TaskCard from '../../components/TaskComponents/TaskCard.vue';
import StatusChart from '../../components/ChartComponent/StatusChart.vue';


const router = useRouter();
const goToAddTask = () => {
  router.push('/tasks/add');
};

const handleLogout = async () => {
  router.push('/login');
};
  import TaskDetail from '../../components/TaskComponents/TaskDetail.vue';

const statusList = ref([]);
const priorityList = ref([]);
const todoTasks = ref([]);
const completedTasks = ref([]);
const userName = ref('');
const showDetail = ref(false);
const detailTask = ref(null);

function openTaskDetail(task) {
  detailTask.value = task;
  showDetail.value = true;
}
function closeTaskDetail() {
  showDetail.value = false;
  detailTask.value = null;
}

onMounted(() => {
  statusList.value = JSON.parse(localStorage.getItem('statusList') || '["Completed", "In Progress", "Not Started"]');
  priorityList.value = JSON.parse(localStorage.getItem('priorityList') || '["Extreme", "Moderate", "Low"]');
  const user = auth.currentUser;
  let tasks = [];
  if (user) {
    const userKey = `tasks_${user.uid}`;
    tasks = JSON.parse(localStorage.getItem(userKey) || '[]');
    userName.value = user.displayName || user.email || 'User';
  } else {
    userName.value = 'User';
  }
  const sortedTasks = tasks.slice().sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return b.createdAt - a.createdAt;
    } else if (a.id && b.id) {
      return (b.id > a.id) ? 1 : (b.id < a.id) ? -1 : 0;
    } else {
      return 0;
    }
  });
  todoTasks.value = sortedTasks.filter(task => statusList.value.includes(task.status) && task.status !== 'Completed');
  completedTasks.value = sortedTasks.filter(task => task.status === 'Completed');
});

function getStatusColor(status) {
  const colorMap = JSON.parse(localStorage.getItem('statusColorMap') || '{}');
  if (colorMap[status]) return colorMap[status];
  return '#888';
}
function getStatusPercent(status) {
  const user = auth.currentUser;
  if (!user) return 0;
  const userKey = `tasks_${user.uid}`;
  const tasks = JSON.parse(localStorage.getItem(userKey) || '[]');
  const total = tasks.length;
  if (!total) return 0;
  const count = tasks.filter(t => t.status === status).length;
  return Math.round((count / total) * 100);
}
</script>

<style scoped>
.dashboard-bg {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.navbar {
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 10;
}
.navbar-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
}
.navbar-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar-links li a {
  text-decoration: none;
  color: #444;
  font-weight: 500;
  font-size: 1.08rem;
  transition: color 0.2s;
}
.navbar-links li a:hover {
  color: #ef4444;
}
.dashboard-main {
  max-width: 1200px;
  margin: 2rem auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.dashboard-header h1 {
  font-size: 2.2rem;
  font-weight: 700;
}
.wave {
  font-size: 2rem;
}
.dashboard-avatars {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.invite-btn {
  background: #fff;
  color: #ef4444;
  border: 1.5px solid #ef4444;
  border-radius: 8px;
  padding: 0.4rem 1rem;
  font-weight: 600;
  margin-left: 0.5rem;
  cursor: pointer;
}
.dashboard-content {
  display: flex;
  gap: 2rem;
  flex: 1;
  min-height: 0;
}
.dashboard-left, .dashboard-right {
  flex: 1;
}
.todo-section, .completed-section, .status-section {
  background: #f9fafb;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.5rem;
  margin-bottom: 2rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}
.todo-title, .completed-title, .status-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ef4444;
}
.add-task {
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 600;
  cursor: pointer;
}
.todo-list, .completed-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.task-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1rem 1.2rem;
  gap: 1rem;
  position: static;
}
.task-card.completed {
  border-left: 4px solid #22c55e;
}
.task-main {
  flex: 1;
}
.task-title {
  font-size: 1.08rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.task-desc {
  font-size: 0.98rem;
  color: #444;
  margin-bottom: 0.5rem;
}
.task-meta {
  font-size: 0.92rem;
  color: #888;
  display: flex;
  gap: 1.2rem;
}
.task-priority {
  color: #2563eb;
}
.task-status {
  color: #ef4444;
}
.task-status.in-progress {
  color: #2563eb;
}
.task-status.completed {
  color: #22c55e;
}
.task-date {
  color: #888;
}
.task-img {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
}
.status-charts {
  display: flex;
  gap: 2rem;
  margin-top: 1.2rem;
}
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
/* Modal styles for task detail */
.dashboard-detail-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dashboard-detail-modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.14);
  padding: 2rem;
  min-width: 340px;
  max-width: 45vw;
  max-height: 90vh;
  overflow-y: auto;
}
.close-detail {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
}
</style>
