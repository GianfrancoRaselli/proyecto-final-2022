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
    <img style="display: none" src="@/assets/imgs/fundtoken.png" />
  </div>
</template>

<script>
import TheNavbar from '@/components/navbar/TheNavbar';
import TheMobileNavbar from '@/components/navbar/TheMobileNavbar';
import WalletModal from '@/components/modals/WalletModal';
import BuyFundTokensModal from '@/components/modals/BuyFundTokensModal';
import TheFooter from '@/components/TheFooter';

import { connectToMetamask } from '@/helpers/connection';

export default {
  name: 'App',
  components: {
    TheNavbar,
    TheMobileNavbar,
    WalletModal,
    BuyFundTokensModal,
    TheFooter,
  },
  computed: {},
  watch: {},
  created() {
    connectToMetamask();
  },
};
</script>

<style lang="scss">
@import '~bootstrap/dist/css/bootstrap.min.css';
@import 'animate.css';

* {
  box-sizing: border-box;
}

html {
  font-size: 82%;
}

body {
  font-family: 'Roboto', monospace;
  padding-right: 0 !important;

  --navbar-height: 66px;
  --mobile-navbar-height: 60px;
  --footer-height: 60px;
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
  min-height: calc(100vh - var(--mobile-navbar-height));
  margin-bottom: var(--mobile-navbar-height);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

@media (min-width: 768px) {
  html {
    font-size: 100%;
  }

  .header__mobile-navbar {
    display: none;
  }

  .page-content {
    min-height: 100vh;
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
  padding: 15px 25px 20px 25px;
}

@media (max-width: 600px) {
  .main__page {
    padding: 15px 15px 20px 15px;
  }
}

.page-content__footer {
  min-height: var(--footer-height);
  height: var(--footer-height);
  width: 100%;
  justify-self: flex-end;
  z-index: 100;
}

/* animation styles */

.slide-leave-to {
  opacity: 0.5;
  transform: translateX(-100%);
}

.slide-leave-active {
  transition: opacity 0.7s, transform 0.7s;
}

/* common styles */

.text-bold {
  font-weight: bold;
}

.text-underline {
  text-decoration: underline;
}

.text-center {
  text-align: center;
}

.purple {
  color: #7645d9;
}

.light {
  color: #1bbac5;
}

.red {
  color: #e74a9b;
}

.grey {
  color: rgb(79, 79, 79);
}

.form-group {
  label {
    color: rgba(22, 22, 22, 0.922);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .extra-info {
      font-size: 0.8rem;
      color: rgba(58, 58, 58, 0.816);
    }
  }

  .custom-switch {
    user-select: none;
  }
}

.btn-link {
  padding: 0;
}
</style>
