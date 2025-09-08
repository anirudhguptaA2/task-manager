import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../features/login/LoginView.vue';

import SignupView from '../features/signup/SignupView.vue';
import DashboardView from '../features/dashboard/DashboardView.vue';
import MyTasksView from '../features/tasks/MyTasksView.vue';
import TaskCategoriesView from '../features/categories/TaskCategoriesView.vue';
import ProfileView from '../features/profile/ProfileView.vue';
import AddCategoryView from '../features/categories/AddCategoryView.vue';
import AddTaskView from '../features/tasks/AddTaskView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/tasks/add',
    name: 'AddTask',
    component: AddTaskView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    // meta: { requiresAuth: true },
  },
  {
    path: '/tasks',
    name: 'MyTasks',
    component: MyTasksView,
    meta: { requiresAuth: true },
  },
  {
    path: '/categories',
    name: 'TaskCategories',
    component: TaskCategoriesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/categories/add',
    name: 'AddCategory',
    component: AddCategoryView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Simple auth check using Firebase
import { auth } from '../infrastructure/firebase';

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const user = auth.currentUser;
  if (requiresAuth && !user) {
    next('/login');
  } else {
    next();
  }
});

export default router;
