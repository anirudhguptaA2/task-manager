<template>
  <div class="fixed top-0 left-0 w-screen h-screen min-h-screen bg-[#ff6f6f] flex items-center justify-center bg-[url('@/assets/background.svg')] z-0">
    <div class="bg-white p-8 rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] max-w-4xl w-full h-170 flex overflow-hidden">
      <div class="flex py-12 px-10 max-w-900px w-100% min-h-[500px] overflow-hidden">
        <img src="@/assets/signup.svg" alt="Signup Illustration" class="max-w-70 h-auto" />
      </div>
      <div class="flex py-12 px-10 flex-1 flex-col justify-center">
        <h2 class="text-2xl font-bold mb-6 text-left">Sign Up</h2>
        <form @submit.prevent="handleSignup">
          <div class="flex items-center bg-white border border-gray-300 rounded-lg mb-4 py-2 px-4">
            <span class="mr-3"><img src="@/assets/firstName.svg" alt="First Name Icon" width="20" height="20" /></span>
            <input class="border-none bg-transparent text-black flex-1 text-lg outline-none py-1 px-0" v-model="firstName" type="text" placeholder="Enter First Name" required />
          </div>
          <div class="flex items-center bg-white border border-gray-300 rounded-lg mb-4 py-2 px-4">
            <span class="mr-3"><img src="@/assets/lastName.svg" alt="Last Name Icon" width="20" height="20" /></span>
            <input class="border-none bg-transparent text-black flex-1 text-lg outline-none py-1 px-0" v-model="lastName" type="text" placeholder="Enter Last Name" required />
          </div>
          <div class="flex items-center bg-white border border-gray-300 rounded-lg mb-4 py-2 px-4">
            <span class="mr-3"><img src="@/assets/mail.svg" alt="Mail Icon" width="20" height="20" /></span>
            <input class="border-none bg-transparent text-black flex-1 text-lg outline-none py-1 px-0" v-model="email" type="email" placeholder="Enter Email" required />
          </div>
          <div class="flex items-center bg-white border border-gray-300 rounded-lg mb-4 py-2 px-4">
            <span class="mr-3"><img src="@/assets/password.svg" alt="Password Icon" width="20" height="20" /></span>
            <input class="border-none bg-transparent text-black flex-1 text-lg outline-none py-1 px-0" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter Password" required />
            <span class="cursor-pointer ml-2" @click="showPassword = !showPassword">
              <img v-if="showPassword" src="@/assets/eye.svg" alt="Show Password" width="20" height="20" />
              <img v-else src="@/assets/eye-slash.svg" alt="Hide Password" width="20" height="20" />
            </span>
          </div>
          <div class="flex items-center bg-white border border-gray-300 rounded-lg mb-4 py-2 px-4">
            <span class="mr-3"><img src="@/assets/confirmPassword.svg" alt="Confirm Password Icon" width="20" height="20" /></span>
            <input class="border-none bg-transparent text-black flex-1 text-lg outline-none py-1 px-0" v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Confirm Password" required />
          </div>
          <div class="flex items-center mb-4">
            <label class="flex items-center text-lg text-stone-500">
              <input class="border-none bg-transparent text-black flex-1 text-lg outline-none py-1 px-0 mr-2" type="checkbox" v-model="agreeTerms" /> I agree to all terms
            </label>
          </div>
          <button class="bg-[#ff6f6f] hover:bg-red-800 text-white border-none rounded-lg py-3 px-0 text-xl w-full mb-4 cursor-pointer transition-colors duration-200" type="submit" :disabled="loading">
            <span v-if="loading">Registering...</span>
            <span v-else>Register</span>
          </button>
        </form>
        <div class="text-lg mt-2">
          Already have an account? <router-link to="/login" class=" text-blue-600 font-semibold no-underline ml-1">Sign In</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../../infrastructure/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const agreeTerms = ref(false);
const loading = ref(false);

const handleSignup = async () => {
  if (!agreeTerms.value) {
    alert('You must agree to all terms.');
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.');
    return;
  }
  loading.value = true;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await updateProfile(userCredential.user, {
      displayName: `${firstName.value} ${lastName.value}`
    });
    alert('Registration successful!');
    // Redirect to login or home page
    router.push('/login');
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};
</script>
