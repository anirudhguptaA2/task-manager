<template>
  <nav class="w-[100vw] left-0 top-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] sticky z-0 h-16 flex items-center justify-center m-0 p-0 overflow-x-hidden">
    <div class="w-[90vw] max-w-300 m-[0_auto] flex items-center justify-between px-10 h-16 box-border">
      <div class="text-2xl font-bold text-[#ef4444]">Task-Manager</div>
      <ul class="flex gap-8 list-none m-0 p-0">
        <li class="text-[#444] font-medium text-base transition-colors duration-200 hover:text-[#ef4444]"><router-link to="/dashboard">Dashboard</router-link></li>
        <li class="text-[#444] font-medium text-base transition-colors duration-200 hover:text-[#ef4444]"><router-link to="/tasks">My Tasks</router-link></li>
        <li class="text-[#444] font-medium text-base transition-colors duration-200 hover:text-[#ef4444]"><router-link to="/categories">Task Categories</router-link></li>
        <li class="text-[#444] font-medium text-base transition-colors duration-200 hover:text-[#ef4444]"><router-link to="/stickynotes">Sticky Notes</router-link></li>
        <li class="text-[#444] font-medium text-base transition-colors duration-200 hover:text-[#ef4444]"><router-link to="/profile">Profile</router-link></li>
        <li class="text-[#444] font-medium text-base transition-colors duration-200 hover:text-[#ef4444]"><a href="#" @click.prevent="handleLogout">Logout</a></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { auth } from '../../infrastructure/firebase';
import { signOut } from 'firebase/auth';

const router = useRouter();
const handleLogout = async () => {
  await signOut(auth);
  router.push('/login');
};
</script>
