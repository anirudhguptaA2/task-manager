<template>
  <div class="categories-bg">
    <div class="categories-main">
      <div class="categories-header">
        <div class="categories-title">Task Categories</div>
        <a href="#" class="categories-back">Go Back</a>
      </div>

      <div class="categories-section">
        <div class="categories-section-header">
          <span class="categories-section-title">Task Status</span>
          <a href="#" class="categories-add-link" @click.prevent="openAdd('status')">+ Add Task Status</a>
        </div>
        <div class="categories-table-wrap">
          <table class="categories-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Task Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(status, i) in statusList" :key="status">
                <td>{{ i + 1 }}</td>
                <td>{{ status }}</td>
                <td>
                  <button class="action-btn edit" @click="openEdit('status', i, status)"><svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#fff"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" fill="#f97316"/></svg> Edit</button>
                  <button class="action-btn delete" @click="deleteStatus(i)"><svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#fff"/><path d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-7 0v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" fill="#ef4444"/></svg> Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="categories-section">
        <div class="categories-section-header">
          <span class="categories-section-title">Task Priority</span>
          <a href="#" class="categories-add-link" @click.prevent="openAdd('priority')">+ Add New Priority</a>
        </div>
        <div class="categories-table-wrap">
          <table class="categories-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Task Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(priority, i) in priorityList" :key="priority">
                <td>{{ i + 1 }}</td>
                <td>{{ priority }}</td>
                <td>
                  <button class="action-btn edit" @click="openEdit('priority', i, priority)"><svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#fff"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" fill="#f97316"/></svg> Edit</button>
                  <button class="action-btn delete" @click="deletePriority(i)"><svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#fff"/><path d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-7 0v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" fill="#ef4444"/></svg> Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <EditModal
    v-if="showEditModal"
    :modelValue="editValue"
    :colorValue="editColor"
    :type="editType"
    @update:modelValue="val => editValue = val"
    @update:colorValue="val => editColor = val"
    @save="(val, color) => saveEditFromModal(val, color)"
    @cancel="closeEdit"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EditModal from '../../components/EditCategoriesComponent/EditModal.vue';
const router = useRouter();

const statusList = ref([]);
const priorityList = ref([]);
const showEditModal = ref(false);
const editType = ref(''); // 'status' or 'priority'
const editIndex = ref(-1);
const editValue = ref('');
const editColor = ref('#888888');
const statusColorMap = ref({});
const priorityColorMap = ref({});
const isAddMode = ref(false);

onMounted(() => {
  statusList.value = JSON.parse(localStorage.getItem('statusList') || '["Completed", "In Progress", "Not Started"]');
  priorityList.value = JSON.parse(localStorage.getItem('priorityList') || '["Extreme", "Moderate", "Low"]');
  statusColorMap.value = JSON.parse(localStorage.getItem('statusColorMap') || '{}');
  priorityColorMap.value = JSON.parse(localStorage.getItem('priorityColorMap') || '{}');
});

function saveStatusList() {
  localStorage.setItem('statusList', JSON.stringify(statusList.value));
  localStorage.setItem('statusColorMap', JSON.stringify(statusColorMap.value));
}
function savePriorityList() {
  localStorage.setItem('priorityList', JSON.stringify(priorityList.value));
  localStorage.setItem('priorityColorMap', JSON.stringify(priorityColorMap.value));
}

function deleteStatus(idx) {
  const name = statusList.value[idx];
  statusList.value.splice(idx, 1);
  delete statusColorMap.value[name];
  saveStatusList();
}
function deletePriority(idx) {
  const name = priorityList.value[idx];
  priorityList.value.splice(idx, 1);
  delete priorityColorMap.value[name];
  savePriorityList();
}

function openEdit(type, idx, value) {
  editType.value = type;
  editIndex.value = idx;
  editValue.value = value;
  if (type === 'status') {
    editColor.value = statusColorMap.value[value] || '#888888';
  } else {
    editColor.value = priorityColorMap.value[value] || '#888888';
  }
  showEditModal.value = true;
}
function closeEdit() {
  showEditModal.value = false;
  editType.value = '';
  editIndex.value = -1;
  editValue.value = '';
  editColor.value = '#888888';
}
function openAdd(type) {
  editType.value = type;
  editIndex.value = -1;
  editValue.value = '';
  editColor.value = '#888888';
  isAddMode.value = true;
  showEditModal.value = true;
}
function saveEdit() {
  if (editType.value === 'status') {
    statusList.value[editIndex.value] = editValue.value;
    // Move color to new name
    statusColorMap.value[editValue.value] = editColor.value;
    if (oldName !== editValue.value) delete statusColorMap.value[oldName];
    saveStatusList();
  } else if (editType.value === 'priority') {
    const oldName = priorityList.value[editIndex.value];
    priorityList.value[editIndex.value] = editValue.value;
    // Move color to new name
    priorityColorMap.value[editValue.value] = editColor.value;
    if (oldName !== editValue.value) delete priorityColorMap.value[oldName];
    savePriorityList();
  }
  closeEdit();
}
function saveEditFromModal(val, color) {
  if (isAddMode.value) {
    if (editType.value === 'status') {
      statusList.value.push(val);
      statusColorMap.value[val] = color;
      saveStatusList();
    } else if (editType.value === 'priority') {
      priorityList.value.push(val);
      priorityColorMap.value[val] = color;
      savePriorityList();
    }
    closeEdit();
    isAddMode.value = false;
    return;
  }
  editValue.value = val;
  editColor.value = color;
  saveEdit();
}
</script>

<style scoped>
.categories-bg {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 0;
}
.categories-main {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  border: 2px solid #e5e7eb;
}
.categories-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
}
.categories-title {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
}
.categories-title::after {
  content: "";
  display: block;
  width: 48px;
  height: 4px;
  background: #ef4444;
  border-radius: 2px;
  margin-top: 4px;
}
.categories-back {
  color: #111;
  font-weight: 600;
  text-decoration: underline;
  font-size: 1rem;
}
.categories-section {
  margin-bottom: 2.2rem;
  background: #f7f8fa;
  border-radius: 14px;
  padding: 1.2rem 1rem 1.5rem 1rem;
  border: 1.5px solid #e5e7eb;
}
.categories-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.7rem;
}
.categories-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
}
.categories-add-link {
  color: #ef4444;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.categories-table-wrap {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1.5px solid #e5e7eb;
  overflow-x: auto;
}
.categories-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.08rem;
  background: #fff;
}
.categories-table th, .categories-table td {
  border: 1px solid #e5e7eb;
  padding: 0.8rem 1rem;
  text-align: center;
}
.categories-table th {
  background: #f7f8fa;
  font-weight: 700;
  color: #222;
}
.categories-table td {
  color: #222;
}
.action-btn {
  background: #ff5722;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem 0.5rem 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: background 0.2s;
}
.action-btn.edit {
  background: #f97316;
}
.action-btn.delete {
  background: #ef4444;
}
.action-btn:hover {
  filter: brightness(0.95);
}
.edit-modal-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.edit-modal {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  padding: 1.5rem 2rem;
  min-width: 260px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.edit-modal h4 {
  margin-bottom: 1rem;
}
.edit-modal input[type="text"] {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
}
.color-picker-row label {
  font-weight: 500;
}
.edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
}
.edit-actions button {
  padding: 0.4rem 1.2rem;
  border: none;
  border-radius: 6px;
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-actions button:last-child {
  background: #ddd;
  color: #333;
}
.edit-actions button:hover {
  background: #dc2626;
}
.edit-actions button:last-child:hover {
  background: #bbb;
}
</style>
