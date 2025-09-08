<template>
  <div class="add-task-bg">
    <div class="add-task-modal">
      <div class="add-task-header">
        <span class="add-task-title">{{ isEdit ? 'Edit Task' : 'Add New Task' }}</span>
        <a href="#" class="add-task-back" @click.prevent="goBack">Go Back</a>
      </div>
      <form class="add-task-form" @submit.prevent="handleSubmit">
        <div class="add-task-form-inner">
          <div class="add-task-fields">
            <div class="form-group">
              <label for="title">Title</label>
              <input id="title" v-model="title" placeholder="Enter task title" type="text" required />
            </div>
            <div class="form-group">
              <label for="date">Date</label>
              <input id="date" v-model="date" type="date" required />
            </div>
            <div class="form-group">
              <label>Priority</label>
              <div class="priority-row">
                <label v-for="p in priorityList" :key="p" class="priority-label" :class="p.toLowerCase()">
                  <input type="checkbox" :checked="priority === p" @change="selectPriority(p)" />
                  <span class="dot" :style="p === 'Extreme' ? 'background:#ef4444' : p === 'Moderate' ? 'background:#3b82f6' : p === 'Low' ? 'background:#22c55e' : ''"></span> {{ p }}
                </label>
              </div>
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="status" required>
                <option v-for="s in statusList" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="desc">Task Description</label>
              <textarea id="desc" v-model="desc" placeholder="Start writing here......" rows="5"></textarea>
            </div>
          </div>
            <div class="add-task-upload">
              <label>Upload Image</label>
              <div class="upload-box"
                @dragover.prevent
                @drop.prevent="handleDrop">
                <div v-if="imageData" class="image-preview">
                  <img :src="imageData" alt="Preview" />
                </div>
                <template v-else>
                  <div class="upload-icon">
                    <svg width="48" height="48" fill="none" stroke="#bbb" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#f8fafc"/><path d="M12 16V8m0 0-3 3m3-3 3 3" stroke="#bbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                  <div class="upload-text">Drag & Drop files here<br />or</div>
                </template>
                <input type="file" id="file-upload" class="file-input" accept="image/*" @change="handleFile" />
                <label for="file-upload" class="browse-btn">Browse</label>
              </div>
            </div>
        </div>
  <button class="add-task-done" type="submit">{{ isEdit ? 'Update' : 'Add' }}</button>
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
const isEdit = ref(false);
const editTaskId = ref(null);

  // removed duplicate import of auth
onMounted(() => {
  statusList.value = JSON.parse(localStorage.getItem('statusList') || '["Completed", "In Progress", "Not Started"]');
  priorityList.value = JSON.parse(localStorage.getItem('priorityList') || '["Extreme", "Moderate", "Low"]');
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

<style scoped>
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
</style>
