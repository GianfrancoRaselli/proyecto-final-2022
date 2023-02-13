import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/Home'),
  },
  {
    name: 'CreateFund',
    path: '/crearFondo',
    component: () => import('@/views/CreateFund'),
  },
  {
    name: 'Funds',
    path: '/fondos',
    component: () => import('@/views/Funds'),
  },
  {
    name: 'Fund',
    path: '/fondo/:fundAddress',
    component: () => import('@/views/Fund'),
  },
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes,
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = 'smooth';
    return scroll;
  },
});

router.beforeEach((to) => {
  if (to.meta.connected && !store.getters.isConnected) {
    return { name: 'Home' };
  }
});

export default router;
