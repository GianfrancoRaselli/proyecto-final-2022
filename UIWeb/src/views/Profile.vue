<template>
  <div>
    <p class="page-title">Perfil de la entidad</p>
    <div class="entity-card">
      <AppSpinner class="spinner" size="big" v-if="loadingEntity" />
      <div class="entity-card-content" v-else>
        <div class="img-center">
          <div class="img-container">
            <img class="not-found-img" src="@/assets/imgs/user-not-found.png" v-if="!entity" />
            <img class="profile-img magnify-img" :src="serverUrl + 'images/' + entity.image" v-if="entity && entity.image" />
            <img class="avatar-img" src="@/assets/imgs/user-avatar.png" v-if="entity && !entity.image" />
          </div>
          <div class="icons" v-if="isMyProfile">
            <FaIcon icon="plus" class="icon light" data-toggle="modal" data-target="#editImageModal" v-if="entity" />
            <FaIcon icon="trash" class="icon red" @click="openRemoveImage" v-if="entity && entity.image" />
          </div>
        </div>
        <div class="information">
          <div class="header">
            <span class="fullname" v-if="entity" v-text="entity.fullname" />
            <span class="type" v-if="entity" v-text="entity.type" />
            <span class="address"
              ><AppShowAddress type="entity" :address="$route.params.address" :forceShowAddress="true"
            /></span>
            <span class="description" v-if="entity" v-text="entity.description" />
          </div>
          <div class="body" v-if="entity">
            <span class="email" v-if="entity.email"
              ><FaIcon icon="envelope" class="icon" />&nbsp;<a :href="'mailto:' + entity.email + '?Subject=Fund'">{{
                entity.email
              }}</a></span
            >
            <span class="phone" v-if="entity.phone"
              ><FaIcon icon="phone" class="icon" />&nbsp;<a :href="'tel:' + entity.phone">{{ entity.phone }}</a></span
            >
            <span class="location" v-if="entity.country && entity.region"
              ><FaIcon icon="location-dot" class="icon" />&nbsp;<a
                :href="'https://www.google.com/maps?q=' + entity.region + ', ' + entity.country"
                target="_blank"
                >{{ entity.region }},&nbsp;{{ entity.country }}</a
              ></span
            >
            <span class="url" v-if="entity.url"
              ><FaIcon icon="link" class="icon" />&nbsp;<a :href="entity.url" target="_blank">Sitio Web</a></span
            >
            <AppButton
              classes="btn-secondary btn-block"
              text="Actualizar datos"
              data-toggle="modal"
              data-target="#editEntityModal"
              v-if="isMyProfile"
            />
          </div>
          <div class="not-entity" v-else>
            <p class="title" v-if="!isMyProfile">La entidad no existe o aún no ha sido creada.</p>
            <p class="title" v-else>La entidad aún no ha sido creada.</p>
            <p class="subtitle" v-if="!isMyProfile">¡Inténtelo nuevamente más tarde!</p>
            <AppButton classes="btn-primary" text="Crear entidad" data-toggle="modal" data-target="#editEntityModal" v-else />
          </div>
        </div>
      </div>

      <EditEntityModal :entity="entity" @update="getEntityData" />
      <EditImageModal @update="updateImage" />
    </div>

    <div class="investment-statistics">
      <div class="item item-red">
        <div
          class="amount"
          data-toggle="tooltip"
          data-placement="bottom"
          title=""
          :data-original-title="'≈ ' + usdContributed + ' USD'"
          v-text="ethContributed"
          @click="openFundsContributedModal"
        ></div>
        <span class="description"><span class="unit">ETH</span> contribuidos</span>
      </div>
      <div class="item item-purple">
        <div class="amount" v-text="contributedFundsAmount" @click="openFundsContributedModal"></div>
        <span class="description"><span class="unit">Fondos</span> contribuidos</span>
      </div>

      <FundsContributedModal :loading="loading" :contributions="fundsContributions" v-if="contributedFundsAmount > 0" />
    </div>

    <div class="extra-information profile-extra-information">
      <div
        id="extra-information-header"
        class="extra-information-header"
        @mouseover="mouseOverHeader"
        @mouseleave="mouseLeaveHeader"
      >
        <div class="arrow arrow-left" @click="goBack" v-if="extraInformation.activeGoBack">
          <FaIcon icon="arrow-left" class="icon" />
        </div>
        <div class="arrow arrow-right" @click="goForward" v-if="extraInformation.activeGoForward">
          <FaIcon icon="arrow-right" class="icon" />
        </div>
        <div id="extra-information-header-container" class="extra-information-header-container">
          <div class="item" @click="extraInformation.fundsCreated = true">
            <span class="span" :class="{ 'span-active': extraInformation.fundsCreated }">Fondos creados</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.fundsCreated }"></div>
          </div>
          <div class="item" @click="extraInformation.fundsAdmin = true">
            <span class="span" :class="{ 'span-active': extraInformation.fundsAdmin }">Administrador</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.fundsAdmin }"></div>
          </div>
          <div class="item" @click="extraInformation.contributions = true">
            <span class="span" :class="{ 'span-active': extraInformation.contributions }">Contribuciones</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.contributions }"></div>
          </div>
          <div class="item" @click="extraInformation.transfersMade = true">
            <span class="span" :class="{ 'span-active': extraInformation.transfersMade }">Transferencias realizadas</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.transfersMade }"></div>
          </div>
          <div class="item" @click="extraInformation.transferReceived = true">
            <span class="span" :class="{ 'span-active': extraInformation.transferReceived }">Transferencias recibidas</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.transferReceived }"></div>
          </div>
          <div class="item" @click="extraInformation.requestsCreated = true">
            <span class="span" :class="{ 'span-active': extraInformation.requestsCreated }">Solicitudes creadas</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.requestsCreated }"></div>
          </div>
          <div class="item" @click="extraInformation.requestsReceiver = true">
            <span class="span" :class="{ 'span-active': extraInformation.requestsReceiver }">Destinatario</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.requestsReceiver }"></div>
          </div>
        </div>
      </div>
      <div class="body">
        <!-- Fondos creados -->
        <FundsCreated :loading="loadingFunds" :funds="funds" v-show="extraInformation.fundsCreated" />

        <!-- Fondos en los que es administrador -->
        <FundsAdmin :loading="loadingFunds" :funds="funds" v-show="extraInformation.fundsAdmin" />

        <!-- Contribuciones -->
        <Contributions :funds="funds" v-show="extraInformation.contributions" />

        <!-- Transferencias realizadas -->
        <TransfersMade :funds="funds" v-show="extraInformation.transfersMade" />

        <!-- Transferencias recibidas -->
        <TransferReceived :funds="funds" v-show="extraInformation.transferReceived" />

        <!-- Solicitudes creadas -->
        <RequestsCreated
          :funds="funds"
          :loading="loadingRequests"
          :requests="requests"
          v-show="extraInformation.requestsCreated"
        />

        <!-- Solicitudes en la que es destinatario -->
        <RequestsReceiver
          :funds="funds"
          :loading="loadingRequests"
          :requests="requests"
          v-show="extraInformation.requestsReceiver"
        />
      </div>
    </div>

    <div class="saved-funds mt-5" v-if="address && compareAddresses(address, $route.params.address) && savedFunds.length > 0">
      <p class="title">Fondos guardados</p>
      <div class="saved-funds-list">
        <FundCard
          class="fund-card"
          :fund="funds[funds.findIndex((fund) => compareAddresses(fund.address, savedFund))]"
          :savedFunds="savedFunds"
          @updateSavedFunds="getSavedFunds"
          v-for="(savedFund, index) in savedFundsOrdered"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import $ from 'jquery';
import Web3 from 'web3';
import { serverUrl } from '@/siteConfig';
import { mapState, mapGetters } from 'vuex';
import { call, event, convertNumberToMaxDecimals, ethPriceInUSD } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';
import { signMessage } from '@/helpers/connection';
import Swal from 'sweetalert2';
import axios from 'axios';

import EditEntityModal from '@/components/entity/EditEntityModal';
import EditImageModal from '@/components/EditImageModal';
import FundsContributedModal from '@/components/profile/modals/FundsContributedModal';
import FundsCreated from '@/components/profile/FundsCreated';
import FundsAdmin from '@/components/profile/FundsAdmin';
import Contributions from '@/components/profile/Contributions';
import TransfersMade from '@/components/profile/TransfersMade';
import TransferReceived from '@/components/profile/TransferReceived';
import RequestsCreated from '@/components/profile/RequestsCreated';
import RequestsReceiver from '@/components/profile/RequestsReceiver';
import FundCard from '@/components/fund/FundCard';

export default {
  name: 'ProfileView',
  components: {
    EditEntityModal,
    EditImageModal,
    FundsContributedModal,
    FundsCreated,
    FundsAdmin,
    Contributions,
    TransfersMade,
    TransferReceived,
    RequestsCreated,
    RequestsReceiver,
    FundCard,
  },
  data() {
    return {
      serverUrl,
      ethPriceInUSD: 0,
      loadingEntity: true,
      entity: null,
      loadingFunds: true,
      funds: [],
      loadingRequests: true,
      requests: [],
      extraInformation: {
        activeGoBack: false,
        activeGoForward: false,
        fundsCreated: true,
        fundsAdmin: false,
        contributions: false,
        transfersMade: false,
        transferReceived: false,
        requestsCreated: false,
        requestsReceiver: false,
      },
      savedFunds: [],
    };
  },
  computed: {
    ...mapState({
      signature: (state) => state.connection.signature,
    }),
    ...mapGetters(['address']),

    isMyProfile() {
      return compareAddresses(this.$route.params.address, this.address);
    },

    fundsContributions() {
      let fundsContributions = [];
      for (let fund of this.funds) {
        const contributorIndex = fund.contributors.findIndex((contributor) =>
          compareAddresses(contributor.contributor, this.$route.params.address),
        );
        if (contributorIndex >= 0) {
          fundsContributions.push(fund.contributors[contributorIndex]);
        }
      }
      return fundsContributions;
    },

    weisContributed() {
      let weisContributed = 0;
      for (let fundsContribution of this.fundsContributions) {
        weisContributed = BigNumber.sum(weisContributed, fundsContribution.contribution);
      }
      return weisContributed.toLocaleString('fullwide', { useGrouping: false });
    },

    ethContributed() {
      return convertNumberToMaxDecimals(Number(Web3.utils.fromWei(this.weisContributed, 'ether')), 4);
    },

    usdContributed() {
      return convertNumberToMaxDecimals(this.ethContributed * this.ethPriceInUSD, 2);
    },

    contributedFundsAmount() {
      return this.fundsContributions.length;
    },

    savedFundsOrdered() {
      return this.savedFunds.slice().reverse();
    },
  },
  watch: {
    'extraInformation.fundsCreated'(newValue) {
      if (newValue) {
        this.extraInformation.fundsAdmin = false;
        this.extraInformation.contributions = false;
        this.extraInformation.transfersMade = false;
        this.extraInformation.transferReceived = false;
        this.extraInformation.requestsCreated = false;
        this.extraInformation.requestsReceiver = false;
      }
    },
    'extraInformation.fundsAdmin'(newValue) {
      if (newValue) {
        this.extraInformation.fundsCreated = false;
        this.extraInformation.contributions = false;
        this.extraInformation.transfersMade = false;
        this.extraInformation.transferReceived = false;
        this.extraInformation.requestsCreated = false;
        this.extraInformation.requestsReceiver = false;
      }
    },
    'extraInformation.contributions'(newValue) {
      if (newValue) {
        this.extraInformation.fundsCreated = false;
        this.extraInformation.fundsAdmin = false;
        this.extraInformation.transfersMade = false;
        this.extraInformation.transferReceived = false;
        this.extraInformation.requestsCreated = false;
        this.extraInformation.requestsReceiver = false;
      }
    },
    'extraInformation.transfersMade'(newValue) {
      if (newValue) {
        this.extraInformation.fundsCreated = false;
        this.extraInformation.fundsAdmin = false;
        this.extraInformation.contributions = false;
        this.extraInformation.transferReceived = false;
        this.extraInformation.requestsCreated = false;
        this.extraInformation.requestsReceiver = false;
      }
    },
    'extraInformation.transferReceived'(newValue) {
      if (newValue) {
        this.extraInformation.fundsCreated = false;
        this.extraInformation.fundsAdmin = false;
        this.extraInformation.contributions = false;
        this.extraInformation.transfersMade = false;
        this.extraInformation.requestsCreated = false;
        this.extraInformation.requestsReceiver = false;
      }
    },
    'extraInformation.requestsCreated'(newValue) {
      if (newValue) {
        this.extraInformation.fundsCreated = false;
        this.extraInformation.fundsAdmin = false;
        this.extraInformation.contributions = false;
        this.extraInformation.transfersMade = false;
        this.extraInformation.transferReceived = false;
        this.extraInformation.requestsReceiver = false;
      }
    },
    'extraInformation.requestsReceiver'(newValue) {
      if (newValue) {
        this.extraInformation.fundsCreated = false;
        this.extraInformation.fundsAdmin = false;
        this.extraInformation.contributions = false;
        this.extraInformation.transfersMade = false;
        this.extraInformation.transferReceived = false;
        this.extraInformation.requestsCreated = false;
      }
    },
  },
  methods: {
    compareAddresses,

    getEntityData() {
      this.loadingEntity = true;
      axios.get('entity/' + this.$route.params.address).then((res) => {
        this.entity = res.data;
        this.loadingEntity = false;
      });
    },

    updateImage(imageName) {
      this.entity.image = imageName;
    },

    openRemoveImage() {
      Swal.fire({
        title: 'Eliminar imagen',
        text: '¿Está seguro que desea eliminar la imagen del perfil?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: '¡Sí, eliminar!',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeImage();
        }
      });
    },

    async removeImage() {
      if (!this.signature) await signMessage();
      axios.delete('entity/removeImage').then(() => {
        this.entity.image = undefined;
        addNotification({
          message: 'Imagen eliminada',
          type: 'success',
        });
      });
    },

    async getAllFunds() {
      this.loadingFunds = true;
      try {
        const fundsAddress = await call('FundFactory', 'getDeployedFunds');
        const totalFunds = fundsAddress.length;
        if (totalFunds > 0) {
          const funds = Array(totalFunds);
          await Promise.all(
            Array(totalFunds)
              .fill()
              .map((element, fundIndex) => {
                return call({ name: 'Fund', address: fundsAddress[fundIndex] }, 'getSummary', [], {}, async (fund) => {
                  const extraSummary = await call({ name: 'Fund', address: fundsAddress[fundIndex] }, 'getExtraSummary');
                  fund = {
                    ...fund,
                    ...extraSummary,
                  };
                  const { data: fundExtraInformation } = await axios.get('fund/' + fund.address);
                  if (fundExtraInformation) {
                    const { description, image } = fundExtraInformation;
                    fund.description = description;
                    fund.image = image;
                  }
                  funds[fundIndex] = fund;

                  // contributors
                  let contributors = [];
                  if (funds[fundIndex].contributors.length > 0) {
                    contributors = Array(funds[fundIndex].contributors.length);
                    await Promise.all(
                      Array(funds[fundIndex].contributors.length)
                        .fill()
                        .map((element, contributorIndex) => {
                          return call(
                            { name: 'Fund', address: funds[fundIndex].address },
                            'contributions',
                            [funds[fundIndex].contributors[contributorIndex]],
                            {},
                            (res) => {
                              contributors[contributorIndex] = {
                                fundAddress: funds[fundIndex].address,
                                fundName: funds[fundIndex].name,
                                contributor: funds[fundIndex].contributors[contributorIndex],
                                contribution: res,
                              };
                            },
                          );
                        }),
                    );
                  }
                  funds[fundIndex].contributors = contributors;
                });
              }),
          );
          this.funds = funds;
        }
      } finally {
        this.loadingFunds = false;
        this.getAllRequests();
        this.getSavedFunds();
      }
    },

    async getAllRequests() {
      this.loadingRequests = true;
      try {
        if (this.funds.length > 0) {
          await Promise.all(
            Array(this.funds.length)
              .fill()
              .map((element, fundIndex) => {
                return new Promise((resolve) => {
                  const searchRequests = async () => {
                    const totalFundRequests = parseInt(
                      await call({ name: 'Fund', address: this.funds[fundIndex].address }, 'requestsCount'),
                    );
                    if (totalFundRequests > 0) {
                      let fundRequests = Array(totalFundRequests);
                      await Promise.all(
                        Array(totalFundRequests)
                          .fill()
                          .map((element, requestIndex) => {
                            return call(
                              { name: 'Fund', address: this.funds[fundIndex].address },
                              'requests',
                              [requestIndex],
                              {},
                              async (res) => {
                                let newRequestBlock;
                                await event(
                                  { name: 'Fund', address: this.funds[fundIndex].address },
                                  'NewRequest',
                                  { filter: { requestIndex } },
                                  async (events) => {
                                    newRequestBlock = await this.$store.state.connection.infuraWeb3.eth.getBlock(
                                      events[0].blockNumber,
                                    );
                                  },
                                  true,
                                );
                                let finalizeRequestBlock;
                                if (res.complete) {
                                  await event(
                                    { name: 'Fund', address: this.funds[fundIndex].address },
                                    'FinalizeRequest',
                                    { filter: { requestIndex } },
                                    async (events) => {
                                      finalizeRequestBlock = await this.$store.state.connection.infuraWeb3.eth.getBlock(
                                        events[0].blockNumber,
                                      );
                                    },
                                    true,
                                  );
                                }
                                fundRequests[requestIndex] = {
                                  fundIndex,
                                  index: requestIndex,
                                  description: res.description,
                                  petitioner: res.petitioner,
                                  recipient: res.recipient,
                                  valueToTransfer: res.valueToTransfer,
                                  transferredValue: res.transferredValue,
                                  complete: res.complete,
                                  completeTimestamp: res.complete ? finalizeRequestBlock.timestamp : '',
                                  approvalsCount: res.approvalsCount,
                                  timestamp: newRequestBlock.timestamp,
                                };
                              },
                            );
                          }),
                      );
                      this.requests = this.requests.concat(fundRequests);
                    }
                    resolve();
                  };
                  searchRequests();
                });
              }),
          );
        }
      } finally {
        this.loadingRequests = false;
      }
    },

    openFundsContributedModal() {
      $('#fundsContributedModal').modal('show');
    },

    mouseOverHeader() {
      const scrollLeft = document.getElementById('extra-information-header-container').scrollLeft;
      const offsetWidth = document.getElementById('extra-information-header-container').offsetWidth;
      const scrollWidth = document.getElementById('extra-information-header-container').scrollWidth;
      if (scrollLeft > 5) this.extraInformation.activeGoBack = true;
      else this.extraInformation.activeGoBack = false;
      if (scrollWidth - (scrollLeft + offsetWidth) > 5) this.extraInformation.activeGoForward = true;
      else this.extraInformation.activeGoForward = false;
    },

    mouseLeaveHeader() {
      this.extraInformation.activeGoBack = false;
      this.extraInformation.activeGoForward = false;
    },

    goBack() {
      $('.extra-information-header-container').animate(
        { scrollLeft: document.getElementById('extra-information-header-container').scrollLeft - 300 },
        200,
        () => this.mouseOverHeader(),
      );
    },

    goForward() {
      $('.extra-information-header-container').animate(
        { scrollLeft: document.getElementById('extra-information-header-container').scrollLeft + 300 },
        200,
        () => this.mouseOverHeader(),
      );
    },

    getSavedFunds() {
      if (this.address) {
        axios.get('entity/' + this.address).then((res) => {
          if (res.data) this.savedFunds = res.data.savedFunds;
        });
      }
    },
  },
  async created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

    this.ethPriceInUSD = await ethPriceInUSD();

    this.getEntityData();
    this.getAllFunds();
  },
};
</script>

<style lang="scss" scoped>
.entity-card {
  min-height: 15rem;
  background-color: rgb(248, 248, 248);
  padding: 1rem 1.5rem;
  border: 1px solid rgb(209, 209, 209);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  .entity-card-content {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-around;
    align-items: center;
    gap: 1.5rem;

    @media (max-width: 680px) {
      text-align: center;
      flex-direction: column;
    }

    .img-center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .img-container {
        height: 20rem;
        width: 20rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .not-found-img {
          height: 16rem;
          width: 16rem;
        }

        .profile-img {
          height: 18rem;
          width: 18rem;
          border-radius: 100%;
        }

        .avatar-img {
          height: 18rem;
          width: 18rem;
        }

        .magnify-img:hover {
          height: 20rem;
          width: 20rem;
          border-radius: 1rem;
        }
      }

      .icons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.3rem;

        .icon {
          user-select: none;
          height: 1.5rem;
          width: 1.5rem;
          padding: 0.7rem;
          border-radius: 100%;
        }

        .icon:hover {
          cursor: pointer;
          background-color: rgb(225, 225, 225);
        }
      }
    }

    .information {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .header {
        display: flex;
        flex-direction: column;
        align-items: start;

        @media (max-width: 680px) {
          align-items: center;
        }

        .fullname {
          font-size: 2.4rem;
          font-weight: bold;
        }

        .type {
          font-size: 1.25rem;
          color: rgb(50, 50, 50);
        }

        .address {
          font-size: 1.9rem;
          font-weight: bold;
        }

        .description {
          color: rgb(50, 50, 50);
          padding-top: 0.6rem;
        }
      }

      .body {
        font-size: 1.1rem;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 0.6rem;

        @media (max-width: 680px) {
          align-items: center;
        }

        .btn {
          margin-top: 0.7rem;
        }
      }

      .not-entity {
        .title {
          font-size: 1.5rem;
        }

        .subtitle {
          font-size: 1.16rem;
          color: rgb(35, 35, 35);
        }
      }
    }
  }
}

.investment-statistics {
  padding: 3rem;

  @media (max-width: 920px) {
    padding: 3rem 0;
  }

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: 5rem;
  row-gap: 1.5rem;

  @media (max-width: 620px) {
    flex-direction: column;
  }

  .item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 0.6rem;

    .amount {
      cursor: pointer;
      font-size: 3rem;
      word-break: break-word;
      height: 12rem;
      width: 12rem;
      background-color: rgba(240, 240, 240, 0.2);
      border: 0.6rem solid;
      border-radius: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .description {
      font-size: 1.35rem;
    }
  }

  .item-red {
    .amount {
      color: #e74a9b;
      border-color: #e74a9b;
      box-shadow: 0 0 10px #e74a9b;
    }

    .description {
      .unit {
        color: #e74a9b;
      }
    }
  }

  .item-purple {
    .amount {
      color: #7645d9;
      border-color: #7645d9;
      box-shadow: 0 0 10px #7645d9;
    }

    .description {
      .unit {
        color: #7645d9;
      }
    }
  }
}

.saved-funds {
  .title {
    font-size: 2.2rem;
    font-weight: bold;
    font-family: 'Dancing Script', cursive;
    text-align: center;
  }

  .saved-funds-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: stretch;

    .fund-card {
      width: 33.33%;

      @media (max-width: 1150px) {
        width: 50%;
      }

      @media (max-width: 680px) {
        width: 100%;
        padding: 0.5rem 0;
      }
    }
  }
}
</style>
