
<template>
  <div class="profile-bg">
    <div class="profile-card">
      <div class="profile-header">
        <span class="profile-title">Account Information</span>
        <a class="profile-back" href="#" @click.prevent="$router.back()">Go Back</a>
      </div>
      <div class="profile-user-row">
        <img class="profile-avatar" :src="userPhoto" alt="User avatar" />
        <div v-if="editMode" class="profile-upload-wrap">
          <input type="file" id="profile-upload" accept="image/*" @change="onProfileImageChange" />
          <label for="profile-upload" class="profile-upload-btn">Upload Photo</label>
        </div>
        <div class="profile-user-meta">
          <div class="profile-user-name">{{ userName }}</div>
          <div class="profile-user-email">{{ userEmail }}</div>
        </div>
      </div>
      <div class="profile-form-card">
        <form class="profile-form" @submit.prevent="onEditOrUpdate">
          <div class="profile-form-group">
            <label>First Name</label>
            <input type="text" v-model="firstName" :disabled="!editMode" />
          </div>
          <div class="profile-form-group">
            <label>Last Name</label>
            <input type="text" v-model="lastName" :disabled="!editMode" />
          </div>
          <div class="profile-form-group">
            <label>Email Address</label>
            <input type="email" v-model="email" disabled />
          </div>
          <div class="profile-form-group">
            <label>Contact Number</label>
            <input type="text" v-model="contact" :disabled="!editMode" />
          </div>
          <div class="profile-form-group">
            <label>Position</label>
            <input type="text" v-model="position" :disabled="!editMode" />
          </div>
          <div class="profile-form-actions">
            <button class="profile-btn update" type="submit">{{ editMode ? 'Update' : 'Edit Info' }}</button>
            <button v-if="editMode" class="profile-btn cancel" type="button" @click="onCancelEdit">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Handle profile image upload
function onProfileImageChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('Only image files are allowed.');
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    userPhoto.value = event.target.result;
    saveProfileToLocalStorage();
  };
  reader.readAsDataURL(file);
}

let originalProfile = null;

import { ref, onMounted } from 'vue';
import { auth } from '../../infrastructure/firebase';
import { useUserStore } from '../../application/userStore';
import { updateUserProfile } from '../../infrastructure/updateUserProfile';


const userStore = useUserStore();
const userName = ref('Sundar Gurung');
const userEmail = ref('sundargurung360@gmail.com');
import placeholderImg from '@/assets/placeholderImage.svg';
import { getCurrentUserId } from './userUtil.js';
const userPhoto = ref('');
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const contact = ref('');
const position = ref('');
const editMode = ref(false);

function getProfileKey() {
  const uid = getCurrentUserId();
  return uid ? `profileInfo_${uid}` : 'profileInfo_guest';
}

function loadProfileFromLocalStorage() {
  const data = localStorage.getItem(getProfileKey());
  if (data) {
    try {
      const profile = JSON.parse(data);
      userName.value = profile.userName || userName.value;
      userEmail.value = profile.userEmail || userEmail.value;
      userPhoto.value = profile.userPhoto || '';
      firstName.value = profile.firstName || '';
      lastName.value = profile.lastName || '';
      email.value = profile.email || '';
      contact.value = profile.contact || '';
      position.value = profile.position || '';
      userStore.setUserInfo(profile);
    } catch (e) {}
  }
  // If no photo, use placeholder
  if (!userPhoto.value) {
    userPhoto.value = placeholderImg;
  }
}

function saveProfileToLocalStorage() {
  const profile = {
    userName: userName.value,
    userEmail: userEmail.value,
    userPhoto: userPhoto.value,
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    contact: contact.value,
    position: position.value,
  };
  localStorage.setItem(getProfileKey(), JSON.stringify(profile));
  userStore.setUserInfo(profile);
  userName.value = `${firstName.value} ${lastName.value}`.trim();
}

onMounted(() => {
  loadProfileFromLocalStorage();
  const user = auth.currentUser;
  if (user) {
    userName.value = user.displayName || userName.value;
    userEmail.value = user.email || userEmail.value;
    // Only set userPhoto from Firebase if not already set in localStorage
    if (!userPhoto.value || userPhoto.value === placeholderImg) {
      userPhoto.value = user.photoURL || placeholderImg;
    }
    email.value = user.email || user.email || '';
    if (user.displayName) {
      const parts = user.displayName.split(' ');
      firstName.value = parts[0] || '';
      lastName.value = parts.slice(1).join(' ') || '';
    }
    saveProfileToLocalStorage();
  }
  // If still no photo, use placeholder
  if (!userPhoto.value) {
    userPhoto.value = placeholderImg;
  }
});

async function onEditOrUpdate() {
  if (!editMode.value) {
    originalProfile = {
      firstName: firstName.value,
      lastName: lastName.value,
      contact: contact.value,
      position: position.value,
      userPhoto: userPhoto.value,
    };
    editMode.value = true;
    return;
  }
function onCancelEdit() {
  editMode.value = false;
}

  const user = auth.currentUser;
  if (user) {
    try {
      const profileUpdate = {
        displayName: `${firstName.value} ${lastName.value}`.trim(),
      };
      // Only update photoURL if it's a real URL (not base64)
      if (userPhoto.value && !userPhoto.value.startsWith('data:')) {
        profileUpdate.photoURL = userPhoto.value;
      }
      await updateUserProfile(profileUpdate);
      saveProfileToLocalStorage();
      editMode.value = false;
      alert('Info updated!');
    } catch (e) {
      alert('Failed to update info: ' + (e.message || e));
    }
  } else {
    saveProfileToLocalStorage();
    editMode.value = false;
    alert('Info updated locally!');
  }
}

function changePassword() {
  alert('Change password clicked!');
}
</script>

<style scoped>
.profile-upload-wrap {
  margin-left: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.profile-upload-btn {
  margin-top: 8px;
  background: #f3f4f6;
  color: #222;
  border-radius: 6px;
  padding: 4px 16px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #ddd;
  transition: background 0.2s;
  display: inline-block;
}
.profile-upload-btn:hover {
  background: #e5e7eb;
}
.profile-upload-wrap input[type="file"] {
  display: none;
}
.profile-btn.cancel {
  background: #64748b;
  color: #fff;
}
.profile-bg {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 18px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.profile-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 32px 28px 32px 28px;
  max-width: 900px;
  width: 100%;
  border: 1.5px solid #e5e7eb;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}
.profile-title {
  font-size: 2rem;
  font-weight: 700;
  border-bottom: 3px solid #ef4444;
  padding-bottom: 2px;
}
.profile-back {
  font-weight: 600;
  color: #222;
  text-decoration: underline;
  margin-top: 4px;
}
.profile-user-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}
.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid #e5e7eb;
}
.profile-user-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.profile-user-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}
.profile-user-email {
  color: #444;
  font-size: 1.05rem;
}
.profile-form-card {
  background: #f5f6fa;
  border-radius: 12px;
  border: 1.2px solid #d1d5db;
  padding: 32px 24px 24px 24px;
}
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.profile-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.profile-form-group label {
  font-weight: 500;
  color: #222;
  margin-bottom: 2px;
  text-align: left;
}
.profile-form-group input {
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 12px;
  width: 300px;
  font-size: 1rem;
  background: #fff;
  color: black;
  outline: none;
  transition: border 0.2s;
}
.profile-form-group input:focus {
  border-color: #ef4444;
}
.profile-form-actions {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}
.profile-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 22px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s;
}
.profile-btn.change {
  background: #f97316;
}
.profile-btn:hover {
  filter: brightness(0.95);
}
</style>
}
