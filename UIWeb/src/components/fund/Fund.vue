<template>
  <div>
    <div class="loading mb-2" v-if="loading">
      <AppSpinner class="spinner" size="big" />
    </div>
    <div class="card" v-else>
      <div class="card-header text-center">
        <span v-text="fund._name" />
        <div class="fund-info">
          <span
            class="badge badge-pill badge-primary my-fund-info mb-1"
            v-if="address.toLowerCase() === fund._creator.toLowerCase()"
            >My fund</span
          >
          <span class="badge badge-pill" :class="'badge-' + fundType.class" v-if="fundType" v-text="fundType.type" />
        </div>
      </div>
      <div class="card-body">
        <div class="body-header px-3">
          <img class="img" src="../../assets/imgs/fund.png" />
          <div class="w-100 ml-5" v-if="fund._description">
            <span v-text="fund._description" />
          </div>
        </div>
        <p class="card-text h5 text-center my-3 information-text">Information</p>
        <p class="card-text"><span class="text-bold">Fund address</span>:&nbsp;{{ fundAddress }}</p>
        <p class="card-text">
          <span class="text-bold">Current balance</span>:&nbsp;<AppShowAmount :amount="balanceInEth" singular="ETH" />
        </p>
        <p class="card-text"><span class="text-bold">Creator</span>:&nbsp;{{ creatorAddress }}</p>
        <p>
          <span class="text-bold">Managers can be added or removed</span>:&nbsp;<AppBadge
            :check="fund._managersCanBeAddedOrRemoved"
          />
        </p>
        <p>
          <span class="text-bold">Total contributions:</span>:&nbsp;<AppShowAmount
            :amount="totalContributionsInEth"
            singular="ETH"
          />
        </p>
        <p>
          <span class="text-bold">Managers can transfer money without a request</span>&nbsp;<AppBadge
            :check="fund._managersCanTransferMoneyWithoutARequest"
          />
        </p>
        <p><span class="text-bold">Requests can be created:</span>:&nbsp;<AppBadge :check="fund._requestsCanBeCreated" /></p>
        <p>
          <span class="text-bold">Only managers can create a request</span>:&nbsp;<AppBadge
            :check="fund._onlyManagersCanCreateARequest"
          />
        </p>
        <p>
          <span class="text-bold">Only contributors can approve a request</span>:&nbsp;<AppBadge
            :check="fund._onlyContributorsCanApproveARequest"
          />
        </p>
        <p>
          <span class="text-bold">Minimum contribution percentage required</span>:&nbsp;<span
            v-text="fund._minimumContributionPercentageRequired + '%'"
          />
        </p>
        <p>
          <span class="text-bold">Minimum approvals percentage required</span>:&nbsp;<span
            v-text="fund._minimumApprovalsPercentageRequired + '%'"
          />
        </p>
        <hr />
        <div class="buttons">
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#managersModal">
            <fa-icon icon="person" class="icon mr-2" />Managers
          </button>
          <button type="button" class="btn btn-success" data-toggle="modal" data-target="#contributeModal">
            <fa-icon icon="circle-dollar-to-slot" class="icon mr-2" />Contribute
          </button>
          <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#transferModal">
            <fa-icon icon="money-bill-transfer" class="icon mr-2" />Transfer
          </button>
          <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#requestsModal">
            <fa-icon icon="list-check" class="icon mr-2" />Requests
          </button>
        </div>
      </div>
      <div class="card-footer text-muted text-center"><AppDate :date="createdAt" /></div>
    </div>

    <!-- modals -->
    <ManagersModal :fund="fund" />
    <ContributeModal :fund="fund" />
    <TransferModal :fund="fund" />
    <RequestsModal :fund="fund" />
  </div>
</template>

<script>
import Web3 from 'web3';
import { mapState } from 'vuex';
import { getSplitAddress, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';
import { call, event } from '@/helpers/helpers';

// modals
import ManagersModal from '@/components/fund/modals/manager/ManagersModal.vue';
import ContributeModal from '@/components/fund/modals/ContributeModal.vue';
import TransferModal from '@/components/fund/modals/TransferModal.vue';
import RequestsModal from '@/components/fund/modals/RequestsModal.vue';

export default {
  name: 'FundComponent',
  components: {
    ManagersModal,
    ContributeModal,
    TransferModal,
    RequestsModal,
  },
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
      contributeSubscription: null,
      transferSubscription: null,
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),

    fundType() {
      if (
        this.fund._managersCanBeAddedOrRemoved &&
        this.fund._managersCanTransferMoneyWithoutARequest &&
        this.fund._requestsCanBeCreated &&
        !this.fund._onlyManagersCanCreateARequest &&
        !this.fund._onlyContributorsCanApproveARequest
      )
        return {
          type: 'Friends',
          class: 'success',
        };
      if (
        !this.fund._managersCanBeAddedOrRemoved &&
        !this.fund._managersCanTransferMoneyWithoutARequest &&
        this.fund._requestsCanBeCreated &&
        this.fund._onlyManagersCanCreateARequest &&
        this.fund._onlyContributorsCanApproveARequest
      )
        return {
          type: 'Campaign',
          class: 'warning',
        };
      if (
        this.fund._managersCanBeAddedOrRemoved &&
        this.fund._managersCanTransferMoneyWithoutARequest &&
        this.fund._requestsCanBeCreated &&
        this.fund._onlyManagersCanCreateARequest &&
        this.fund._onlyContributorsCanApproveARequest
      )
        return {
          type: 'Donation',
          class: 'secondary',
        };
      return undefined;
    },

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
    this.contributeSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'Contribute',
      undefined,
      async () => {
        this.fund = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getSummary');
      },
    );
    this.transferSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'Transfer',
      undefined,
      async () => {
        this.fund = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getSummary');
      },
    );
  },
  unmounted() {
    if (this.contributeSubscription) this.contributeSubscription.unsubscribe();
    if (this.transferSubscription) this.transferSubscription.unsubscribe();
  },
};
</script>

<style scoped>
.card {
  position: relative;
}

.card-header {
  padding-left: 80px;
  padding-right: 80px;
}

.fund-info {
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

.loading {
  position: fixed;
  top: 25vh;
  left: 0;
  width: 100%;
}

.spinner {
  margin: auto;
}

.card {
  margin: 10px 40px 20px 40px;
}

.body-header {
  background-color: rgb(244, 244, 244);
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.img {
  height: 200px;
  width: 200px;
  border-radius: 85px;
}

.information-text {
  color: white;
  background-color: rgb(85, 85, 202);
  padding: 8px;
  border-radius: 5px;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.btn {
  margin: 0 2px;
}
</style>
