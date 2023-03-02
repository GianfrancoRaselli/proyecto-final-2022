<template>
  <div class="content">
    <div class="entity-card">
      <AppSpinner class="spinner" size="big" v-if="loading" />
      <div class="entity-card-content" v-else>
        <img
          class="profile-img magnify-img"
          :src="'http://localhost:4000/images/' + entity.image"
          v-if="entity && entity.image"
        />
        <img class="profile-img" src="@/assets/imgs/user-not-found.png" v-else />
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
            <p class="subtitle" v-if="!isMyProfile">¡Inténtelo nuevamente luego!</p>
            <AppButton classes="btn-primary" text="Crear entidad" data-toggle="modal" data-target="#editEntityModal" v-else />
          </div>
        </div>
      </div>

      <EditEntityModal :entity="entity" @update="getEntityData" />
      <EditEntityModalImage @update="getEntityData" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { compareAddresses } from 'web3-simple-helpers/methods/general';
import axios from 'axios';

import EditEntityModal from '@/components/entity/EditEntityModal';
import EditEntityModalImage from '@/components/entity/EditEntityModal';

export default {
  name: 'ProfileView',
  components: {
    EditEntityModal,
    EditEntityModalImage,
  },
  data() {
    return {
      loading: true,
      isMyProfile: false,
      entity: null,
    };
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {
    getEntityData() {
      this.loading = true;
      this.fund = undefined;
      axios.get('entity/' + this.$route.params.address).then((res) => {
        this.entity = res.data;
        this.loading = false;
      });
    },
  },
  async created() {
    if (compareAddresses(this.address, this.$route.params.address)) this.isMyProfile = true;
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

    .profile-img {
      height: 15rem;
      width: 15rem;
      border-radius: 15rem;
    }

    .magnify-img:hover {
      height: 23rem;
      width: 23rem;
      border-radius: 1rem;
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

        .subtitel {
          font-size: 1.3rem;
          color: rgb(35, 35, 35);
        }
      }
    }
  }
}
</style>
