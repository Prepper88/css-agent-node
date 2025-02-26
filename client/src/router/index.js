import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Chat from '../views/Chat.vue';

const routes = [
  {
    path: '/login',
    component: Login,
  },
  { path: '/', redirect: '/login' },
  { 
    path: '/chat', 
    component: Chat, 
    props: (router) => ({ agentId: Number(router.query.agentId) }),
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router;