<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">Task-Manager</div>
      <ul class="navbar-links">
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/tasks">My Tasks</router-link></li>
        <li><router-link to="/categories">Task Categories</router-link></li>
        <li><router-link to="/stickynotes">Sticky Notes</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
        <li><a href="#" @click.prevent="handleLogout">Logout</a></li>
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

<style scoped>
.navbar {
  width: 80vw;
  left: 0;
  top: 0;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  position: sticky;
  z-index: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
.navbar-container {
  width: 90vw;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 64px;
  box-sizing: border-box;
}
.navbar-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
}
.navbar-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar-links li a, .navbar-links li .router-link-active {
  text-decoration: none;
  color: #444;
  font-weight: 500;
  font-size: 1.08rem;
  transition: color 0.2s;
}
.navbar-links li a:hover, .navbar-links li .router-link-active {
  color: #ef4444;
}
</style>
