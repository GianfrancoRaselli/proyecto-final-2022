<template>
  <div class="page-content">
    <header class="page-content__header">
      <TheNavbar class="header__navbar" />
      <WalletModal />
      <BuyFundTokensModal />
    </header>
    <main class="page-content__main">
      <router-view :key="`${$route.path}${JSON.stringify($route.query)}`" />
      <AppNotifications />
    </main>
    <footer class="page-content__footer"></footer>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar';
import WalletModal from '@/components/modals/WalletModal';
import BuyFundTokensModal from '@/components/modals/BuyFundTokensModal';
import AppNotifications from '@/components/global/AppNotifications';

import { connectToMetamask } from '@/helpers/connection';

export default {
  name: 'App',
  components: {
    TheNavbar,
    WalletModal,
    BuyFundTokensModal,
    AppNotifications,
  },
  computed: {},
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
  min-width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.page-content__header {
  user-select: none;
}

.header__navbar {
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
  padding: 70px 12px 10px 12px;
}

.text-bold {
  font-weight: bold;
}

.text-underline {
  text-decoration: underline;
}

.form-control-error {
  border: 2px solid red;
}
</style>
