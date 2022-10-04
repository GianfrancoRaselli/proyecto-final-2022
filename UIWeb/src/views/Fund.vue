<template>
  <div>
    <AppSpinner v-if="loading" class="mb-2" />
    <div v-else class="col-sm-12 col-lg-10 m-auto py-4 px-5 data-box">
      <div class="fund-info">
        <p class="h2 text-underline text-bold text-center mb-3" v-text="fund._name" />
        <p><strong>Fund address:</strong>&nbsp;<span v-text="fundAddress" /></p>
        <p><strong>Current balance:</strong>&nbsp;<AppShowAmount :amount="balanceInEth" singular="ETH" /></p>
        <p v-if="fund._description"><strong>Description:</strong>&nbsp;<span v-text="fund._description" /></p>
        <p><strong>Creator:</strong>&nbsp;<span v-text="creatorAddress" /></p>
        <p><strong>Created at:</strong>&nbsp;<AppDate :date="createdAt" /></p>
        <p><strong>Managers can be added or removed:</strong>&nbsp;<AppBadge :check="fund._managersCanBeAddedOrRemoved" /></p>
        <p><strong>Total contributions:</strong>&nbsp;<AppShowAmount :amount="totalContributionsInEth" singular="ETH" /></p>
        <p>
          <strong>Managers can transfer money without a request:</strong>&nbsp;<AppBadge
            :check="fund._managersCanTransferMoneyWithoutARequest"
          />
        </p>
        <p><strong>Requests can be created:</strong>&nbsp;<AppBadge :check="fund._requestsCanBeCreated" /></p>
        <p><strong>Only managers can create a request:</strong>&nbsp;<AppBadge :check="fund._onlyManagersCanCreateARequest" /></p>
        <p>
          <strong>Only contributors can approve a request:</strong>&nbsp;<AppBadge
            :check="fund._onlyContributorsCanApproveARequest"
          />
        </p>
        <p>
          <strong>Minimum contribution percentage required:</strong>&nbsp;<span
            v-text="fund._minimumContributionPercentageRequired + '%'"
          />
        </p>
        <p>
          <strong>Minimum approvals percentage required:</strong>&nbsp;<span
            v-text="fund._minimumApprovalsPercentageRequired + '%'"
          />
        </p>
      </div>

      <div class="buttons row mt-2">
        <div class="col-md-6 my-1">
          <button class="btn btn-light btn-block">Editar</button>
        </div>
        <div class="col-md-6 my-1">
          <button class="btn btn-light btn-block">Cambiar Clave</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';
import { getSplitAddress } from 'web3-simple-helpers';
import { call, fromUnixTimestampToDate } from '@/helpers/helpers';

export default {
  name: 'FundView',
  data() {
    return {
      loading: true,
      fund: {
        _address: '',
        _balance: 0,
        _name: '',
        _description: '',
        _creator: '',
        _createdAt: 0,
        _managersCanBeAddedOrRemoved: false,
        _totalContributions: 0,
        _managersCanTransferMoneyWithoutARequest: false,
        _requestsCanBeCreated: false,
        _onlyManagersCanCreateARequest: false,
        _onlyContributorsCanApproveARequest: false,
        _minimumContributionPercentageRequired: 0,
        _minimumApprovalsPercentageRequired: 0,
      },
    };
  },
  computed: {
    fundAddress() {
      return getSplitAddress(this.fund._address);
    },

    balanceInEth() {
      return parseFloat(Web3.utils.fromWei(this.fund._balance.toString(), 'ether'));
    },

    creatorAddress() {
      return getSplitAddress(this.fund._creator);
    },

    createdAt() {
      return fromUnixTimestampToDate(this.fund._createdAt);
    },

    totalContributionsInEth() {
      return parseFloat(Web3.utils.fromWei(this.fund._totalContributions.toString(), 'ether'));
    },
  },
  methods: {},
  async created() {
    this.loading = true;
    this.fund = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getSummary');
    this.loading = false;
  },
};
</script>

<style scoped>
.data-box {
  background-color: rgb(144, 149, 154);
  border: 1px rgb(48, 47, 47) solid;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
