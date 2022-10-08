<template>
  <div class="page-content">
    <header class="page-content__header">
      <TheNavbar class="header__navbar" />
      <WalletModal />
      <BuyFundTokensModal />
    </header>
    <main class="page-content__main">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.params.animation || ''" mode="out-in">
          <component :is="Component" :key="`${route.path}${JSON.stringify(route.query)}`" />
        </transition>
      </router-view>
      <AppNotifications />
    </main>
    <TheFooter class="page-content__footer" />
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar';
import WalletModal from '@/components/modals/WalletModal';
import BuyFundTokensModal from '@/components/modals/BuyFundTokensModal';
import AppNotifications from '@/components/global/AppNotifications';
import TheFooter from '@/components/TheFooter';

import { connectToMetamask } from '@/helpers/connection';

export default {
  name: 'App',
  components: {
    TheNavbar,
    WalletModal,
    BuyFundTokensModal,
    AppNotifications,
    TheFooter,
  },
  computed: {},
  watch: {},
  created() {
    connectToMetamask();
  },
};
</script>

<style>
@import '~bootstrap/dist/css/bootstrap.min.css';

* {
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', monospace;
  margin: 0;
}

.page-content {
  min-width: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.page-content__header {
  user-select: none;
}

.header__navbar {
  height: 65px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
}

.page-content__main {
  width: 100%;
  flex-basis: 100%;
  max-width: 1000px;
  margin: auto;
  padding: 80px 12px 15px 12px;
}

.page-content__footer {
  min-height: 60px;
  height: 60px;
  width: 100%;
  bottom: 0;
  justify-self: flex-end;
}

.slide-leave-to {
  opacity: 0.5;
  transform: translateX(-100%);
}

.slide-leave-active {
  transition: opacity 0.7s, transform 0.7s;
}

.text-bold {
  font-weight: bold;
}

.text-underline {
  text-decoration: underline;
}

.text-center {
  text-align: center;
}

.form-control-error {
  border: 2px solid red;
}
</style>
