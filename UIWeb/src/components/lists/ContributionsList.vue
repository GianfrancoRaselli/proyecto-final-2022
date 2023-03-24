<template>
  <div>
    <AppSpinner v-if="loading" />
    <div v-else>
      <div class="no-contributions" v-if="contributions.length === 0">Sin contribuciones</div>
      <ul class="list-group list-group-flush" v-else>
        <li class="list-group-item" v-for="(contribution, index) in contributions" :key="index">
          <div class="header">
            <AppDate class="date" :date="fromUnixTimestampToDate(contribution.timestamp)" />
            <span class="badge badge-pill badge-primary" v-if="compareAddresses(contribution.contributor, address)"
              >Mi contribución</span
            >
          </div>
          <span>
            <AppShowAddress type="entity" class="address" :address="contribution.contributor" :goToProfile="true" />
            <span>&nbsp;contribuyó&nbsp;</span>
            <AppShowEth :weis="contribution.value" />
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ContributionsListComponent',
  components: {},
  props: {
    loading: { type: Boolean, required: true },
    contributions: { type: Array, required: true },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {
    compareAddresses,
    fromUnixTimestampToDate,
  },
  async created() {},
};
</script>

<style lang="scss" scoped>
.list-group-item {
  padding: 0.8rem 0.2rem;
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

    .badge {
      margin-left: auto;
    }
  }

  .address {
    font-weight: bold;
  }
}
</style>
