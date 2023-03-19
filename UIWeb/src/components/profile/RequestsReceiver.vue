<template>
  <div class="container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="items" v-else>
      <div class="no-items" v-if="contributionsOrdered && contributionsOrdered.length === 0">Sin contribuciones</div>
      <ul class="list-group list-group-flush" v-else>
        <li class="list-group-item" v-for="(contribution, index) in contributionsOrdered" :key="index">
          <div class="header">
            <AppDate class="date" :date="fromUnixTimestampToDate(contribution.timestamp)" />
          </div>
          <span>
            <AppShowAddress
              class="address hover"
              :address="contribution.contributor"
              @click="goToProfile(contribution.contributor)"
            />
            <span>&nbsp;contribuyó&nbsp;</span>
            <AppShowEth :weis="contribution.value" />
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { goToProfile } from '@/helpers/helpers';
import { fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'RequestsReceiverProfileComponent',
  components: {},
  props: {
    funds: { type: Array, required: true },
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {},
  methods: {
    goToProfile,
    fromUnixTimestampToDate,
  },
  created() {},
  mounted() {},
  unmounted() {},
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .spinner {
    margin-top: 2rem;
  }

  .items {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .no-items {
      font-size: 1.2rem;
      text-align: center;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 0.8rem;
    }

    .list-group-item {
      padding: 0.6rem 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: start;
      gap: 0.3rem;

      .header {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 0.4rem;

        .date {
          font-size: 0.8rem;
        }

        .badge {
          font-size: 0.75rem;
          margin-left: auto;
        }
      }

      .address {
        font-weight: bold;
      }
    }
  }
}
</style>
