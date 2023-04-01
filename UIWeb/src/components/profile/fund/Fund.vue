<template>
  <div>
    <div class="fund" @click="redirect">
      <img class="img" :src="serverUrl + 'images/' + fund.image" v-if="fund.image" />
      <img class="img" src="@/assets/imgs/background-lg.jpg" v-else />
      <div class="content">
        <div class="top-line">
          <AppDate class="created-at" :date="createdAt" />
          <span class="name" v-text="fund.name"></span>
          <span class="type" v-text="type"></span>
        </div>
        <div class="description mt-2" v-text="fund.description" v-if="fund.description"></div>
        <div class="bottom-line mt-2">
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
            <FaIcon icon="person" class="icon" :class="{ 'icon-managers-hover': mouseOverManagers }" /><span
              class="amount"
              v-text="fund.managers.length"
            ></span>
          </div>
          <div
            class="icon-container"
            :class="{ 'icon-container-contributors-hover': mouseOverContributors }"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Contribuyentes"
            @click="contributorsClick"
            @mouseover="mouseOverContributors = true"
            @mouseleave="mouseOverContributors = false"
          >
            <FaIcon icon="receipt" class="icon" :class="{ 'icon-contributors-hover': mouseOverContributors }" /><span
              class="amount"
              v-text="fund.contributors.length"
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
            <FaIcon
              icon="circle-dollar-to-slot"
              class="icon"
              :class="{ 'icon-contributions-hover': mouseOverContributions }"
            /><span
              class="amount"
              v-text="amountOfContributions"
              v-if="amountOfContributions || amountOfContributions === 0"
            ></span>
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
            <FaIcon icon="money-bill-transfer" class="icon" :class="{ 'icon-transfers-hover': mouseOverTransfers }" /><span
              class="amount"
              v-text="amountOfTransfers"
              v-if="amountOfTransfers || amountOfTransfers === 0"
            ></span>
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
            <FaIcon icon="list-check" class="icon" :class="{ 'icon-requests-hover': mouseOverRequests }" /><span
              class="amount"
              v-text="amountOfRequests"
              v-if="amountOfRequests || amountOfRequests === 0"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <ManagersModal :fundAddress="fund.address" :managers="fund.managers" />
    <ContributorsModal :fund="fund" />
    <ContributionsModal :fundAddress="fund.address" @contributions="(amount) => (amountOfContributions = amount)" />
    <TransfersModal :fundAddress="fund.address" @transfers="(amount) => (amountOfTransfers = amount)" />
    <RequestsModal :fundAddress="fund.address" :fund="fund" @requests="(amount) => (amountOfRequests = amount)" />
  </div>
</template>

<script>
import $ from 'jquery';
import { serverUrl } from '@/siteConfig';
import { fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

// modals
import ManagersModal from '@/components/profile/fund/modals/ManagersModal';
import ContributorsModal from '@/components/modals/fund/ContributorsModal.vue';
import ContributionsModal from '@/components/profile/fund/modals/ContributionsModal';
import TransfersModal from '@/components/profile/fund/modals/TransfersModal';
import RequestsModal from '@/components/profile/fund/modals/RequestsModal';

export default {
  name: 'ProfileFundComponent',
  components: {
    ManagersModal,
    ContributorsModal,
    ContributionsModal,
    TransfersModal,
    RequestsModal,
  },
  props: {
    fund: { type: Object, required: true },
  },
  data() {
    return {
      serverUrl,
      canRedirect: true,
      mouseOverManagers: false,
      mouseOverContributors: false,
      mouseOverContributions: false,
      mouseOverTransfers: false,
      mouseOverRequests: false,
      amountOfContributions: null,
      amountOfTransfers: null,
      amountOfRequests: null,
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

    contributorsClick() {
      this.canRedirect = false;
      $('#contributorsModal' + this.fund.address).modal('show');
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
  padding: 0.65rem 0.55rem;
  border: 1px solid rgb(238, 238, 238);
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  gap: 1rem;

  .img {
    height: 4rem;
    width: 4rem;
    border-radius: 4rem;

    @media (max-width: 400px) {
      height: 3.6rem;
      width: 3.6rem;
      border-radius: 3.6rem;
    }
  }

  .content {
    .top-line {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;

      .created-at {
        font-size: 0.8rem;
      }

      .name {
        font-size: 1.2rem;
        font-weight: bold;
        word-wrap: break-word;
        word-break: break-word;
      }

      .type {
        font-size: 0.9rem;
      }
    }

    .description {
      word-wrap: break-word;
      word-break: break-word;
    }

    .bottom-line {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.6rem;

      @media (max-width: 500px) {
        gap: 0.7rem;
      }

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

      .icon-container-contributors-hover {
        color: rgb(196, 16, 196);

        .icon-contributors-hover {
          background-color: rgba(212, 18, 212, 0.1);
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
