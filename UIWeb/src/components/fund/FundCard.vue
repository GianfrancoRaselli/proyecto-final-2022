<template>
  <div class="card text-center">
    <div class="card-header">
      <span v-text="fund.name" />
      <div class="fund-info">
        <span class="badge badge-pill badge-primary my-fund-info mb-1" v-if="compareAddresses(address, fund.creator)"
          >My fund</span
        >
        <span class="badge badge-pill" :class="'badge-' + fundType.class" v-if="fundType" v-text="fundType.type" />
      </div>
    </div>
    <div class="card-body">
      <p class="card-text" v-text="fund.description" v-if="fund.description" />
      <p class="card-text"><span class="text-bold">Creator</span>: {{ splitAddress }}</p>
    </div>
    <div class="card-footer text-muted"><AppDate :date="createdAt" /></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getSplitAddress, compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'FundCardComponent',
  props: {
    fund: { type: Object, require: true },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),

    fundType() {
      if (
        this.fund.managersCanBeAddedOrRemoved &&
        this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        !this.fund.onlyManagersCanCreateARequest &&
        !this.fund.onlyContributorsCanApproveARequest
      )
        return {
          type: 'Friends',
          class: 'success',
        };
      if (
        !this.fund.managersCanBeAddedOrRemoved &&
        !this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        this.fund.onlyManagersCanCreateARequest &&
        this.fund.onlyContributorsCanApproveARequest
      )
        return {
          type: 'Campaign',
          class: 'warning',
        };
      if (
        this.fund.managersCanBeAddedOrRemoved &&
        this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        this.fund.onlyManagersCanCreateARequest &&
        this.fund.onlyContributorsCanApproveARequest
      )
        return {
          type: 'Donation',
          class: 'secondary',
        };
      return undefined;
    },

    splitAddress() {
      return getSplitAddress(this.fund.creator);
    },

    createdAt() {
      return fromUnixTimestampToDate(this.fund.createdAt);
    },
  },
  watch: {},
  methods: {
    compareAddresses,
  },
};
</script>

<style scoped>
.card {
  height: 98%;
  position: relative;
}

.card:hover {
  height: 100%;
  cursor: pointer;
  box-shadow: 0 0 4px rgb(65, 64, 64);
}

.card-header {
  padding-left: 65px;
  padding-right: 65px;
}

.fund-info {
  font-size: 0.8rem;
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.my-fund-info {
  width: fit-content;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
