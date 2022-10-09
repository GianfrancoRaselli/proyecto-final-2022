import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home'),
  },
  {
    path: '/createFund',
    name: 'CreateFund',
    component: () => import('@/views/CreateFund'),
  },
  {
    path: '/fund/:fundAddress',
    name: 'Fund',
    component: () => import('@/views/Fund'),
  },
  {
    path: '/funds',
    name: 'Funds',
    component: () => import('@/views/Funds'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
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
