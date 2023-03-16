<template>
  <div
    class="modal fade"
    :id="'entityModal' + address"
    tabindex="-1"
    :aria-labelledby="'entityModalLabel' + address"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" :id="'entityModalLabel' + address">Datos de la entidad</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="!entity">La entidad aún no ha sido creada</div>
          <div class="entity-information" v-else>
            <img class="profile-img" :src="serverUrl + 'images/' + entity.image" v-if="entity.image" />
            <img class="profile-img" src="@/assets/imgs/user-not-found.png" v-else />
            <span class="fullname" v-text="entity.fullname" />
            <span class="type" v-text="entity.type" />
            <span class="address"><AppShowAddress :address="address" /></span>
            <span class="email" v-if="entity.email">
              <fa-icon icon="envelope" class="icon" />&nbsp;<a :href="'mailto:' + entity.email + '?Subject=Fund'">
                {{ entity.email }}
              </a>
            </span>
            <span class="phone" v-if="entity.phone"
              ><fa-icon icon="phone" class="icon" />&nbsp;<a :href="'tel:' + entity.phone"> {{ entity.phone }}</a>
            </span>
            <span class="url" v-if="entity.url"
              ><fa-icon icon="link" class="icon" />&nbsp;<a :href="entity.url" target="_blank">Sitio Web</a>
            </span>
            <AppButton classes="btn-secondary" text="Ver perfil completo" @click="goToProfile" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { serverUrl } from '@/siteConfig';
import axios from 'axios';

export default {
  name: 'entityModalComponent',
  components: {},
  props: {
    address: { type: String, required: true },
  },
  data() {
    return {
      serverUrl,
      entity: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    goToProfile() {
      const routeData = this.$router.resolve({
        name: 'Profile',
        params: { address: this.address },
      });
      window.open(routeData.href, '_blank');
    },
  },
  created() {
    axios.get('entity/' + this.address).then((res) => {
      this.entity = res.data;
    });
  },
};
</script>

<style lang="scss" scoped>
.entity-information {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  .profile-img {
    height: 10rem;
    width: 10rem;
    border-radius: 10rem;
  }

  .fullname {
    font-size: 2.2rem;
    font-weight: bold;
  }

  .type {
    font-size: 1.12rem;
    color: rgb(50, 50, 50);
  }

  .address {
    font-size: 1.65rem;
    font-weight: bold;
  }
}
</style>
