<template>
  <div class="card text-center" @click="redirect">
    <div class="card-header">
      <span v-text="entity.fullname" />
    </div>
    <div class="card-body">
      <img class="img" :src="serverUrl + 'images/' + entity.image" v-if="entity.image" />
      <img class="img" src="@/assets/imgs/user-not-found.png" v-else />
      <span class="type" v-text="entity.type" />
      <span class="address"><AppShowAddress :address="entity.address" /></span>
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
    return { serverUrl };
  },
  computed: {},
  watch: {},
  methods: {
    redirect() {
      this.$router.push({ name: 'Profile', params: { address: this.entity.address } });
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  height: 98%;
  position: relative;
}

.card:hover {
  height: 100%;
  cursor: pointer;
  box-shadow: 0 0 4px rgb(65, 64, 64);
}

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
