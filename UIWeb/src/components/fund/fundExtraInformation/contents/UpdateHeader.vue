<template>
  <div class="update-header">
    <AppSpinner v-if="loading" />
    <div class="header-container" v-else>
      <img class="img" :src="serverUrl + 'images/' + entity.image" v-if="entity.image" />
      <img class="img" src="@/assets/imgs/user-avatar.png" v-else />
      <div class="info">
        <span class="name" v-text="entity.fullname"></span>
        <AppDate class="date" :date="date" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { serverUrl } from '@/siteConfig';
import { mapGetters } from 'vuex';

export default {
  name: 'UpdateHeaderComponent',
  components: {},
  props: {
    entityAddress: { type: String, required: true },
    date: { type: Date, required: true },
  },
  data() {
    return {
      serverUrl,
      loading: true,
      entity: null,
    };
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {},
  created() {
    axios.get('entity/' + this.entityAddress).then((res) => {
      this.entity = res.data;
      this.loading = false;
    });
  },
};
</script>

<style lang="scss" scoped>
.update-header {
  .header-container {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 0.8rem;

    .img {
      height: 3.8rem;
      width: 3.8rem;
      border-radius: 100%;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;

      .name {
        font-size: 1.15rem;
      }

      .date {
        font-size: 0.9rem;
        color: grey;
      }
    }
  }
}
</style>
