<template>
  <div class="fixed top-0 left-0 right-0 bottom-0 inset-0 flex items-center justify-center z-1000 modal-bg-fix bg-white/30 backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] p-[1.5rem_1.2rem_1.2rem_1.2rem] min-w-100 max-w-[95vw] max-h-[85vh] overflow-y-auto">
      <div class="flex justify-between items-start mb-6">
        <span class="text-[1.3rem] font-bold text-[#222] border-b-2 border-[#ef4444] pb-0.5">{{ isEdit ? 'Edit Task' : 'Add New Task' }}</span>
        <a href="#" class="text-[#222] font-medium underline cursor-pointer mt-0.5" @click.prevent="goBack">Go Back</a>
      </div>
      <form class="border-[1.5px_solid_#ddd] rounded-[8px] p-[2rem_1.5rem_1.5rem_1.5rem]" @submit.prevent="handleSubmit">
        <div class="flex gap-5">
          <div class="flex-2">
            <div class="mb-4">
              <label class="block mb-[0.4rem] font-medium" for="title">Title</label>
              <input class="w-125 py-2 px-3 border border-[1.5px_solid_#bbb] text-[#222] bg-white rounded-md text-base mb-1" id="title" v-model="title" placeholder="Enter task title" type="text" required />
            </div>
            <div class="mb-4">
              <label class="block mb-[0.4rem] font-medium" for="date">Date</label>
              <input class="w-125 py-2 px-3 border border-[1.5px_solid_#bbb] text-[#222] bg-white rounded-md text-base mb-1" id="date" v-model="date" type="date" required />
            </div>
            <div class="mb-4">
              <label class="block mb-[0.4rem] font-medium">Priority</label>
              <div class="flex gap-6 items-center mt-1">
                <label v-for="p in priorityList" :key="p" class="flex items-center gap-[0.3rem] text-base font-medium" :class="p.toLowerCase()">
                  <input class="mr-1" type="checkbox" :checked="priority === p" @change="selectPriority(p)" />
                  <span class="inline-block w-2.5 h-2.5 rounded-[50%] ml-[0.12rem]" :style="'background:' + (priorityColorMap[p] || '#888888')"></span> {{ p }}
                </label>
              </div>
            </div>
            <div class="mb-4">
              <label class="block mb-[0.4rem] font-medium" for="status">Status</label>
              <select class="w-full py-2 px-3 border border-[1.5px_solid_#bbb] text-[#222] bg-white rounded-md text-base mb-[0.2rem]" id="status" v-model="status" required>
                <option v-for="s in statusList" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block mb-[0.4rem] font-medium" for="desc">Task Description</label>
              <textarea class="w-125 p-[0.7rem_0.9rem] border border-[1.5px_solid_#bbb] text-[#000000] bg-white rounded-md text-base min-h-30 resize-y" 
                id="desc" v-model="desc" placeholder="Start writing here......" rows="5">
              </textarea>
            </div>
          </div>
            <div class="flex-1 flex flex-col items-center justify-start ml-8">
              <label class="font-medium mb-2 block text-center">Upload Image</label>
              <div class="border border-[1.5px_solid_#bbb] rounded-lg flex flex-col items-center justify-center min-w-50 min-h-45 bg-[#f8fafc] mt-[0.2rem] relative"
                @dragover.prevent
                @drop.prevent="handleDrop">
                <div v-if="imageData" class="w-30 h-30 flex items-center justify-center mb-2 rounded-lg overflow-hidden bg-[#f3f4f6] border border-[#ddd]">
                  <img :src="imageData" alt="Preview" />
                </div>
                <template v-else>
                  <div class="mb-[0.7rem]">
                    <svg width="48" height="48" fill="none" stroke="#bbb" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#f8fafc"/><path d="M12 16V8m0 0-3 3m3-3 3 3" stroke="#bbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                  <div class="text-[#888] text-[0.98rem] text-center mb-2">Drag & Drop files here<br />or</div>
                </template>
                <input type="file" id="file-upload" accept="image/*" @change="handleFile" class="hidden" />
                <label for="file-upload" class="inline-block bg-[#eee] text-[#222] rounded-md p-[0.3rem_1.2rem] font-medium text-base cursor-pointer mt-[0.2rem] transition-colors duration-200">
                  Browse
                </label>
              </div>
            </div>
        </div>
        <button class="mt-6 bg-[#ef4444] text-white rounded-[7px] p-[0.7rem_2.5rem] text-[1.1rem] font-semibold cursor-pointer transition-colors duration-200" 
          type="submit">{{ isEdit ? 'Update' : 'Add' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const title = ref('');
const date = ref('');
const desc = ref('');
const status = ref('');
const statusList = ref([]);
const priority = ref('');
const priorityList = ref([]);
const priorityColorMap = ref({});
const isEdit = ref(false);
const editTaskId = ref(null);

  // removed duplicate import of auth
onMounted(() => {
  statusList.value = JSON.parse(localStorage.getItem('statusList') || '["Completed", "In Progress", "Not Started"]');
  priorityList.value = JSON.parse(localStorage.getItem('priorityList') || '["Extreme", "Moderate", "Low"]');
  priorityColorMap.value = JSON.parse(localStorage.getItem('priorityColorMap') || '{}');
  // Set default status if not set
  if (!status.value && statusList.value.length > 0) status.value = statusList.value[0];

  // Check for edit mode
  const user = auth.currentUser;
  if (route.query.edit && user) {
    isEdit.value = true;
    editTaskId.value = Number(route.query.edit);
    const userKey = `tasks_${user.uid}`;
    const tasks = JSON.parse(localStorage.getItem(userKey) || '[]');
    const task = tasks.find(t => t.id === editTaskId.value);
    if (task) {
      title.value = task.title || '';
      date.value = task.date || '';
      desc.value = task.desc || '';
      status.value = task.status || '';
      priority.value = task.priority || '';
      imageData.value = task.img || '';
    }
  }
});

function selectPriority(val) {
  priority.value = priority.value === val ? '' : val;
}

function selectStatus(val) {
  status.value = status.value === val ? '' : val;
}
const file = ref(null);
const imageData = ref('');
const goBack = () => router.back();

const handleFile = (e) => {
  const selected = e.target.files[0];
  if (!selected) {
    imageData.value = '';
    return;
  }
  if (!selected.type.startsWith('image/')) {
    alert('Only image files are allowed.');
    file.value = null;
    imageData.value = '';
    e.target.value = '';
    return;
  }
  file.value = selected;
  compressImage(selected, (dataUrl) => {
    imageData.value = dataUrl;
  });
};

function compressImage(file, callback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new window.Image();
    img.onload = () => {
      const maxDim = 200;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height *= maxDim / width));
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width *= maxDim / height));
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 quality
      callback(dataUrl);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

const handleDrop = (e) => {
  const dropped = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!dropped) return;
  if (!dropped.type.startsWith('image/')) {
    alert('Only image files are allowed.');
    return;
  }
  file.value = dropped;
  compressImage(dropped, (dataUrl) => {
    imageData.value = dataUrl;
  });
};
import { auth } from '../../infrastructure/firebase';
const handleSubmit = () => {
  const user = auth.currentUser;
  if (!user) return;
  const userKey = `tasks_${user.uid}`;
  const tasks = JSON.parse(localStorage.getItem(userKey) || '[]');
  if (isEdit.value && editTaskId.value) {
    // Update existing task
    const idx = tasks.findIndex(t => t.id === editTaskId.value);
    if (idx !== -1) {
      tasks[idx] = {
        ...tasks[idx],
        title: title.value,
        date: date.value,
        desc: desc.value,
        status: status.value,
        priority: priority.value,
        img: imageData.value || '',
        createdDate: tasks[idx].createdDate || new Date().toISOString(),
      };
      localStorage.setItem(userKey, JSON.stringify(tasks));
    }
  } else {
    // Add new task
    const newTask = {
      id: Date.now(),
      title: title.value,
      desc: desc.value,
      priority: priority.value,
      status: status.value,
      date: date.value,
      img: imageData.value || '',
      createdDate: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorage.setItem(userKey, JSON.stringify(tasks));
  }
  router.back();
};
</script>

<!-- <style scoped>
.add-task-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  /* background: rgba(255,255,255,0.3); */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.add-task-modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  min-width: 400px;
  max-width: 95vw;
  max-height: 85vh;
  overflow-y: auto;
}
.add-task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}
.add-task-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  border-bottom: 2px solid #ef4444;
  padding-bottom: 2px;
}
.add-task-back {
  color: #222;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 2px;
}
.add-task-form {
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
}
.add-task-form-inner {
  display: flex;
  gap: 1.2rem;
}
.add-task-fields {
  flex: 2;
}
.add-task-upload {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-left: 2rem;
}
.form-group {
  margin-bottom: 1.1rem;
}
label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
}
input[type="text"], input[type="date"] {
  width: 500px;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #bbb;
  color: #222;
  background-color: white;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}
textarea {
  width: 500px;
  padding: 0.7rem 0.9rem;
  border: 1.5px solid #bbb;
  color: #000000;
  background-color: white;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
}
.priority-row {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-top: 0.2rem;
}
.priority-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 1rem;
  font-weight: 500;
}
.priority-label .dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 2px;
}
.extreme .dot { background: #ef4444; }
.moderate .dot { background: #3b82f6; }
.low .dot { background: #22c55e; }
.add-task-upload label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
  text-align: center;
}
.upload-box {
  border: 1.5px solid #bbb;
  border-radius: 8px;
  padding: 1.2rem 1.2rem 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  min-height: 180px;
  background: #f8fafc;
  margin-top: 0.2rem;
  position: relative;
}
.upload-icon {
  margin-bottom: 0.7rem;
}
.upload-text {
  color: #888;
  font-size: 0.98rem;
  text-align: center;
  margin-bottom: 0.5rem;
}
.file-input {
  display: none;
}
.browse-btn {
  display: inline-block;
  background: #eee;
  color: #222;
  border-radius: 6px;
  padding: 0.3rem 1.2rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  margin-top: 0.2rem;
  transition: background 0.2s;
}
.browse-btn:hover {
  background: #ddd;
}
.add-task-done {
  margin-top: 1.5rem;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.7rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.add-task-done:hover {
  background: #dc2626;
}
select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #bbb;
  color: #222;
  background-color: white;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}
.image-preview {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  border: 1px solid #ddd;
}
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
@media (max-width: 900px) {
  .add-task-modal {
    min-width: 90vw;
    padding: 1.2rem 0.5rem;
  }
  .add-task-form-inner {
    flex-direction: column;
    gap: 1.2rem;
  }
  .add-task-upload {
    margin-top: 0;
  }
}
</style> -->
