<template>
  <div class="card-container">
    <div class="card text-center" @click="redirect">
      <div class="card-header">
        <span v-text="entity.fullname" />
      </div>
      <div class="card-body">
        <img class="img" :src="serverUrl + 'images/' + entity.image" v-if="entity.image" />
        <img class="img" src="@/assets/imgs/user-not-found.png" v-else />
        <span class="type" v-text="entity.type" />
        <span class="address"
          ><AppShowAddress type="entity" :address="entity.address" :forceShowAddress="true" @copyAddressClick="copyAddressClick"
        /></span>
      </div>
    </div>
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
  methods: {
    copyAddressClick() {
      this.canRedirect = false;
    },

    redirect() {
      if (this.canRedirect) this.$router.push({ name: 'Profile', params: { address: this.entity.address } });
      this.canRedirect = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  .type {
    margin-top: 0.9rem;
    color: rgb(76, 76, 76);
  }

  .address {
    font-size: 1.35rem;
    font-weight: bold;
  }

  .img {
    height: 8rem;
    width: 8rem;
    border-radius: 8rem;
  }
}
</style>
