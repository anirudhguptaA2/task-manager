<template>
  <Navbar />
  <div class="min-h-screen bg-[#f7f8fa] p-[18px_0] flex justify-center items-start">
    <div class="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-[32px_28px_32px_28px] max-w-225 w-full border-[1.5px_solid_#e5e7eb]">
      <div class="flex justify-between items-start mb-4.5">
        <span class="text-[2rem] font-bold border-b-[3px_solid_#ef4444] pb-0.5">Account Information</span>
        <a class="font-semibold text-[#222] underline mt-1" href="#" @click.prevent="$router.back()">Go Back</a>
      </div>
      <div class="flex items-center gap-4.5 mb-6">
        <img class="w-20 h-20 rounded-[50%] object-cover border-[2.5px_solid_#e5e7eb]" :src="userPhoto" alt="User avatar" />
        <div v-if="editMode" class="ml-4.5 flex flex-col items-start">
          <input class="hidden" type="file" id="profile-upload" accept="image/*" @change="onProfileImageChange" />
          <label for="profile-upload" class="mt-2 bg-[#f3f4f6] text-[#222] rounded-md py-1 px-4 cursor-pointer border border-[#ddd] transition-colors duration-200 inline-block hover:bg-[#e5e7eb]">
            Upload Photo
          </label>
        </div>
        <div class="flex flex-col gap-0.5">
          <div class="text-lg font-semibold text-[#111827]">{{ userName }}</div>
          <div class="text-[1.05rem] text-[#444]">{{ userEmail }}</div>
        </div>
      </div>
      <div class="bg-[#f5f6fa] rounded-xl border-[1.2px_solid_#d1d5db] p-[32px_24px_24px_24px]">
        <form class="flex flex-col gap-4.5" @submit.prevent="onEditOrUpdate">
          <div class="flex flex-col gap-1.5">
            <label class="font-medium text-[#222] mb-0.5 text-left">First Name</label>
            <input class="border-[1.5px_solid_#cbd5e1] rounded-md py-2 px-3 w-75 text-base bg-white text-black transition-[border_0.2s]" type="text" v-model="firstName" :disabled="!editMode" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-medium text-[#222] mb-0.5 text-left">Last Name</label>
            <input class="border-[1.5px_solid_#cbd5e1] rounded-md py-2 px-3 w-75 text-base bg-white text-black transition-[border_0.2s]" type="text" v-model="lastName" :disabled="!editMode" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-medium text-[#222] mb-0.5 text-left">Email Address</label>
            <input class="border-[1.5px_solid_#cbd5e1] rounded-md py-2 px-3 w-75 text-base bg-white text-black transition-[border_0.2s]" type="email" v-model="email" :disabled="!editMode" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-medium text-[#222] mb-0.5 text-left">Contact Number</label>
            <input class="border-[1.5px_solid_#cbd5e1] rounded-md py-2 px-3 w-75 text-base bg-white text-black transition-[border_0.2s]" type="text" v-model="contact" :disabled="!editMode" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-medium text-[#222] mb-0.5 text-left">Position</label>
            <input class="border-[1.5px_solid_#cbd5e1] rounded-md py-2 px-3 w-75 text-base bg-white text-black transition-[border_0.2s]" type="text" v-model="position" :disabled="!editMode" />
          </div>
          <div class="flex gap-4 mt-2.5">
            <button class="bg-[#ef4444] text-white hover:brightness-95 rounded-md py-2.5 px-5.5 text-base font-semibold cursor-pointer transition-colors duration-180" type="submit">{{ editMode ? 'Update' : 'Edit Info' }}</button>
            <button v-if="editMode" class="bg-[#64748b] text-white hover:brightness-95 rounded-md py-2.5 px-5.5 text-base font-semibold cursor-pointer transition-colors duration-180" 
             type="button" @click="onCancelEdit">Cancel</button>
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
import Navbar from '../../components/NavBarComponent/Navbar.vue';

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

function onCancelEdit() {
  editMode.value = false;
}

function changePassword() {
  alert('Change password clicked!');
}
</script>
