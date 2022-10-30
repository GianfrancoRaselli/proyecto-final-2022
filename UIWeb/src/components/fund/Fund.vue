<template>
  <div>
    <div class="loading mb-2" v-if="loading">
      <AppSpinner class="spinner" size="big" />
    </div>
    <div class="card" v-else>
      <div class="card-header text-center">
        <span v-text="fund.name" />
        <div class="fund-info">
          <span class="badge badge-pill badge-primary my-fund-info mb-1" v-if="compareAddresses(address, fund.creator)"
            >My fund</span
          >
          <span class="badge badge-pill" :class="'badge-' + fundType.class" v-if="fundType" v-text="fundType.type" />
        </div>
      </div>
      <div class="card-body">
        <div class="body-header px-3">
          <img class="img" src="../../assets/imgs/fund.png" />
          <div class="w-100 ml-5" v-if="fund.description">
            <span v-text="fund.description" />
          </div>
        </div>
        <p class="h5 text-center my-3 information-text">Information</p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Fund address</span>:&nbsp;</span>
          {{ fundAddress }}
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Current balance</span>:&nbsp;</span>
          <AppShowEth :weis="fund.balance.toString()" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Creator</span>:&nbsp;</span>
          {{ creatorAddress }}
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Managers can be added or removed</span>:&nbsp;</span>
          <AppBadge :check="fund.managersCanBeAddedOrRemoved" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Total contributions</span>:&nbsp;</span>
          <AppShowEth :weis="fund.totalContributions.toString()" class="mr-3" />
          <button type="button" class="btn btn-link btn-show-contributors" data-toggle="modal" data-target="#contributorsModal">
            Show contributors
          </button>
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Managers can transfer money without a request</span>:&nbsp;</span>
          <AppBadge :check="fund.managersCanTransferMoneyWithoutARequest" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Requests can be created</span>:&nbsp;</span>
          <AppBadge :check="fund.requestsCanBeCreated" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Only managers can create a request</span>:&nbsp;</span>
          <AppBadge :check="fund.onlyManagersCanCreateARequest" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Only contributors can approve a request</span>:&nbsp;</span>
          <AppBadge :check="fund.onlyContributorsCanApproveARequest" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Minimum contribution percentage required</span>:&nbsp;</span>
          <span v-text="fund.minimumContributionPercentageRequired + '%'" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Minimum approvals percentage required</span>:&nbsp;</span>
          <span v-text="fund.minimumApprovalsPercentageRequired + '%'" />
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
            v-if="fund.managersCanTransferMoneyWithoutARequest && isManager"
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
    <TransferModal :fund="fund" v-if="fund.managersCanTransferMoneyWithoutARequest && isManager" />
    <RequestsModal :fund="fund" :isManager="isManager" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getSplitAddress, compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';
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
        address: '',
        balance: 0,
        name: '',
        description: '',
        creator: '',
        createdAt: 0,
        managers: [],
        managersCanBeAddedOrRemoved: false,
        contributors: [],
        totalContributions: 0,
        managersCanTransferMoneyWithoutARequest: false,
        requests: [],
        requestsCanBeCreated: false,
        onlyManagersCanCreateARequest: false,
        onlyContributorsCanApproveARequest: false,
        minimumContributionPercentageRequired: 0,
        minimumApprovalsPercentageRequired: 0,
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
      if (this.fund.managers.findIndex((manager) => compareAddresses(manager, this.address)) >= 0) return true;
      return false;
    },

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

    fundAddress() {
      return getSplitAddress(this.fund.address);
    },

    creatorAddress() {
      return getSplitAddress(this.fund.creator);
    },

    createdAt() {
      return fromUnixTimestampToDate(this.fund.createdAt);
    },
  },
  methods: {
    compareAddresses,
  },
  async created() {
    const getSearchSummaryPromise = () => {
      return new Promise((resolve) => {
        const searchSummary = async () => {
          this.fund = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getSummary');
          await getSearchContributorsPromise(this.fund.contributors);
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

          this.fund.contributors = contributors;
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

          this.fund.requests = requests;
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
        this.fund.managers = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getManagers');
      },
    );
    this.removeManagerSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'RemoveManager',
      undefined,
      async () => {
        this.fund.managers = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getManagers');
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
            this.fund.totalContributions = res;
          }),
          call({ name: 'Fund', address: this.$route.params.fundAddress }, 'balance', [], {}, (res) => {
            this.fund.balance = res;
          }),
        ]);
      },
    );
    this.transferSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'Transfer',
      undefined,
      async () => {
        this.fund.balance = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'balance');
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

@media (min-width: 768px) {
  .card {
    margin: 0 30px;
  }
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

.info {
  display: flex;
  flex-direction: row;
  align-items: center;
}

@media (max-width: 600px) {
  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.btn-show-contributors {
  font-size: 0.9rem;
  padding: 0;
}

.btn-show-contributors:focus {
  box-shadow: none;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
