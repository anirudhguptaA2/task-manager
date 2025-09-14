<template>
  <div class="bg-stone-100 min-h-screen">
    <Navbar />
    <div class="max-w-270 m-auto mt-8 bg-white rounded-2xl shadow-lg p-8 flex flex-1 flex-col">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Welcome back, {{ userName }} <span class="text-2xl">👋</span></h1>
      </div>
      <div class="flex gap-8 flex-1 min-h-0">
        <div class="flex-1">
          <div class="bg-[#f9fafb] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 mb-8">
            <div class="flex justify-between items-center mb-6">
              <span class="text-2xl font-semibold text-[#ef4444]">To-Do</span>
              <button class="text-[#ef4444] font-semibold cursor-pointer" @click="goToAddTask">+ Add task</button>
            </div>
            <div class="flex flex-col gap-6">
                <TaskCard v-for="task in todoTasks" :key="task.id" :task="task" @click="() => openTaskDetail(task)" />
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div class="bg-[#f9fafb] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 mb-8">
            <span class="text-2xl font-semibold text-[#ef4444]">Task Status</span>
            <div class="flex gap-8 mt-5">
              <StatusChart v-for="status in statusList" :key="status" :label="status" :color="getStatusColor(status)" :percent="getStatusPercent(status)" />
            </div>
          </div>
          <div class="bg-[#f9fafb] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 mb-8">
            <span class="text-2xl font-semibold text-[#ef4444]">Completed Task</span>
            <div class="flex flex-col gap-6">
              <TaskCard v-for="task in completedTasks" :key="task.id" :task="task" completed class="border-l-4 border-l-[#22c55e]" @click="() => openTaskDetail(task)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDetail" class="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.18)] z-1000 flex items-center justify-center" @click.self="closeTaskDetail">
      <div class="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.14)] p-8 min-w-340px max-w-45vw max-h-90vh overflow-y-auto">
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
import Navbar from '../../components/NavBarComponent/Navbar.vue';

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

