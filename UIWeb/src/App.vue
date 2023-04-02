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
  created() {
    connectToMetamask();
  },
};
</script>

<style lang="scss" scoped>
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
</style>

<style lang="scss">
@import '~bootstrap/dist/css/bootstrap.min.css';
@import 'animate.css';
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

* {
  box-sizing: border-box;
}

html {
  font-size: 76%;
}

@media (min-width: 768px) {
  html {
    font-size: 88%;
  }
}

body {
  font-family: 'Roboto', monospace;
  padding-right: 0 !important;

  --navbar-height: 66px;
  --mobile-navbar-height: 60px;
  --footer-height: 60px;
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

.btn-link:hover,
.btn-link:focus {
  outline: none !important;
  box-shadow: none !important;
}

.align-items-row {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
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
      color: grey;
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

  .router-link {
    color: black;
    display: block;
    height: 100%;
    width: 100%;
  }

  .router-link:hover {
    text-decoration: none;
  }

  .card {
    word-break: break-word;
    word-wrap: break-word;
    height: 99%;
    width: 99%;
    position: relative;

    .card-header {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .name:hover {
        white-space: normal;
      }
    }
  }

  .card:hover {
    cursor: pointer;
    height: 100%;
    width: 100%;
    box-shadow: 0 0 2px rgb(65, 65, 65);
  }
}

.fund-card-header {
  min-height: 3.66rem;
  padding-left: 7rem;
  padding-right: 7rem;

  .fund-badges {
    position: absolute;
    top: 0.1rem;
    right: 0.1rem;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: end;
    gap: 0.15rem;
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
        color: rgb(40, 40, 40);
        padding: 0 0.4rem;
        margin-top: 0.5rem;

        .number {
          font-size: 1.1em;
          font-weight: bold;
        }
      }
    }
  }
}

.items-container {
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;

  .item-container {
    min-height: 100%;
    padding: 0.5em;

    .item {
      height: 100%;
      width: 100%;
      padding: 1em;
      border: 1px solid rgb(145, 145, 145);
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      gap: 0.6em;

      .value {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;

        .amount {
          font-size: 1.6em;
          font-weight: bold;

          .btn:first-child {
            font-size: 1.6em;
            font-weight: bold;
          }
        }

        .unit {
          font-size: 0.95em;
          color: grey;
        }
      }
    }
  }
}

.extra-information {
  user-select: none;

  .extra-information-header {
    position: relative;
    margin-bottom: 0.6rem;

    .arrow {
      position: absolute;
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 2.5rem;
      color: white;
      background-color: rgb(100, 100, 100);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      @media only screen and (hover: none) and (pointer: coarse) {
        display: none !important;
      }
    }

    .arrow:hover {
      cursor: pointer;
      background-color: rgb(125, 125, 125);
    }

    .arrow-left {
      top: 50%;
      left: 0.5rem;
      transform: translateY(-50%);
    }

    .arrow-right {
      top: 50%;
      right: 0.5rem;
      transform: translateY(-50%);
    }

    .extra-information-header-container {
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: center;
      overflow: auto;

      .item {
        min-width: fit-content;
        padding: 0 1.2rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .span {
          display: block;
          font-size: 1.07rem;
          color: rgb(70, 70, 70);
          padding: 1rem 0;
        }

        .span-active {
          font-weight: bold;
          color: rgb(0, 0, 0);
          padding-bottom: 0.6rem;
        }

        .bar {
          display: none;
          background-color: rgb(29, 155, 240);
          height: 0.4rem;
          width: 100%;
          border-radius: 1rem;
        }

        .bar-active {
          display: block;
        }
      }

      .item:hover {
        cursor: pointer;
        background-color: rgb(235, 235, 235);
      }
    }

    .extra-information-header-container::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
