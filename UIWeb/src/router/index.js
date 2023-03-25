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
    name: 'AboutUs',
    path: '/nosotros',
    component: () => import('@/views/AboutUs'),
  },
  {
    name: 'FrequentQuestions',
    path: '/preguntasFrecuentes',
    component: () => import('@/views/FrequentQuestions'),
  },
  {
    name: 'Profile',
    path: '/perfil/:address',
    component: () => import('@/views/Profile'),
  },
  {
    name: 'FundFactory',
    path: '/fundFactory',
    component: () => import('@/views/FundFactory'),
    meta: {
      isTheDeployer: true,
    },
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
  scrollBehavior(/*to*/) {
    const scroll = {
      top: 0,
    };
    // if (to.hash) {
    //   scroll.el = to.hash;
    //   scroll.behavior = 'smooth';
    // }
    return scroll;
  },
});

router.beforeEach((to) => {
  if (to.meta.isTheDeployer && !store.state.connection.isTheDeployer) {
    return { name: 'Home' };
  }
});

export default router;
