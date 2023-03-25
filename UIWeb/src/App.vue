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
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

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
    font-size: 95%;
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
  padding: calc(var(--navbar-height) + 15px) 25px 20px 25px;
}

@media (max-width: 600px) {
  .main__page {
    padding-left: 15px;
    padding-right: 15px;
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

.page-title {
  font-size: 1.8rem;
  font-weight: bold;
  font-family: 'Dancing Script', cursive;
  padding-right: 0.5rem;
  border-bottom: 0.1px solid rgb(160, 160, 160);
  border-right: 0.1px solid rgb(160, 160, 160);
  border-radius: 0 0 6px 0;
  display: inline-flex;
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

.date {
  font-size: 0.8rem;
}

.badge {
  font-size: 0.68rem;
  height: fit-content;
  min-width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.btn-link {
  padding: 0;
}

.hover:hover {
  cursor: pointer;
  text-decoration: underline;
}

.modal-body {
  .margin-bottom {
    margin-bottom: 0.8rem;
  }
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .modal-title {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: start;
    gap: 0.4rem;

    .modal-amount {
      font-size: 1rem;
      height: 1.3rem;
      width: 1.3rem;
      color: white;
      background-color: orange;
      border-radius: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .icon {
    cursor: pointer;
    color: grey;
  }
}

.card-container {
  min-height: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .card {
    word-wrap: break-word;
    word-break: break-word;
    height: 99%;
    width: 99%;
    position: relative;
  }

  .card:hover {
    cursor: pointer;
    height: 100%;
    width: 100%;
    box-shadow: 0 0 2px rgb(65, 65, 65);
  }
}

.profile-extra-information {
  .profile-extra-information-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .spinner {
      margin-top: 2rem;
    }

    .items {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .no-items {
        font-size: 1.2rem;
        text-align: center;
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 0.8rem;
      }

      .amount {
        font-size: 1rem;
        color: grey;
        padding: 0 0.3rem;
        margin-top: 0.5rem;

        .number {
          font-size: 1.1em;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
