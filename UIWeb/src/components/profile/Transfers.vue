<template>
  <div class="container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="items" v-else>
      <div class="no-items" v-if="transfersOrdered && transfersOrdered.length === 0">
        <fa-icon icon="xmark" class="icon" size="5x" />
        <span v-if="filter === 'made'">La entidad no ha realizado ninguna transferencia aún.</span>
        <span v-if="filter === 'received'">La entidad no ha recibido ninguna transferencia aún.</span>
      </div>
      <div v-else>
        <div class="item" v-for="(transfer, index) in transfersOrdered" :key="index">
          <div class="header">
            <AppDate class="date" :date="fromUnixTimestampToDate(transfer.timestamp)" />
          </div>
          <span v-if="filter === 'made'">
            <AppShowAddress class="address" :address="transfer.sender" :goToProfile="true" />
            <span>&nbsp;transfirió&nbsp;</span>
            <AppShowEth :weis="transfer.value" />
            <span>&nbsp;a&nbsp;</span>
            <AppShowAddress class="address" :address="transfer.to" :goToProfile="true" />
            <span>&nbsp;del fondo:&nbsp;</span>
            <span class="hover" v-text="transfer.fundName" @click="goToFund(transfer.fundAddress)"></span>
          </span>
          <span v-if="filter === 'received'">
            <AppShowAddress class="address" :address="transfer.sender" />
            <span>&nbsp;recibió&nbsp;</span>
            <AppShowEth :weis="transfer.value" />
            <span>&nbsp;de&nbsp;</span>
            <AppShowAddress class="address" :address="transfer.to" />
            <span>&nbsp;del fondo:&nbsp;</span>
            <span class="hover" v-text="transfer.fundName" @click="goToFund(transfer.fundAddress)"></span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { goToFund } from '@/helpers/helpers';
import { fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ProfileTransfersComponent',
  components: {},
  props: {
    loading: { type: Boolean, required: true },
    transfers: { type: Array, required: true },
    filter: { type: String, required: true }, // made | received
  },
  data() {
    return {};
  },
  computed: {
    transfersOrdered() {
      return this.transfers.slice().sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
    },
  },
  watch: {},
  methods: {
    fromUnixTimestampToDate,
    goToFund,
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

    .item {
      padding: 0.65rem 0.55rem;
      border: 1px solid rgb(238, 238, 238);
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
      }

      .address {
        font-weight: bold;
      }
    }
  }
}
</style>
