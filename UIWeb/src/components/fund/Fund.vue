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
        <p class="align-items">
          <span class="text-bold">Total contributions</span>:&nbsp;<AppShowAmount
            :amount="totalContributionsInEth"
            singular="ETH"
          />
          <button
            type="button"
            class="btn btn-link btn-show-contributors ml-1"
            data-toggle="modal"
            data-target="#contributorsModal"
          >
            Show contributors
          </button>
        </p>
        <p>
          <span class="text-bold">Managers can transfer money without a request</span>:&nbsp;<AppBadge
            :check="fund._managersCanTransferMoneyWithoutARequest"
          />
        </p>
        <p><span class="text-bold">Requests can be created</span>:&nbsp;<AppBadge :check="fund._requestsCanBeCreated" /></p>
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
          <button
            type="button"
            class="btn btn-secondary"
            data-toggle="modal"
            data-target="#transferModal"
            v-if="fund._managersCanTransferMoneyWithoutARequest && isManager"
          >
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
    <ManagersModal :fund="fund" :isManager="isManager" />
    <ContributeModal :fund="fund" />
    <ContributorsModal :fund="fund" />
    <TransferModal :fund="fund" v-if="fund._managersCanTransferMoneyWithoutARequest && isManager" />
    <RequestsModal :fund="fund" :isManager="isManager" />
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
import ContributorsModal from '@/components/fund/modals/ContributorsModal.vue';
import TransferModal from '@/components/fund/modals/TransferModal.vue';
import RequestsModal from '@/components/fund/modals/request/RequestsModal.vue';

export default {
  name: 'FundComponent',
  components: {
    ManagersModal,
    ContributeModal,
    ContributorsModal,
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
        _managers: [],
        _managersCanBeAddedOrRemoved: false,
        _contributors: [],
        _totalContributions: 0,
        _managersCanTransferMoneyWithoutARequest: false,
        _requests: [],
        _requestsCanBeCreated: false,
        _onlyManagersCanCreateARequest: false,
        _onlyContributorsCanApproveARequest: false,
        _minimumContributionPercentageRequired: 0,
        _minimumApprovalsPercentageRequired: 0,
      },
      newManagerSubscription: null,
      removeManagerSubscription: null,
      contributeSubscription: null,
      transferSubscription: null,
      newRequestSubscription: null,
      approveRequestSubscription: null,
      finalizeRequestSubscription: null,
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),

    isManager() {
      if (this.fund._managers.findIndex((manager) => manager.toLowerCase() === this.address.toLowerCase()) >= 0) return true;
      return false;
    },

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
    const getSearchSummaryPromise = () => {
      return new Promise((resolve) => {
        const searchSummary = async () => {
          this.fund = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getSummary');
          await getSearchContributorsPromise(this.fund._contributors);
          resolve();
        };
        searchSummary();
      });
    };

    const getSearchContributorsPromise = (fundContributors) => {
      return new Promise((resolve) => {
        const searchContributors = async () => {
          if (!fundContributors)
            fundContributors = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getContributors');

          let contributors = [];

          if (fundContributors.length > 0) {
            contributors = Array(fundContributors.length);

            await Promise.all(
              Array(fundContributors.length)
                .fill()
                .map((element, index) => {
                  return call(
                    { name: 'Fund', address: this.$route.params.fundAddress },
                    'contributions',
                    [fundContributors[index]],
                    {},
                    (res) => {
                      contributors[index] = {
                        contributor: fundContributors[index],
                        contribution: res,
                      };
                    },
                  );
                }),
            );
          }

          this.fund._contributors = contributors;
          resolve();
        };
        searchContributors();
      });
    };

    const getSearchRequestsPromise = () => {
      return new Promise((resolve) => {
        const searchRequests = async () => {
          const totalRequests = parseInt(await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'requestsCount'));
          let requests = [];

          if (totalRequests > 0) {
            requests = Array(totalRequests);

            await Promise.all(
              Array(totalRequests)
                .fill()
                .map((element, index) => {
                  return call({ name: 'Fund', address: this.$route.params.fundAddress }, 'requests', [index], {}, (res) => {
                    requests[index] = res;
                  });
                }),
            );
          }

          this.fund._requests = requests;
          resolve();
        };
        searchRequests();
      });
    };

    // load fund info
    this.loading = true;
    await Promise.all([getSearchSummaryPromise(), getSearchRequestsPromise()]);
    this.loading = false;

    // subscriptions
    this.newManagerSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'NewManager',
      undefined,
      async () => {
        this.fund._managers = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getManagers');
      },
    );
    this.removeManagerSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'RemoveManager',
      undefined,
      async () => {
        this.fund._managers = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getManagers');
      },
    );
    this.contributeSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'Contribute',
      undefined,
      async () => {
        await Promise.all([
          getSearchContributorsPromise(),
          call({ name: 'Fund', address: this.$route.params.fundAddress }, 'totalContributions', [], {}, (res) => {
            this.fund._totalContributions = res;
          }),
          call({ name: 'Fund', address: this.$route.params.fundAddress }, 'balance', [], {}, (res) => {
            this.fund._balance = res;
          }),
        ]);
      },
    );
    this.transferSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'Transfer',
      undefined,
      async () => {
        this.fund._balance = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'balance');
      },
    );
    this.newRequestSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'NewRequest',
      undefined,
      () => {
        getSearchRequestsPromise();
      },
    );
    this.approveRequestSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'ApproveRequest',
      undefined,
      () => {
        getSearchRequestsPromise();
      },
    );
    this.finalizeRequestSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'FinalizeRequest',
      undefined,
      () => {
        getSearchRequestsPromise();
      },
    );
  },
  unmounted() {
    if (this.newManagerSubscription) this.newManagerSubscription.unsubscribe();
    if (this.removeManagerSubscription) this.removeManagerSubscription.unsubscribe();
    if (this.contributeSubscription) this.contributeSubscription.unsubscribe();
    if (this.transferSubscription) this.transferSubscription.unsubscribe();
    if (this.newRequestSubscription) this.newRequestSubscription.unsubscribe();
    if (this.approveRequestSubscription) this.approveRequestSubscription.unsubscribe();
    if (this.finalizeRequestSubscription) this.finalizeRequestSubscription.unsubscribe();
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

.align-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.btn-show-contributors {
  font-size: 0.9rem;
}

.btn-show-contributors:focus {
  box-shadow: none;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.buttons .btn {
  margin: 0 2px;
}
</style>
