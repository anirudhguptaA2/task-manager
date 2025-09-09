<template>
  <div class="signup-bg">
    <div class="signup-main">
      <div class="signup-left">
  <img src="@/assets/signup.svg" alt="Signup Illustration" class="signup-illustration" />
      </div>
      <div class="signup-right">
        <h2>Sign Up</h2>
        <form @submit.prevent="handleSignup">
          <div class="input-row">
            <span class="icon"><img src="@/assets/firstName.svg" alt="First Name Icon" width="20" height="20" /></span>
            <input v-model="firstName" type="text" placeholder="Enter First Name" required />
          </div>
          <div class="input-row">
            <span class="icon"><img src="@/assets/lastName.svg" alt="Last Name Icon" width="20" height="20" /></span>
            <input v-model="lastName" type="text" placeholder="Enter Last Name" required />
          </div>
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
          <div class="input-row">
            <span class="icon"><img src="@/assets/confirmPassword.svg" alt="Confirm Password Icon" width="20" height="20" /></span>
            <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Confirm Password" required />
          </div>
          <div class="signup-options">
            <label class="terms">
              <input type="checkbox" v-model="agreeTerms" /> I agree to all terms
            </label>
          </div>
          <button class="signup-btn" type="submit" :disabled="loading">
            <span v-if="loading">Registering...</span>
            <span v-else>Register</span>
          </button>
        </form>
        <div class="login-link">
          Already have an account? <router-link to="/login" class="login">Sign In</router-link>
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

<style scoped>
h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}
.input-group {
  display: flex;
  align-items: center;
  background: #f2f3f7;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
}
.input-group .icon {
  margin-right: 0.5rem;
}
.input-group input {
  border: none;
  background: transparent;
  color: black;
  flex: 1;
  font-size: 1rem;
  outline: none;
}
.input-group .toggle {
  cursor: pointer;
  margin-left: 0.5rem;
}
.signup-btn {
  background: #f06292;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1.1rem;
  width: 100%;
  margin-bottom: 1rem;
  cursor: pointer;
}
/* Background and layout */
.signup-bg {
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
.signup-main {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  display: flex;
  max-width: 900px;
  width: 100%;
  min-height: 50%;
  overflow: hidden;
}
.signup-left {
  flex: 1;
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.signup-right {
  flex: 1;
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.signup-illustration {
  max-width: 70%;
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
.signup-options {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
}
.terms {
  font-size: 1rem;
  color: #222;
  display: flex;
  align-items: center;
}
.signup-btn {
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
.signup-btn:hover {
  background: #e0487b;
}
/* Login link */
.login-link {
  font-size: 1rem;
  margin-top: 0.5rem;
}
.login {
  color: #1976d2;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.2rem;
}
</style>
