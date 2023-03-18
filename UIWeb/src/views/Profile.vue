<template>
  <div class="content">
    <div class="entity-card">
      <AppSpinner class="spinner" size="big" v-if="loadingEntity" />
      <div class="entity-card-content" v-else>
        <div class="img-center">
          <div class="img-container">
            <img class="profile-img magnify-img" :src="serverUrl + 'images/' + entity.image" v-if="entity && entity.image" />
            <img class="profile-img" src="@/assets/imgs/user-not-found.png" v-else />
          </div>
          <div class="icons" v-if="isMyProfile">
            <fa-icon icon="plus" class="icon light" data-toggle="modal" data-target="#editImageModal" v-if="entity" />
            <fa-icon icon="trash" class="icon red" @click="openRemoveImage" v-if="entity && entity.image" />
          </div>
        </div>
        <div class="information">
          <div class="header">
            <span class="fullname" v-if="entity" v-text="entity.fullname" />
            <span class="type" v-if="entity" v-text="entity.type" />
            <span class="address"><AppShowAddress :address="$route.params.address" /></span>
          </div>
          <div class="body" v-if="entity">
            <span class="email" v-if="entity.email"
              ><fa-icon icon="envelope" class="icon" />&nbsp;<a :href="'mailto:' + entity.email + '?Subject=Fund'">{{
                entity.email
              }}</a></span
            >
            <span class="phone" v-if="entity.phone"
              ><fa-icon icon="phone" class="icon" />&nbsp;<a :href="'tel:' + entity.phone">{{ entity.phone }}</a></span
            >
            <span class="url" v-if="entity.url"
              ><fa-icon icon="link" class="icon" />&nbsp;<a :href="entity.url" target="_blank">Sitio Web</a></span
            >
            <AppButton
              classes="btn-secondary"
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

    <div class="extra-informacion">
      <div id="header" class="header" @mouseover="mouseOverHeader" @mouseleave="mouseLeaveHeader">
        <div class="arrow arrow-left" @click="goBack" v-if="extraInformation.activeGoBack">
          <fa-icon icon="arrow-left" class="icon" />
        </div>
        <div class="arrow arrow-right" @click="goForward" v-if="extraInformation.activeGoForward">
          <fa-icon icon="arrow-right" class="icon" />
        </div>
        <div id="header-container" class="header-container">
          <div class="item" @click="extraInformation.fundsCreated = true">
            <span class="span" :class="{ 'span-active': extraInformation.fundsCreated }">Fondos creados</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.fundsCreated }"></div>
          </div>
          <div class="item" @click="extraInformation.fundsAdmin = true">
            <span class="span" :class="{ 'item-active': extraInformation.fundsAdmin }">Administrador</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.fundsAdmin }"></div>
          </div>
          <div class="item" @click="extraInformation.contributions = true">
            <span class="span" :class="{ 'item-active': extraInformation.contributions }">Contribuciones</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.contributions }"></div>
          </div>
          <div class="item" @click="extraInformation.transfersMade = true">
            <span class="span" :class="{ 'item-active': extraInformation.transfersMade }">Transferencias realizadas</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.transfersMade }"></div>
          </div>
          <div class="item" @click="extraInformation.transferReceived = true">
            <span class="span" :class="{ 'item-active': extraInformation.transferReceived }">Transferencias recibidas</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.transferReceived }"></div>
          </div>
          <div class="item" @click="extraInformation.requestsCreated = true">
            <span class="span" :class="{ 'item-active': extraInformation.requestsCreated }">Solicitudes creadas</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.requestsCreated }"></div>
          </div>
          <div class="item" @click="extraInformation.requestsReceiver = true">
            <span class="span" :class="{ 'item-active': extraInformation.requestsReceiver }">Destinatario</span>
            <div class="bar" :class="{ 'bar-active': extraInformation.requestsReceiver }"></div>
          </div>
        </div>
      </div>
      <div class="body">
        <!-- Fondos creados -->
        <FundsCreated :loading="loadingFunds" :funds="funds" v-if="extraInformation.fundsCreated" />

        <!-- Fondos en los que es administrador -->

        <!-- Contribuciones -->

        <!-- Transferencias realizadas -->

        <!-- Transferencias recibidas -->

        <!-- Solicitudes creadas -->

        <!-- Solicitudes en la que es destinatario -->
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { serverUrl } from '@/siteConfig';
import { mapState, mapGetters } from 'vuex';
import { call } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';
import { signMessage } from '@/helpers/connection';
import Swal from 'sweetalert2';
import axios from 'axios';

import EditEntityModal from '@/components/entity/EditEntityModal';
import EditImageModal from '@/components/EditImageModal';
import FundsCreated from '@/components/profile/FundsCreated';

export default {
  name: 'ProfileView',
  components: {
    EditEntityModal,
    EditImageModal,
    FundsCreated,
  },
  data() {
    return {
      serverUrl,
      loadingEntity: true,
      entity: null,
      loadingFunds: true,
      funds: null,
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
    };
  },
  computed: {
    ...mapState({
      signature: (state) => state.connection.signature,
    }),
    ...mapGetters(['address']),

    isMyProfile() {
      return compareAddresses(this.address, this.$route.params.address);
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
      const fundsAddress = await call('FundFactory', 'getDeployedFunds');
      const totalFunds = fundsAddress.length;
      const funds = Array(totalFunds);
      await Promise.all(
        Array(totalFunds)
          .fill()
          .map((element, index) => {
            return call({ name: 'Fund', address: fundsAddress[index] }, 'getSummary', [], {}, async (fund) => {
              const { data: fundExtraInformation } = await axios.get('fund/' + fund.address);
              if (fundExtraInformation) {
                const { description, image } = fundExtraInformation;
                fund.description = description;
                fund.image = image;
              }
              funds[index] = fund;
            });
          }),
      );
      this.funds = funds;
      this.loadingFunds = false;
    },

    mouseOverHeader() {
      const scrollLeft = document.getElementById('header-container').scrollLeft;
      const offsetWidth = document.getElementById('header-container').offsetWidth;
      const scrollWidth = document.getElementById('header-container').scrollWidth;
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
      $('.header-container').animate({ scrollLeft: document.getElementById('header-container').scrollLeft - 300 }, 200, () =>
        this.mouseOverHeader(),
      );
    },

    goForward() {
      $('.header-container').animate({ scrollLeft: document.getElementById('header-container').scrollLeft + 300 }, 200, () =>
        this.mouseOverHeader(),
      );
    },
  },
  async created() {
    this.getEntityData();
    this.getAllFunds();
  },
};
</script>

<style lang="scss" scoped>
.entity-card {
  min-height: 15rem;
  background-color: rgb(248, 248, 248);
  padding: 1rem;
  border: 1px solid rgb(209, 209, 209);
  border-radius: 10px;
  margin-top: 1rem;
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
      justify-content: space-between;
      align-items: center;

      .img-container {
        height: 17rem;
        width: 17rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .profile-img {
          height: 15rem;
          width: 15rem;
          border-radius: 15rem;
        }

        .magnify-img:hover {
          height: 17rem;
          width: 17rem;
          border-radius: 1rem;
        }
      }

      .icons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;

        .icon {
          user-select: none;
          height: 1.5rem;
          width: 1.5rem;
          padding: 0.5rem;
          border-radius: 1.5rem;
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
      gap: 1.3rem;

      .header {
        display: flex;
        flex-direction: column;

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
      }

      .body {
        font-size: 1.1rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;

        .btn {
          margin-top: 0.7rem;
        }
      }

      .not-entity {
        .title {
          font-size: 1.6rem;
        }

        .subtitle {
          font-size: 1.2rem;
          color: rgb(35, 35, 35);
        }
      }
    }
  }
}

.extra-informacion {
  padding: 2rem 6rem;

  @media (max-width: 920px) {
    padding: 2rem 0;
  }

  .header {
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

    .header-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
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

    .header-container::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
