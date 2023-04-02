<template>
  <div class="card-container">
    <router-link
      class="router-link"
      :to="{ name: canRedirect ? 'Profile' : '', params: { address: this.entity.address } }"
      @click="canRedirect = true"
    >
      <div class="card text-center">
        <div class="card-header">
          <span class="name" v-text="entity.fullname" />
        </div>
        <div class="card-body">
          <img class="img" :src="serverUrl + 'images/' + entity.image" v-if="entity.image" />
          <img class="img" src="@/assets/imgs/user-avatar.png" v-else />
          <span class="type" v-text="entity.type" />
          <span class="address"
            ><AppShowAddress
              type="entity"
              :address="entity.address"
              :forceShowAddress="true"
              @copyAddressClick="canRedirect = false"
          /></span>
          <span class="description" v-text="entity.description" />
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { serverUrl } from '@/siteConfig';

export default {
  name: 'EntityCardComponent',
  components: {},
  props: {
    entity: { type: Object, required: true },
  },
  data() {
    return {
      serverUrl,
      canRedirect: true,
    };
  },
  computed: {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 0.5rem;

  .img {
    height: 9.6rem;
    width: 9.6rem;
    border-radius: 100%;
  }

  .type {
    margin-top: 0.9rem;
    color: rgb(76, 76, 76);
  }

  .address {
    font-size: 1.35rem;
    font-weight: bold;
  }

  .description {
    text-align: center;
    font-size: 0.9rem;
    color: rgb(50, 50, 50);
    padding: 0.5rem 0;
  }
}
</style>
