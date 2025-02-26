import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Chat from '../views/Chat.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/chat', component: Chat, props: (router) => ({ agentId: Number(router.query.agentId) }) }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;