import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import { call } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';

const routes = [
  {
    name: 'Home',
    path: '/inicio',
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
  linkActiveClass: 'nav-link-active',
  routes,
  scrollBehavior(to, from) {
    const scroll = {};
    if (to.fullPath !== from.fullPath) scroll.top = 0;
    // if (to.hash) {
    //   scroll.el = to.hash;
    //   scroll.behavior = 'smooth';
    // }
    return scroll;
  },
});

router.beforeEach(async (to) => {
  const deployer = await call('FundFactory', 'owner', [], {});
  if (to.meta.isTheDeployer && !compareAddresses(deployer, store.getters.address)) {
    return { name: 'Home' };
  }
});

export default router;
