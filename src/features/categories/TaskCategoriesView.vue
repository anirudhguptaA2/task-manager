<template>
  <div class="bg-[#f5f7fa] min-h-[100vh] p-0">
    <Navbar />
    <div class="max-w-4xl m-auto bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-[2.5rem_2rem_2rem_2rem] border-2 border-[#e5e7eb]">
      <div class="flex items-center justify-between mb-[1.2rem]">
        <div class="text-[2rem] font-bold text-[#222]">Task Categories</div>
        <!-- <a href="#" class="text-[#111] font-semibold underline text-base">Go Back</a> -->
      </div>

      <div class="mb-[2.2rem] bg-[#f7f8fa] rounded-2xl p-[1.2rem_1rem_1.5rem_1rem] border-[1.5px] border-[#e5e7eb]">
        <div class="flex mb-3 items-center justify-between">
          <span class="text-lg font-bold text-[#222]">Task Status</span>
          <a href="#" class="text-[#ef4444] text-base font-semibold cursor-pointer" @click.prevent="openAdd('status')">+ Add Task Status</a>
        </div>
        <div class="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-[1.5px] border-[#e5e7eb] overflow-x-auto">
          <table class="w-full border-collapse text-[1.08rem] bg-white">
            <thead>
              <tr>
                <th class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center bg-[#f7f8fa] font-bold text-[#222]">SN</th>
                <th class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center bg-[#f7f8fa] font-bold text-[#222]">Task Status</th>
                <th class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center bg-[#f7f8fa] font-bold text-[#222]">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(status, i) in statusList" :key="status">
                <td class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center text-[#222]">{{ i + 1 }}</td>
                <td class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center text-[#222]">{{ status }}</td>
                <td class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center text-[#222]">
                  <button class="bg-[#f97316] text-white rounded-lg p-[0.5rem_1.2rem_0.5rem_0.8rem] text-base font-semibold m-[0_0.3rem] inline-flex items-center gap-[0.4rem] cursor-pointer transition-colors duration-200 hover:brightness-[0.95]" 
                    @click="openEdit('status', i, status)">
                    <svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="3" fill="#fff"/>
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" fill="#f97316"/>
                    </svg> Edit
                  </button>
                  <button class="bg-[#ef4444] text-white rounded-lg p-[0.5rem_1.2rem_0.5rem_0.8rem] text-base font-semibold m-[0_0.3rem] inline-flex items-center gap-[0.4rem] cursor-pointer transition-colors duration-200 hover:brightness-[0.95]" 
                    @click="deleteStatus(i)">
                    <svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="3" fill="#fff"/>
                    <path d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-7 0v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" fill="#ef4444"/>
                    </svg> Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-[2.2rem] bg-[#f7f8fa] rounded-2xl p-[1.2rem_1rem_1.5rem_1rem] border-[1.5px] border-[#e5e7eb]">
        <div class="flex mb-3 items-center justify-between">
          <span class="text-lg font-bold text-[#222]">Task Priority</span>
          <a href="#" class="text-[#ef4444] text-base font-semibold cursor-pointer" @click.prevent="openAdd('priority')">+ Add New Priority</a>
        </div>
        <div class="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-[1.5px] border-[#e5e7eb] overflow-x-auto">
          <table class="w-full border-collapse text-[1.08rem] bg-white">
            <thead>
              <tr>
                <th class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center bg-[#f7f8fa] font-bold text-[#222]">SN</th>
                <th class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center bg-[#f7f8fa] font-bold text-[#222]">Task Priority</th>
                <th class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center bg-[#f7f8fa] font-bold text-[#222]">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(priority, i) in priorityList" :key="priority">
                <td class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center">{{ i + 1 }}</td>
                <td class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center">{{ priority }}</td>
                <td class="border border-[#e5e7eb] py-[0.8rem] px-4 text-center">
                  <button class="bg-[#f97316] text-white rounded-lg p-[0.5rem_1.2rem_0.5rem_0.8rem] text-base font-semibold m-[0_0.3rem] inline-flex items-center gap-[0.4rem] cursor-pointer transition-colors duration-200 hover:brightness-[0.95]" @click="openEdit('priority', i, priority)"><svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#fff"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" fill="#f97316"/></svg> Edit</button>
                  <button class="bg-[#ef4444] text-white rounded-lg p-[0.5rem_1.2rem_0.5rem_0.8rem] text-base font-semibold m-[0_0.3rem] inline-flex items-center gap-[0.4rem] cursor-pointer transition-colors duration-200 hover:brightness-[0.95]" @click="deletePriority(i)"><svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#fff"/><path d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-7 0v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" fill="#ef4444"/></svg> Delete</button>
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
import Navbar from '../../components/NavBarComponent/Navbar.vue';
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
  isAddMode.value = false;
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
    const oldName = statusList.value[editIndex.value];
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
