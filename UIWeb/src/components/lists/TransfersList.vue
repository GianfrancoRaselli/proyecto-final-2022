<template>
  <div>
    <AppSpinner v-if="loading" />
    <div v-else>
      <div class="no-items" v-if="transfers.length === 0">Sin transferencias</div>
      <ul class="list-group list-group-flush" v-else>
        <li class="list-group-item" v-for="(transfer, index) in transfers" :key="index">
          <div class="header">
            <AppDate class="date" :date="fromUnixTimestampToDate(transfer.timestamp)" />
            <div class="badges">
              <span class="badge badge-pill badge-primary" v-if="compareAddresses(transfer.sender, address)"
                >Mi transferencia</span
              >
              <span class="badge badge-pill badge-secondary" v-if="compareAddresses(transfer.to, address)">Receptor</span>
            </div>
          </div>
          <span>
            <AppShowAddress type="entity" class="address" :address="transfer.sender" :goToProfile="true" />
            <span>&nbsp;transfirió&nbsp;</span>
            <AppShowEth :weis="transfer.value" />
            <span>&nbsp;a&nbsp;</span>
            <AppShowAddress type="entity" class="address" :address="transfer.to" :goToProfile="true" />
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
  name: 'TransfersListComponent',
  components: {},
  props: {
    loading: { type: Boolean, required: true },
    transfers: { type: Array, required: true },
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

    .badges {
      margin-left: auto;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;
    }
  }

  .address {
    font-weight: bold;
  }
}
</style>
