<template>
  <div class="content">
    <div class="entity-card">
      <img class="profile-img" :src="'http://localhost:4000/images/' + entity.image" v-if="entity && entity.image" />
      <img class="profile-img" src="@/assets/imgs/user-not-found.png" v-else />
      <div class="information">
        <div class="header">
          <span class="fullname" v-if="entity" v-text="entity.fullname" />
          <span class="address"><AppShowAddress :address="$route.params.address" /></span>
          <span class="type" v-if="entity" v-text="entity.type" />
        </div>
        <div class="body" v-if="entity">
          <span class="email" v-if="entity.email"><fa-icon icon="envelope" class="icon" />&nbsp;{{ entity.email }}</span>
          <span class="phone" v-if="entity.phone"><fa-icon icon="phone" class="icon" />&nbsp;{{ entity.phone }}</span>
          <span class="url" v-if="entity.url"><fa-icon icon="link" class="icon" />&nbsp;{{ entity.url }}</span>
        </div>
        <div class="not-entity" v-else></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { compareAddresses } from 'web3-simple-helpers/methods/general';
import axios from 'axios';

export default {
  name: 'ProfileView',
  components: {},
  data() {
    return {
      isMyProfile: false,
      entity: null,
    };
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {},
  async created() {
    if (compareAddresses(this.address, this.$route.params.address)) this.isMyProfile = true;
    axios.get('entity/' + this.$route.params.address).then((res) => {
      this.entity = res.data;
    });
  },
};
</script>

<style lang="scss" scoped>
.entity-card {
  background-color: rgb(248, 248, 248);
  padding: 1rem;
  border: 1px solid rgb(209, 209, 209);
  border-radius: 10px;
  margin-top: 1rem;
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

  .information {
    display: flex;
    flex-direction: column;
    gap: 1.3rem;

    .header {
      display: flex;
      flex-direction: column;

      .fullname {
        font-size: 2.6rem;
        font-weight: bold;
      }

      .address {
        font-size: 1.9rem;
        font-weight: bold;
      }

      .type {
        font-size: 1.38rem;
      }
    }

    .body {
      font-size: 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
  }
}
</style>
