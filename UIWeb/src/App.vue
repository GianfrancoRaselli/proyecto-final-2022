<template>
  <div>
    <header class="header">
      <TheNavbar class="header__navbar" />
      <TheMobileNavbar class="header__mobile-navbar" />
      <WalletModal />
      <BuyFundTokensModal />
    </header>
    <div class="page-content">
      <main class="page-content__main">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.params.animation || ''" mode="out-in">
            <component class="main__page" :is="Component" :key="`${route.path}${JSON.stringify(route.query)}`" />
          </transition>
        </router-view>
        <AppNotifications />
      </main>
      <TheFooter class="page-content__footer" />
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/navbar/TheNavbar';
import TheMobileNavbar from '@/components/navbar/TheMobileNavbar';
import WalletModal from '@/components/modals/WalletModal';
import BuyFundTokensModal from '@/components/modals/BuyFundTokensModal';
import AppNotifications from '@/components/global/AppNotifications';
import TheFooter from '@/components/TheFooter';

import { connectToMetamask } from '@/helpers/connection';

export default {
  name: 'App',
  components: {
    TheNavbar,
    TheMobileNavbar,
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

  --navbar-height: 65px;
  --mobile-navbar-height: 60px;
}

.header {
  user-select: none;
}

.header__navbar {
  height: var(--navbar-height);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
}

.header__mobile-navbar {
  height: var(--mobile-navbar-height);
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 101;
}

.page-content {
  min-height: 100vh;
  margin-bottom: var(--mobile-navbar-height);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .header__mobile-navbar {
    display: none;
  }

  .page-content {
    margin-bottom: 0;
  }
}

.page-content__main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main__page {
  width: 100%;
  max-width: 1200px;
  margin-top: var(--navbar-height);
  padding: 15px 20px 12px 20px;
}

.page-content__footer {
  min-height: 60px;
  height: 60px;
  width: 100%;
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
