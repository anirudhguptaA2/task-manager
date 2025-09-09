<template>
  <div class="login-bg">
    <div class="login-main">
      <div class="login-left">
        <h2>Sign In</h2>
        <form @submit.prevent="handleLogin">
          <div class="input-row">
            <span class="icon"><img src="@/assets/mail.svg" alt="Mail Icon" width="20" height="20" /></span>
            <input v-model="email" type="email" placeholder="Enter Email" required />
          </div>
          <div class="input-row">
            <span class="icon"><img src="@/assets/password.svg" alt="Password Icon" width="20" height="20" /></span>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter Password" required />
            <span class="toggle" @click="showPassword = !showPassword">
              <img v-if="showPassword" src="@/assets/eye.svg" alt="Show Password" width="20" height="20" />
              <img v-else src="@/assets/eye-slash.svg" alt="Hide Password" width="20" height="20" />
            </span>
          </div>
          <div class="login-options">
            <label class="remember">
              <input type="checkbox" v-model="rememberMe" /> Remember Me
            </label>
          </div>
          <button class="login-btn" type="submit">Login</button>
        </form>
        <div class="signup-link">
          Don't have an account? <router-link to="/signup" class="signup">Create One</router-link>
        </div>
      </div>
      <div class="login-right">
  <img src="@/assets/login.svg" alt="Login Illustration" class="login-illustration" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../../infrastructure/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const email = ref('');
const password = ref('');
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

<style scoped>
/* Background and layout */
.login-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #ff6f6f;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/background.svg');
  z-index: 0;
}
.login-main {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  display: flex;
  max-width: 900px;
  width: 100%;
  min-height: 500px;
  overflow: hidden;
}
.login-left {
  flex: 1;
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login-right {
  flex: 1;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-illustration {
  max-width: 90%;
  height: auto;
}
/* Typography */
h2 {
  font-size: 2.2rem;
  margin-bottom: 2rem;
  font-weight: 700;
  text-align: left;
}
/* Input styles */
.input-row {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid #d3d3d3;
  border-radius: 8px;
  margin-bottom: 1.2rem;
  padding: 0.5rem 1rem;
}
.input-row .icon {
  margin-right: 0.7rem;
}
.input-row input {
  border: none;
  background: transparent;
  color: #222;
  flex: 1;
  font-size: 1.08rem;
  outline: none;
  padding: 0.2rem 0;
}
.input-row .toggle {
  cursor: pointer;
  margin-left: 0.5rem;
}
/* Options and actions */
.login-options {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
}
.remember {
  font-size: 1rem;
  color: #222;
  display: flex;
  align-items: center;
}
.login-btn {
  background: #ff6f6f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  width: 100%;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.login-btn:hover {
  background: #e0487b;
}
/* Social login */
.social-login {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
  font-size: 1rem;
}
.social-icon {
  width: 28px;
  height: 28px;
  cursor: pointer;
  border-radius: 4px;
  background: #f2f3f7;
  padding: 2px;
}
/* Signup link */
.signup-link {
  font-size: 1rem;
  margin-top: 0.5rem;
}
.signup {
  color: #1976d2;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.2rem;
}
</style>
