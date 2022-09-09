<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <span class="h3">Create Fund</span>
    </div>

    <div class="form-group">
      <fa-icon icon="circle-info" class="icon mr-2" size="2x"></fa-icon><span>Create a new fund costs 1 FundToken</span>
    </div>

    <div class="form-group">
      <label for="typeInput">Type</label>
      <select id="typeInput" class="form-control" v-model="data.type" :disabled="loading">
        <option v-for="(type, i) in types" :key="i" v-text="type.type" :value="type.value" :selected="type.selected"></option>
      </select>
    </div>

    <div class="form-group">
      <label for="nameInput">Name</label>
      <input
        type="text"
        class="form-control"
        id="nameInput"
        aria-describedby="nameHelp"
        v-model="data.name"
        :disabled="loading"
      />
      <small id="nameHelp" class="form-text text-muted"></small>
    </div>

    <div class="form-group">
      <label for="descriptionInput">Description</label>
      <textarea
        class="form-control"
        id="descriptionInput"
        rows="3"
        aria-describedby="descriptionHelp"
        v-model="data.description"
        :disabled="loading"
      ></textarea>
      <small id="descriptionHelp" class="form-text text-muted"></small>
    </div>

    <div class="form-group">
      <label for="creatorInput">Creator</label>
      <input
        type="text"
        readonly
        class="form-control-plaintext"
        id="creatorInput"
        aria-describedby="creatorHelp"
        v-model="address"
        :disabled="loading"
        v-if="isConnected"
      />
      <small id="creatorHelp" class="form-text text-muted" v-else>You are not connected to MetaMask</small>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="addMeAsAManagerInput"
          v-model="data.addMeAsAManager"
          :disabled="data.type === 'campaign' || data.type === 'donation' || loading"
        />
        <label class="custom-control-label" for="addMeAsAManagerInput">Add me as manager</label>
      </div>
      <small id="creatorHelp" class="form-text text-muted"></small>
    </div>

    <div class="form-group">
      <label for="managersInput">Managers</label>
      <input
        type="text"
        class="form-control"
        id="managersInput"
        aria-describedby="managersHelp"
        v-model="data.managers"
        :disabled="loading"
      />
      <small id="managersHelp" class="form-text text-muted">Add address of other admins separated by comma (,)</small>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="managersCanBeAddedOrRemovedInput"
          v-model="data.managersCanBeAddedOrRemoved"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="managersCanBeAddedOrRemovedInput">Managers can be added or removed</label>
      </div>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="managersCanTransferMoneyWithoutARequestInput"
          v-model="data.managersCanTransferMoneyWithoutARequest"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="managersCanTransferMoneyWithoutARequestInput"
          >Managers can transfer money without a request</label
        >
      </div>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="requestsCanBeCreatedInput"
          v-model="data.requestsCanBeCreated"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="requestsCanBeCreatedInput">Requests can be created</label>
      </div>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="onlyManagersCanCreateARequestInput"
          v-model="data.onlyManagersCanCreateARequest"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="onlyManagersCanCreateARequestInput">Only managers can create a request</label>
      </div>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="onlyContributorsCanApproveARequestInput"
          v-model="data.onlyContributorsCanApproveARequest"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="onlyContributorsCanApproveARequestInput"
          >Only contributors can approve a request</label
        >
      </div>
    </div>

    <div class="form-group">
      <label for="minimumContributionPercentageRequiredInput">Minimum contribution percentage required</label>
      <input
        type="range"
        class="form-control-range"
        id="minimumContributionPercentageRequiredInput"
        v-model="data.minimumContributionPercentageRequired"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <input
        type="number"
        class="form-control"
        id="minimumContributionPercentageRequiredInput"
        aria-describedby="minimumContributionPercentageRequiredHelp"
        min="0"
        v-model="data.minimumContributionPercentageRequired"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="minimumApprovalsPercentageRequiredInput">Minimum approvals percentage required</label>
      <input
        type="range"
        class="form-control-range"
        id="minimumApprovalsPercentageRequiredInput"
        v-model="data.minimumApprovalsPercentageRequired"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <input
        type="number"
        class="form-control"
        id="minimumApprovalsPercentageRequiredInput"
        aria-describedby="minimumApprovalsPercentageRequiredHelp"
        min="0"
        v-model="data.minimumApprovalsPercentageRequired"
        :disabled="loading"
      />
    </div>

    <button type="submit" class="btn btn-primary" v-if="!loading">Create</button>
    <button class="btn btn-primary" type="button" disabled v-if="loading">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Loading...
    </button>
  </form>
</template>

<script>
import Web3 from 'web3';
import { getMessages } from '@/dictionary';
import { mapState, mapGetters } from 'vuex';
import { addNotification } from '@/composables/useNotifications';
import { transaction } from '@/helpers/helpers';

export default {
  name: 'CreateFundFormComponent',
  data() {
    return {
      loading: false,
      types: [
        {
          type: 'Custom fund',
          value: '',
          selected: true,
        },
        {
          type: 'Friends fund',
          value: 'friends',
          selected: false,
        },
        {
          type: 'Campaign fund',
          value: 'campaign',
          selected: false,
        },
        {
          type: 'Donation fund',
          value: 'donation',
          selected: false,
        },
      ],
      data: {
        type: '',
        name: '',
        description: '',
        addMeAsAManager: true,
        managers: '',
        managersCanBeAddedOrRemoved: true,
        managersCanTransferMoneyWithoutARequest: true,
        requestsCanBeCreated: true,
        onlyManagersCanCreateARequest: false,
        onlyContributorsCanApproveARequest: false,
        minimumContributionPercentageRequired: 5,
        minimumApprovalsPercentageRequired: 50,
      },
    };
  },
  computed: {
    ...getMessages(['']),

    ...mapState({
      address: (state) => state.connection.address,
    }),
    ...mapGetters(['isConnected']),

    splitAddress() {
      let splitAccount = '';

      for (let i = 0; i < 4; i++) {
        splitAccount += this.address.charAt(i);
      }
      splitAccount += '...';
      for (let i = this.address.length - 4; i < this.address.length; i++) {
        splitAccount += this.address.charAt(i);
      }

      return splitAccount;
    },
  },
  watch: {
    'data.type'(newValue) {
      switch (newValue) {
        case 'friends':
          this.data.addMeAsAManager = true;
          this.data.managersCanBeAddedOrRemoved = true;
          this.data.managersCanTransferMoneyWithoutARequest = true;
          this.data.requestsCanBeCreated = true;
          this.data.onlyManagersCanCreateARequest = false;
          this.data.onlyContributorsCanApproveARequest = false;
          this.data.minimumContributionPercentageRequired = 0;
          break;
        case 'campaign':
          this.data.addMeAsAManager = true;
          this.data.managersCanBeAddedOrRemoved = false;
          this.data.managersCanTransferMoneyWithoutARequest = false;
          this.data.requestsCanBeCreated = true;
          this.data.onlyManagersCanCreateARequest = true;
          this.data.onlyContributorsCanApproveARequest = true;
          this.data.minimumContributionPercentageRequired = 5;
          break;
        case 'donation':
          this.data.addMeAsAManager = true;
          this.data.managersCanBeAddedOrRemoved = true;
          this.data.managersCanTransferMoneyWithoutARequest = true;
          this.data.requestsCanBeCreated = true;
          this.data.onlyManagersCanCreateARequest = true;
          this.data.onlyContributorsCanApproveARequest = true;
          this.data.minimumContributionPercentageRequired = 5;
          break;
      }
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;
        const tx = await transaction(
          'FundFactory',
          'createFund',
          [
            this.data.name,
            this.data.description,
            this.getArrayOfManagers(),
            this.data.managersCanBeAddedOrRemoved,
            this.data.managersCanTransferMoneyWithoutARequest,
            this.data.requestsCanBeCreated,
            this.data.onlyManagersCanCreateARequest,
            this.data.onlyContributorsCanApproveARequest,
            this.data.minimumContributionPercentageRequired,
            this.data.minimumApprovalsPercentageRequired,
          ],
          undefined,
          false,
        );
        addNotification({
          message: 'Fund deployed to: ' + tx.events.NewFund.returnValues.fundAddress,
          type: 'success',
        });
        this.data = {
          type: '',
          name: '',
          description: '',
          addMeAsAManager: true,
          managers: '',
          managersCanBeAddedOrRemoved: true,
          managersCanTransferMoneyWithoutARequest: true,
          requestsCanBeCreated: true,
          onlyManagersCanCreateARequest: false,
          onlyContributorsCanApproveARequest: false,
          minimumContributionPercentageRequired: 5,
          minimumApprovalsPercentageRequired: 50,
        };
      } catch (err) {
        let errMessage = err.message.trim();
        if (errMessage === 'Execution reverted: ERC20: burn amount exceeds balance')
          errMessage = 'You need to have 1 FundToken to create a new fund';
        addNotification({ message: errMessage, type: 'error' });
      } finally {
        this.loading = false;
      }
    },
    getArrayOfManagers() {
      let managers = [];
      if (this.data.addMeAsAManager) managers.push(this.address);
      const otherManagers = this.data.managers.split(',');
      otherManagers.forEach((manager) => {
        const managerAddress = manager.trim();
        if (Web3.utils.isAddress(managerAddress)) managers.push(managerAddress);
      });
      return managers;
    },
  },
};
</script>

<style scoped>
.icon {
  color: rgb(59, 59, 59);
}
</style>