<template>
  <div>
    <div class="fund" @click="redirect">
      <img class="img" :src="serverUrl + 'images/' + fund.image" v-if="fund.image" />
      <img class="img" src="@/assets/imgs/fund.png" v-else />
      <div class="content">
        <div class="top-line">
          <span class="header">
            <span class="name" v-text="fund.name"></span>
            <fa-icon icon="circle" class="icon" />
            <span class="type" v-text="type"></span>
          </span>
          <AppDate class="createdAt" :date="createdAt" />
        </div>
        <div class="description" v-text="fund.description"></div>
        <div class="bottom-line">
          <div
            class="icon-container"
            :class="{ 'icon-container-managers-hover': mouseOverManagers }"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Administradores"
            @click="managersClick"
            @mouseover="mouseOverManagers = true"
            @mouseleave="mouseOverManagers = false"
          >
            <fa-icon icon="person" class="icon" :class="{ 'icon-managers-hover': mouseOverManagers }" /><span
              class="amount"
              v-text="fund.managers.length"
            ></span>
          </div>
          <div
            class="icon-container"
            :class="{ 'icon-container-contributions-hover': mouseOverContributions }"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Contribuciones"
            @click="contributionsClick"
            @mouseover="mouseOverContributions = true"
            @mouseleave="mouseOverContributions = false"
          >
            <fa-icon
              icon="circle-dollar-to-slot"
              class="icon"
              :class="{ 'icon-contributions-hover': mouseOverContributions }"
            /><span class="amount">5</span>
          </div>
          <div
            class="icon-container"
            :class="{ 'icon-container-transfers-hover': mouseOverTransfers }"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Transferencias"
            @click="transfersClick"
            @mouseover="mouseOverTransfers = true"
            @mouseleave="mouseOverTransfers = false"
          >
            <fa-icon icon="money-bill-transfer" class="icon" :class="{ 'icon-transfers-hover': mouseOverTransfers }" /><span
              class="amount"
              >5</span
            >
          </div>
          <div
            class="icon-container"
            :class="{ 'icon-container-requests-hover': mouseOverRequests }"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Solicitudes"
            @click="requestsClick"
            @mouseover="mouseOverRequests = true"
            @mouseleave="mouseOverRequests = false"
          >
            <fa-icon icon="list-check" class="icon" :class="{ 'icon-requests-hover': mouseOverRequests }" /><span class="amount"
              >5</span
            >
          </div>
        </div>
      </div>
    </div>
    <ManagersModal :id="fund.address" :managers="fund.managers" />
  </div>
</template>

<script>
import $ from 'jquery';
import { serverUrl } from '@/siteConfig';
import { fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

// modals
import ManagersModal from '@/components/profile/fund/modals/ManagersModal';

export default {
  name: 'ProfileFundComponent',
  components: {
    ManagersModal,
  },
  props: {
    fund: { type: Object, required: true },
  },
  data() {
    return {
      serverUrl,
      canRedirect: true,
      mouseOverManagers: false,
      mouseOverContributions: false,
      mouseOverTransfers: false,
      mouseOverRequests: false,
    };
  },
  computed: {
    type() {
      if (
        this.fund.managersCanBeAddedOrRemoved &&
        this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        !this.fund.onlyManagersCanCreateARequest &&
        !this.fund.onlyContributorsCanApproveARequest
      )
        return 'Fondo de amigos';
      if (
        !this.fund.managersCanBeAddedOrRemoved &&
        !this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        this.fund.onlyManagersCanCreateARequest &&
        this.fund.onlyContributorsCanApproveARequest
      )
        return 'Fondo de campaña';
      if (
        this.fund.managersCanBeAddedOrRemoved &&
        this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        this.fund.onlyManagersCanCreateARequest &&
        this.fund.onlyContributorsCanApproveARequest
      )
        return 'Fondo de donación';
      return 'Fondo personalizado';
    },

    createdAt() {
      return fromUnixTimestampToDate(this.fund.createdAt);
    },
  },
  methods: {
    redirect() {
      if (this.canRedirect) this.$router.push({ name: 'Fund', params: { fundAddress: this.fund.address } });
      this.canRedirect = true;
    },

    managersClick() {
      this.canRedirect = false;
      $('#profileManagersModal' + this.fund.address).modal('show');
    },

    contributionsClick() {
      this.canRedirect = false;
      $('#profileContributionsModal' + this.fund.address).modal('show');
    },

    transfersClick() {
      this.canRedirect = false;
      $('#profileTransfersModal' + this.fund.address).modal('show');
    },

    requestsClick() {
      this.canRedirect = false;
      $('#profileRequestsModal' + this.fund.address).modal('show');
    },
  },
  created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  },
  mounted() {},
  unmounted() {},
};
</script>

<style lang="scss" scoped>
.fund {
  padding: 0.6rem;
  border: 1px solid rgb(238, 238, 238);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  gap: 1rem;

  .img {
    height: 4rem;
    width: 4rem;
    border-radius: 4rem;
  }

  .content {
    word-wrap: break-word;
    word-break: break-all;
    width: 100%;

    .top-line {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;

      .header {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.4rem;

        .name {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .icon {
          height: 0.2rem;
          width: 0.2rem;
          color: rgb(97, 97, 97);
        }

        .type {
          font-size: 0.88rem;
        }
      }

      .createdAt {
        font-size: 0.92rem;
        min-width: fit-content;
      }
    }

    .description {
      padding: 0.4rem 0;
    }

    .bottom-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1.6rem;

      .icon-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 0.3rem;

        .icon {
          height: 1.05rem;
          width: 1.05rem;
          padding: 0.5rem;
          border-radius: 100%;
        }
      }

      .icon-container-managers-hover {
        color: rgb(57, 57, 221);

        .icon-managers-hover {
          background-color: rgba(0, 0, 255, 0.1);
        }
      }

      .icon-container-contributions-hover {
        color: rgb(45, 151, 45);

        .icon-contributions-hover {
          background-color: rgba(0, 128, 0, 0.1);
        }
      }

      .icon-container-transfers-hover {
        color: rgb(209, 41, 41);

        .icon-transfers-hover {
          background-color: rgba(255, 0, 0, 0.1);
        }
      }

      .icon-container-requests-hover {
        color: orange;

        .icon-requests-hover {
          background-color: rgba(255, 166, 0, 0.1);
        }
      }
    }
  }
}

.fund:hover {
  cursor: pointer;
  background-color: rgb(248, 248, 248);
}
</style>
