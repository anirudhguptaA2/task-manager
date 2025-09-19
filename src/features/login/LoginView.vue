<template>
  <div class="bg-red-400 top-0 left-0 h-screen w-screen flex items-center justify-center bg-[url(@/assets/background.svg)]">
    <div class="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex max-w-900px w-100% min-h-[500px] overflow-hidden">
      <div class="flex-1 p-12 flex flex-col justify-center">
        <h2 class="font-bold text-4xl mb-6 text-left">Sign In</h2>
        <form @submit.prevent="handleLogin">
          <div class="flex items-center bg-white border border-stone-400 rounded-lg mb-4 py-2 px-4">
            <span class="mr-2"><img src="@/assets/mail.svg" alt="Mail Icon" width="20" height="20" /></span>
            <input class="border-none bg-transparent text-stone-800 flex-1 text-lg py-0.5 px-0 outline-0" v-model="email" type="email" placeholder="Enter Email" required />
          </div>
          <div class="flex items-center bg-white border border-stone-400 rounded-lg mb-4 py-2 px-4">
            <span class="mr-2"><img src="@/assets/password.svg" alt="Password Icon" width="20" height="20" /></span>
            <input class="border-none bg-transparent text-stone-800 flex-1 text-lg py-0.5 px-0 outline-0" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter Password" required />
            <span class="cursor-pointer ml-0.5" @click="showPassword = !showPassword">
              <img v-if="showPassword" src="@/assets/eye.svg" alt="Show Password" class="w-5 h-5" />
              <img v-else src="@/assets/eye-slash.svg" alt="Hide Password" class="w-5 h-5" />
            </span>
          </div>
          <div class="flex items-center mb-1">
            <label class="font-normal text-stone-700 flex text-center p-1">
              <input type="checkbox" v-model="rememberMe" class="mr-2" /> Remember Me
            </label>
          </div>
          <button class="bg-[#ff6f6f] text-white hover:bg-red-800 font-bold border-none rounded-md py-3 px-0 text-[1.1rem] w-full mb-6 cursor-pointer transition-colors duration-200" type="submit">Login</button>
        </form>
        <div class="text-[1rem] mt-2">
          Don't have an account? <router-link to="/signup" class="text-[#1976d2] font-semibold text-left decoration-0">Create One</router-link>
        </div>
      </div>
      <div class="flex-1 bg-transparent flex items-center justify-center">
        <img src="@/assets/login.svg" alt="Login Illustration" class="max-w-[90%] h-auto" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../../infrastructure/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const email = ref('test1@gmail.com');
const password = ref('test1234');
const showPassword = ref(false);
const rememberMe = ref(false);

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    alert(error.message);
  }
};

import { useRouter } from 'vue-router';
const router = useRouter();

const handleLogout = async () => {
  await signOut(auth);
  // Redirect or show logout message
};

</script>
