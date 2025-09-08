<template>
  <div class="add-category-bg">
    <div class="add-category-modal">
      <h2>Add New Category</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="categoryName">Category Name</label>
          <input v-model="categoryName" id="categoryName" type="text" required />
        </div>
        <div class="form-actions">
          <button type="submit">Add</button>
          <button type="button" @click="handleCancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const categoryName = ref('');

const handleSubmit = () => {
  // TODO: Add logic to save the new category
  // For now, just go back
  router.back();
};

const handleCancel = () => {
  router.back();
};
</script>

<style scoped>
.add-category-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.add-category-modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  padding: 2rem 2.5rem;
  min-width: 320px;
  max-width: 90vw;
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
input[type="text"] {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  color: rgb(10, 10, 10);
  background-color: white;
  border-radius: 6px;
  font-size: 1rem;
}
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
button {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
button[type="button"] {
  background: #ddd;
  color: #333;
}
button:hover {
  background: #dc2626;
}
button[type="button"]:hover {
  background: #bbb;
}
</style>
