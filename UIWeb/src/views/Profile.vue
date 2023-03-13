<template>
  <div class="content">
    <div class="entity-card">
      <AppSpinner class="spinner" size="big" v-if="loading" />
      <div class="entity-card-content" v-else>
        <div class="img-container">
          <img class="profile-img magnify-img" :src="serverUrl + 'images/' + entity.image" v-if="entity && entity.image" />
          <img class="profile-img" src="@/assets/imgs/user-not-found.png" v-else />
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
  </div>
</template>

<script>
import { serverUrl } from '@/siteConfig';
import { mapState, mapGetters } from 'vuex';
import { compareAddresses } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';
import { signMessage } from '@/helpers/connection';
import Swal from 'sweetalert2';
import axios from 'axios';

import EditEntityModal from '@/components/entity/EditEntityModal';
import EditImageModal from '@/components/EditImageModal';

export default {
  name: 'ProfileView',
  components: {
    EditEntityModal,
    EditImageModal,
  },
  data() {
    return {
      serverUrl,
      loading: true,
      entity: null,
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
  methods: {
    getEntityData() {
      this.loading = true;
      axios.get('entity/' + this.$route.params.address).then((res) => {
        this.entity = res.data;
        this.loading = false;
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
  },
  async created() {
    this.getEntityData();
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
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    gap: 1.5rem;

    .img-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 0.8rem;

      .profile-img {
        height: 15rem;
        width: 15rem;
        border-radius: 15rem;
      }

      .magnify-img:hover {
        height: 21rem;
        width: 21rem;
        border-radius: 1rem;
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
</style>
