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
            <img class="profile-img" src="@/assets/imgs/user-avatar.png" v-else />
            <span class="fullname" v-text="entity.fullname" />
            <span class="type" v-text="entity.type" />
            <span class="address"><AppShowAddress type="entity" :address="address" :forceShowAddress="true" /></span>
            <span class="description" v-text="entity.description" />
            <span class="email" v-if="entity.email">
              <FaIcon icon="envelope" class="icon" />&nbsp;<a :href="'mailto:' + entity.email + '?Subject=Fund'">
                {{ entity.email }}
              </a>
            </span>
            <span class="phone" v-if="entity.phone"
              ><FaIcon icon="phone" class="icon" />&nbsp;<a :href="'tel:' + entity.phone"> {{ entity.phone }}</a>
            </span>
            <span class="location" v-if="entity.country && entity.region"
              ><FaIcon icon="location-dot" class="icon" />&nbsp;<a
                :href="'https://www.google.com/maps?q=' + entity.region + ', ' + entity.country"
                target="_blank"
                >{{ entity.region }},&nbsp;{{ entity.country }}</a
              ></span
            >
            <span class="url" v-if="entity.url"
              ><FaIcon icon="link" class="icon" />&nbsp;<a :href="entity.url" target="_blank">Sitio Web</a>
            </span>
            <AppButton classes="btn-secondary" text="Ver perfil completo" @click="goToProfile(address)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { serverUrl } from '@/siteConfig';
import { goToProfile } from '@/helpers/helpers';
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
    goToProfile,
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
    height: 12rem;
    width: 12rem;
    border-radius: 100%;
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

  .description {
    text-align: center;
    font-size: 0.95rem;
    color: rgb(50, 50, 50);
    padding: 0.5rem;
  }
}
</style>
